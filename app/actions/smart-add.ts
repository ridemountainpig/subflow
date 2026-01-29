"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { gateway, generateText, Output } from "ai";
import { z } from "zod";
import { subscriptionServices } from "@/data/subscriptionServices";
import { getCurrenciesList } from "@/app/actions/action";

const AI_API_KEY = process.env.AI_API_KEY;
const API_ENDPOINT = process.env.AI_API_ENDPOINT;
const MODEL_NAME = process.env.AI_MODEL_NAME;
const AI_GATEWAY_MODEL = process.env.AI_GATEWAY_MODEL;

function buildPrompt(currencyCodes: string[]) {
    return `
    Analyze the provided content (image or text) to identify if it is a subscription receipt, invoice, or pricing details screenshot.

    If the content is NOT related to a subscription or payment confirmation, return STRICT JSON:
    { "error": "not_subscription" }

    If valid, extract:
    1. Service Name (e.g., Netflix, Spotify, AWS)
    2. Price (numeric value)
    3. Currency (must be one of the supported currency codes listed below, default to USD if unrecognized)
    4. Start Date (YYYY-MM-DD format, approximate if not explicit)
    5. Payment Cycle (monthly or yearly)

    Supported currency codes:
    ${currencyCodes.join(", ")}

    Currency alias mapping (convert to standard ISO code):
    - NT, NTD, NT$ should be returned as TWD
    - RMB or 人民幣 should be returned as CNY
    - ¥ in Japan context should be returned as JPY
    - ¥ in China context should be returned as CNY
    - £ should be returned as GBP
    - € should be returned as EUR
    - ₩ should be returned as KRW
    - ₹ should be returned as INR
    - R$ should be returned as BRL
    - $ without specific country context should be returned as USD

    Try to match the Service Name to one of these known services (use exact name if matched):
    ${subscriptionServices.map((s) => s.name).join(", ")}

    Return the result as a STRICT JSON object without markdown formatting.
    Structure for valid data:
    {
        "name": "Service Name",
        "price": 10.99,
        "currency": "USD",
        "date": "2024-01-01",
        "paymentCycle": "monthly"
    }
    `;
}

function parseAndProcessResult(generatedText: string, currencyCodes: string[]) {
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

    let refinedUuid = null;
    if (parsedData.name) {
        const normalizedName = parsedData.name
            .toLowerCase()
            .replace(/\s+/g, "");
        const match = subscriptionServices.find((s) => {
            const normalizedServiceName = s.name
                .toLowerCase()
                .replace(/\s+/g, "");
            return normalizedServiceName === normalizedName;
        });
        if (match) {
            refinedUuid = match.uuid;
        }
    }

    const validCurrency = currencyCodes.includes(parsedData.currency)
        ? parsedData.currency
        : "USD";

    return {
        name: parsedData.name,
        price: parsedData.price,
        currency: validCurrency,
        date: parsedData.date,
        paymentCycle: parsedData.paymentCycle,
        matchedServiceUuid: refinedUuid,
    };
}

function extractFormData(formData: FormData) {
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    if (!file && !text) {
        throw new Error("No content provided");
    }

    return { file, text };
}

async function getFileBase64(file: File) {
    const bytes = await file.arrayBuffer();
    return Buffer.from(bytes).toString("base64");
}

async function getPromptAndCurrencies() {
    const currenciesList = await getCurrenciesList();
    const currencyCodes = Object.keys(currenciesList.currencies);
    const prompt = buildPrompt(currencyCodes);
    return { prompt, currencyCodes };
}

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

    const { file, text } = extractFormData(formData);
    const { prompt, currencyCodes } = await getPromptAndCurrencies();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [];

    if (text) {
        parts.push({ text: text });
    }

    if (file) {
        const base64Data = await getFileBase64(file);
        parts.push({
            inlineData: {
                mimeType: file.type,
                data: base64Data,
            },
        });
    }

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

        return parseAndProcessResult(generatedText, currencyCodes);
    } catch (error) {
        console.error("Analyze Content Error:", error);
        throw error;
    }
}

export async function analyzeContentWithGateway(formData: FormData) {
    if (!AI_GATEWAY_MODEL) {
        throw new Error("AI_GATEWAY_MODEL is not set");
    }

    const { file, text } = extractFormData(formData);
    const { prompt, currencyCodes } = await getPromptAndCurrencies();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any[] = [];

    if (text) {
        content.push({ type: "text", text: text });
    }

    if (file) {
        const base64Data = await getFileBase64(file);
        content.push({
            type: "image",
            image: `data:${file.type};base64,${base64Data}`,
        });
    }

    content.push({ type: "text", text: prompt });

    try {
        const { output: result } = await generateText({
            model: gateway(AI_GATEWAY_MODEL),
            output: Output.object({
                schema: z.object({
                    error: z
                        .string()
                        .optional()
                        .describe("Reason if not a subscription"),
                    name: z.string().optional().describe("Service Name"),
                    price: z.number().optional().describe("Price"),
                    currency: z.string().optional().describe("Currency code"),
                    date: z
                        .string()
                        .optional()
                        .describe("Start Date (YYYY-MM-DD)"),
                    paymentCycle: z
                        .enum(["monthly", "yearly"])
                        .optional()
                        .describe("Payment Cycle"),
                }),
            }),
            messages: [
                {
                    role: "user",
                    content: content,
                },
            ],
        });

        if (result.error) {
            return { error: result.error };
        }

        const refinedUuid = result.name
            ? (subscriptionServices.find(
                  (s) =>
                      s.name.toLowerCase().replace(/\s+/g, "") ===
                      result.name?.toLowerCase().replace(/\s+/g, ""),
              )?.uuid ?? null)
            : null;

        const validCurrency =
            result.currency && currencyCodes.includes(result.currency)
                ? result.currency
                : "USD";

        const validPaymentCycle =
            result.paymentCycle === "monthly" ||
            result.paymentCycle === "yearly"
                ? result.paymentCycle
                : "monthly";

        return {
            name: result.name,
            price: result.price
                ? Math.round(result.price * 100) / 100
                : result.price,
            currency: validCurrency,
            date: result.date,
            paymentCycle: validPaymentCycle,
            matchedServiceUuid: refinedUuid,
        };
    } catch (error) {
        console.error("Analyze Content With Gateway Error:", error);
        throw error;
    }
}
