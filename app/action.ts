"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSubscriptionModel } from "@/models/Subscription";
import { Subscription } from "@/types/subscription";
import {
    CurrenciesList as CurrenciesListType,
    CurrenciesLive as CurrenciesLiveType,
} from "@/types/currency";

export async function addSubscription(subscriptionData: Subscription) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const db = await connectToDatabase();
    const Subscription = getSubscriptionModel(db);

    const subscription = new Subscription({
        ...subscriptionData,
        userId: userId,
    });

    await subscription.save();

    return {
        message: "Subscription added",
    };
}

export async function getSubscription() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const db = await connectToDatabase();
    const Subscription = getSubscriptionModel(db);

    const subscriptions = await Subscription.find({ userId });

    return JSON.parse(JSON.stringify(subscriptions));
}

export async function updateSubscription(
    subscriptionId: string,
    subscriptionData: Subscription,
) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const db = await connectToDatabase();
    const Subscription = getSubscriptionModel(db);

    try {
        await Subscription.updateOne(
            {
                _id: new Object(subscriptionId),
                userId: userId,
            },
            {
                $set: {
                    ...subscriptionData,
                    userId: userId,
                },
            },
        );

        return {
            message: "Subscription updated successfully",
        };
    } catch (error) {
        console.error("Error updating subscription:", error);
        throw new Error("Failed to update subscription");
    }
}

export async function deleteSubscription(subscriptionId: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const db = await connectToDatabase();
    const Subscription = getSubscriptionModel(db);

    try {
        await Subscription.deleteOne({
            _id: new Object(subscriptionId),
            userId: userId,
        });

        return {
            message: "Subscription deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting subscription:", error);
        throw new Error("Failed to delete subscription");
    }
}

export async function getCurrenciesList() {
    const apiKey = process.env.EXCHANGERATE_HOST_API_KEY;
    const url = `https://api.exchangerate.host/list?access_key=${apiKey}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            Accept: "application/json",
        },
        next: {
            revalidate: 86400 * 7, // 7 days
        },
    });
    const data: CurrenciesListType = await response.json();

    return data;
}

export async function getCurrenciesLive() {
    const apiKey = process.env.EXCHANGERATE_HOST_API_KEY;
    const url = `https://api.exchangerate.host/live?access_key=${apiKey}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            Accept: "application/json",
        },
        next: {
            revalidate: 86400, // 24 hours
        },
    });
    const data: CurrenciesLiveType = await response.json();

    return data;
}
