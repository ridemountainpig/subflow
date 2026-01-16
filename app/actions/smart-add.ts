"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { subscriptionServices } from "@/data/subscriptionServices";

const AI_API_KEY = process.env.AI_API_KEY;
const API_ENDPOINT = process.env.AI_API_ENDPOINT;
const MODEL_NAME = process.env.AI_MODEL_NAME;

export async function analyzeContent(formData: FormData) {
    if (!AI_API_KEY) {
        throw new Error("AI_API_KEY is not set");
    }
    if (!API_ENDPOINT) {
        throw new Error("AI_API_ENDPOINT is not set");
    }
    if (!MODEL_NAME) {
        throw new Error("AI_MODEL_NAME is not set");
    }

    const genAI = new GoogleGenerativeAI(AI_API_KEY);

    const model = genAI.getGenerativeModel(
        { model: MODEL_NAME },
        { baseUrl: API_ENDPOINT },
    );

    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    if (!file && !text) {
        throw new Error("No content provided");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [];

    if (text) {
        parts.push({ text: text });
    }

    if (file) {
        const bytes = await file.arrayBuffer();
        const base64Data = Buffer.from(bytes).toString("base64");
        parts.push({
            inlineData: {
                mimeType: file.type,
                data: base64Data,
            },
        });
    }

    const prompt = `
    Analyze the provided content (image or text) to identify if it is a subscription receipt, invoice, or pricing details screenshot.

    If the content is NOT related to a subscription or payment confirmation, return STRICT JSON:
    { "error": "not_subscription" }

    If valid, extract:
    1. Service Name (e.g., Netflix, Spotify, AWS)
    2. Price (numeric value)
    3. Currency (ISO 4217 code, e.g., USD, TWD, JPY)
    4. Start Date (YYYY-MM-DD format, approximate if not explicit)
    5. Payment Cycle (monthly or yearly)

    Also, try to match the Service Name to one of the following known services:
    ${subscriptionServices.map((s) => s.name).join(", ")}

    Return the result as a STRICT JSON object without markdown formatting.
    Structure for valid data:
    {
        "name": "Service Name",
        "price": 10.99,
        "currency": "USD",
        "date": "2024-01-01",
        "paymentCycle": "monthly",
        "matchedServiceUuid": "UUID from the list if found, else null"
    }
    `;

    parts.push({ text: prompt });

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: parts }],
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const response = await result.response;
        const generatedText = response.text();

        if (!generatedText) {
            throw new Error("No data returned from Gemini");
        }

        let parsedData;
        try {
            parsedData = JSON.parse(generatedText);
        } catch {
            const cleanedText = generatedText
                .replace(/```json\n?|\n?```/g, "")
                .trim();
            parsedData = JSON.parse(cleanedText);
        }

        if (parsedData.error) {
            return { error: parsedData.error };
        }

        let refinedUuid = parsedData.matchedServiceUuid;
        if (!refinedUuid && parsedData.name) {
            const match = subscriptionServices.find(
                (s) => s.name.toLowerCase() === parsedData.name.toLowerCase(),
            );
            if (match) {
                refinedUuid = match.uuid;
            }
        }

        return {
            name: parsedData.name,
            price: parsedData.price,
            currency: parsedData.currency,
            date: parsedData.date,
            paymentCycle: parsedData.paymentCycle,
            matchedServiceUuid: refinedUuid,
        };
    } catch (error) {
        console.error("Analyze Content Error:", error);
        throw error;
    }
}
