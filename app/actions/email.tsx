"use server";

import { getContent, type Language } from "@/lib/email/content";
import { EmailTemplate } from "@/components/email/template";
import { getUserInfoById, requireAuth } from "@/app/actions/action";
import { render } from "@react-email/render";
import { maskEmail, sendEmail } from "@/lib/email/send";

export async function sendWelcomeEmail(language: Language): Promise<void> {
    const userId = await requireAuth();
    const userInfo = await getUserInfoById(userId);

    if (!userInfo || !userInfo.emailAddress) {
        throw new Error("User email not found");
    }

    const email = userInfo.emailAddress;
    const fromAddress = process.env.EMAIL_FROM_ADDRESS;

    if (!fromAddress) {
        throw new Error("EMAIL_FROM_ADDRESS is not configured");
    }

    const content = getContent(language);
    const html = await render(<EmailTemplate language={language} />);
    const text = await render(<EmailTemplate language={language} />, {
        plainText: true,
    });

    await sendEmail({
        from: `Subflow <${fromAddress}>`,
        to: email,
        subject: content.subject,
        html,
        text,
    });

    console.log(`Welcome email sent to ${maskEmail(email)}`);
}
