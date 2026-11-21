const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_REQUEST_TIMEOUT_MS = 10_000;

export interface SendEmailInput {
    from: string;
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/** Sends one email through Resend. Throws on any non-2xx response or timeout. */
export async function sendEmail(input: SendEmailInput): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured");
    }

    const controller = new AbortController();
    const timeout = setTimeout(
        () => controller.abort(),
        EMAIL_REQUEST_TIMEOUT_MS,
    );

    try {
        const response = await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: input.from,
                to: [input.to],
                subject: input.subject,
                html: input.html,
                ...(input.text ? { text: input.text } : {}),
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const payload = await response.text();
            throw new Error(
                `Failed to send email: status=${response.status}, payload=${payload}`,
            );
        }
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

export function maskEmail(email: string): string {
    const [localPart = "", domain = ""] = email.split("@");
    if (!domain) return "***";
    const visiblePrefix = localPart.slice(0, 2);
    return `${visiblePrefix}${"*".repeat(Math.max(localPart.length - 2, 1))}@${domain}`;
}
