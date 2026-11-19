import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { runPaymentReminders } from "@/lib/reminder/job";

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

export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const summary = await runPaymentReminders();
        return Response.json(summary, {
            status: summary.failed > 0 ? 500 : 200,
        });
    } catch (error) {
        console.error("Payment reminder run failed:", error);
        return new Response("Payment reminder run failed", { status: 500 });
    }
}
