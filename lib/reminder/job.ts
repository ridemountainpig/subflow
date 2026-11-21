import { connectToDatabase } from "@/lib/mongodb";
import { getEmailModel } from "@/models/Email";
import { getSubscriptionModel } from "@/models/Subscription";
import { maskEmail, sendEmail } from "@/lib/email/send";
import {
    getTodayInTimeZone,
    isChargedTomorrow,
    type CalendarDate,
} from "@/lib/reminder/schedule";
import {
    buildReminderEmail,
    type ReminderItem,
    type ReminderLanguage,
} from "@/lib/reminder/template";

// Resend's default rate limit is 2 requests per second.
const SEND_INTERVAL_MS = 600;

const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export interface ReminderRecipient {
    userId: string;
    email: string;
    language: ReminderLanguage;
}

interface StoredSubscription {
    userId: string;
    name: string;
    price: number;
    currency: string;
    paymentCycle: string;
    startDate: { year: number; month: number; date: number };
    coSubscribers?: {
        email: string;
        confirm: boolean;
        amount?: number;
        currency?: string;
    }[];
}

export interface ReminderRunOptions {
    now?: Date;
    /** Test mode: only consider this one recipient. */
    onlyEmail?: string;
    /** Test mode: pretend "today" is this date (in the reminder time zone). */
    today?: CalendarDate;
    /** Test mode: include every subscription, not only the ones due tomorrow. */
    includeAll?: boolean;
}

export interface ReminderRunSummary {
    date: CalendarDate;
    test: boolean;
    recipients: number;
    sent: number;
    failed: number;
}

/**
 * Split a recipient's due subscriptions into the ones they own and the ones
 * they share as a confirmed co-subscriber (showing their own share).
 */
export function toReminderItems(
    recipient: ReminderRecipient,
    dueSubscriptions: StoredSubscription[],
): { own: ReminderItem[]; shared: ReminderItem[] } {
    const email = recipient.email.toLowerCase().trim();
    const own: ReminderItem[] = [];
    const shared: ReminderItem[] = [];

    for (const s of dueSubscriptions) {
        if (s.userId === recipient.userId) {
            own.push({
                name: s.name,
                amount: s.price,
                currency: s.currency,
                paymentCycle: s.paymentCycle,
                startDate: s.startDate,
            });
            continue;
        }
        const co = s.coSubscribers?.find(
            (c) => c.confirm && c.email.toLowerCase().trim() === email,
        );
        if (co) {
            shared.push({
                name: s.name,
                amount: co.amount ?? s.price,
                currency: co.currency ?? s.currency,
                paymentCycle: s.paymentCycle,
                startDate: s.startDate,
            });
        }
    }

    return { own, shared };
}

/**
 * Everything that reaches one user happens here, so other channels (such as
 * push notifications) can be added next to the email.
 */
export async function sendReminderToUser(
    recipient: ReminderRecipient,
    own: ReminderItem[],
    shared: ReminderItem[],
): Promise<void> {
    const from = process.env.REMINDER_EMAIL_FROM_ADDRESS;
    if (!from) {
        throw new Error("REMINDER_EMAIL_FROM_ADDRESS is not configured");
    }

    const { subject, html } = buildReminderEmail(
        recipient.language,
        own,
        shared,
    );
    await sendEmail({
        from: `Subflow <${from}>`,
        to: recipient.email,
        subject,
        html,
    });
}

export async function runPaymentReminders(
    options: ReminderRunOptions = {},
): Promise<ReminderRunSummary> {
    const onlyEmail = options.onlyEmail?.toLowerCase().trim();
    const test = Boolean(onlyEmail);
    if (!test && (options.today || options.includeAll)) {
        throw new Error("today and includeAll require onlyEmail");
    }
    const today = options.today ?? getTodayInTimeZone(options.now);
    const db = await connectToDatabase();
    const EmailModel = getEmailModel(db);
    const SubscriptionModel = getSubscriptionModel(db);

    const recipientFilter = onlyEmail
        ? // Test mode reaches the one address even if its reminders are off.
          { email: { $regex: `^${escapeRegex(onlyEmail)}$`, $options: "i" } }
        : { notify: true, email: { $nin: [null, ""] } };
    const recipients = (await EmailModel.find(recipientFilter)
        .select("userId email language")
        .lean()) as unknown as ReminderRecipient[];

    const summary: ReminderRunSummary = {
        date: today,
        test,
        recipients: 0,
        sent: 0,
        failed: 0,
    };

    let attempted = 0;
    for (const recipient of recipients) {
        try {
            const email = recipient.email.toLowerCase().trim();
            const subscriptions = (await SubscriptionModel.find({
                $or: [
                    { userId: recipient.userId },
                    {
                        coSubscribers: {
                            $elemMatch: { email, confirm: true },
                        },
                    },
                ],
            }).lean()) as unknown as StoredSubscription[];

            const due = options.includeAll
                ? subscriptions
                : subscriptions.filter((s) => isChargedTomorrow(s, today));
            const { own, shared } = toReminderItems(recipient, due);
            if (own.length + shared.length === 0) continue;

            summary.recipients += 1;
            if (attempted > 0) {
                await new Promise((r) => setTimeout(r, SEND_INTERVAL_MS));
            }
            attempted += 1;
            await sendReminderToUser(recipient, own, shared);
            summary.sent += 1;
        } catch (error) {
            summary.failed += 1;
            console.error(
                `Payment reminder failed for ${maskEmail(recipient.email)}:`,
                error,
            );
        }
    }

    console.log("Payment reminder run finished:", summary);
    return summary;
}
