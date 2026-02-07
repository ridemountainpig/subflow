"use server";

import { type Language } from "@/lib/email/content";
import { generateEmail } from "@/lib/email/template";
import { getUserInfoById, requireAuth } from "@/app/actions/action";

const EMAIL_ENDPOINT = "https://api.zeabur.com/api/v1/zsend/emails";
const EMAIL_REQUEST_TIMEOUT_MS = 10_000;

export async function sendWelcomeEmail(language: Language): Promise<void> {
    const userId = await requireAuth();
    const userInfo = await getUserInfoById(userId);

    if (!userInfo || !userInfo.emailAddress) {
        throw new Error("User email not found");
    }

    const email = userInfo.emailAddress;

    const apiKey = process.env.EMAIL_API_KEY;
    const fromAddress = process.env.EMAIL_FROM_ADDRESS;

    if (!apiKey || !fromAddress) {
        throw new Error("Zeabur Email API Key or From Address not configured");
    }

    const { subject, html, text } = generateEmail(language);

    const controller = new AbortController();
    const timeout = setTimeout(
        () => controller.abort(),
        EMAIL_REQUEST_TIMEOUT_MS,
    );

    try {
        const response = await fetch(EMAIL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: `Subflow <${fromAddress}>`,
                to: [email],
                subject,
                html,
                text,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorPayload = await readResponsePayload(response);
            throw new Error(
                `Failed to send welcome email: status=${response.status}, payload=${errorPayload}`,
            );
        }

        const successPayload = await readResponsePayload(response);
        console.log(
            `Welcome email sent to ${maskEmail(email)}:`,
            successPayload,
        );
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error(
                `Email request timed out after ${EMAIL_REQUEST_TIMEOUT_MS}ms`,
            );
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

function readResponsePayload(response: Response): Promise<string> {
    return response.text().then((payloadText) => {
        if (!payloadText) return "";
        try {
            return JSON.stringify(JSON.parse(payloadText));
        } catch {
            return payloadText;
        }
    });
}

function maskEmail(email: string): string {
    const [localPart = "", domain = ""] = email.split("@");
    if (!domain) return "***";

    const visiblePrefix = localPart.slice(0, 2);
    return `${visiblePrefix}${"*".repeat(Math.max(localPart.length - 2, 1))}@${domain}`;
}
