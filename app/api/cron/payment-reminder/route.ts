import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import {
    runPaymentReminders,
    type ReminderRunOptions,
} from "@/lib/reminder/job";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(req: NextRequest): boolean {
    const secret = process.env.CRON_SECRET;
    if (!secret) return false;
    const expected = Buffer.from(`Bearer ${secret}`);
    const actual = Buffer.from(req.headers.get("authorization") ?? "");
    return (
        expected.length === actual.length && timingSafeEqual(expected, actual)
    );
}

/**
 * Optional JSON body for testing, e.g.
 * { "onlyEmail": "me@example.com", "date": "2026-11-30", "includeAll": true }.
 * Without onlyEmail the body must be empty and every user is processed.
 */
async function parseOptions(req: NextRequest): Promise<ReminderRunOptions> {
    const raw = (await req.text()).trim();
    if (!raw) return {};

    const body = JSON.parse(raw) as {
        onlyEmail?: unknown;
        date?: unknown;
        includeAll?: unknown;
    };
    const options: ReminderRunOptions = {};

    if (body.onlyEmail !== undefined && body.onlyEmail !== "") {
        if (
            typeof body.onlyEmail !== "string" ||
            !body.onlyEmail.includes("@")
        ) {
            throw new Error("onlyEmail must be an email address");
        }
        options.onlyEmail = body.onlyEmail;
    }
    if (body.date !== undefined && body.date !== "") {
        const match =
            typeof body.date === "string" &&
            /^(\d{4})-(\d{2})-(\d{2})$/.exec(body.date);
        if (!match) throw new Error("date must look like YYYY-MM-DD");
        const [year, month, date] = match.slice(1).map(Number);
        const check = new Date(Date.UTC(year, month - 1, date));
        if (
            check.getUTCFullYear() !== year ||
            check.getUTCMonth() !== month - 1 ||
            check.getUTCDate() !== date
        ) {
            throw new Error("date is not a real calendar date");
        }
        options.today = { year, month, date };
    }
    if (body.includeAll !== undefined) {
        options.includeAll =
            body.includeAll === true || body.includeAll === "true";
    }
    if (!options.onlyEmail && (options.today || options.includeAll)) {
        throw new Error("date and includeAll require onlyEmail");
    }
    return options;
}

export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) {
        return new Response("Unauthorized", { status: 401 });
    }

    let options: ReminderRunOptions;
    try {
        options = await parseOptions(req);
    } catch (error) {
        return new Response(
            error instanceof Error ? error.message : "Invalid request body",
            { status: 400 },
        );
    }

    try {
        const summary = await runPaymentReminders(options);
        return Response.json(summary, {
            status: summary.failed > 0 ? 500 : 200,
        });
    } catch (error) {
        console.error("Payment reminder run failed:", error);
        return new Response("Payment reminder run failed", { status: 500 });
    }
}
