import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSubscriptionModel } from "@/models/Subscription";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);

        const { id } = evt.data;
        const eventType = evt.type;

        if (eventType === "user.deleted") {
            try {
                const db = await connectToDatabase();
                const SubscriptionModel = getSubscriptionModel(db);
                await SubscriptionModel.deleteMany({ userId: id });
                return new Response("Webhook received", { status: 200 });
            } catch (error) {
                console.error("Error deleting subscription:", error);
                return new Response("Error deleting subscription", {
                    status: 500,
                });
            }
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }
}
