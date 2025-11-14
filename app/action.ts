"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSubscriptionModel } from "@/models/Subscription";
import { getEmailModel } from "@/models/Email";
import { getPreferencesModel } from "@/models/Preferences";
import { Subscription } from "@/types/subscription";
import {
    CurrenciesList as CurrenciesListType,
    CurrenciesLive as CurrenciesLiveType,
} from "@/types/currency";

async function requireAuth(): Promise<string> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    return userId;
}

export async function addSubscription(subscriptionData: Subscription) {
    const userId = await requireAuth();

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
    const userId = await requireAuth();

    const db = await connectToDatabase();
    const Subscription = getSubscriptionModel(db);

    const subscriptions = await Subscription.find({ userId });

    return JSON.parse(JSON.stringify(subscriptions));
}

export async function updateSubscription(
    subscriptionId: string,
    subscriptionData: Subscription,
) {
    const userId = await requireAuth();

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
    const userId = await requireAuth();

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

export async function upsertEmail(
    email: string,
    language: "en" | "zh" | "ja",
    notify: boolean,
) {
    const userId = await requireAuth();

    const db = await connectToDatabase();
    const Email = getEmailModel(db);

    // check if the email already exists
    const existingEmail = await Email.findOne({ userId });

    if (existingEmail) {
        // if exists, update the record
        await Email.updateOne(
            { userId },
            {
                $set: {
                    email: email,
                    notify: notify,
                    language: language,
                    updatedAt: new Date(),
                },
            },
        );

        return {
            message: "Email updated",
            action: "updated",
        };
    } else {
        // if not exists, add the record
        const newEmail = new Email({
            email: email,
            notify: notify,
            language: language,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: userId,
        });

        await newEmail.save();

        return {
            message: "Email added",
        };
    }
}

export async function getEmail() {
    const userId = await requireAuth();

    const db = await connectToDatabase();
    const Email = getEmailModel(db);

    const emails = await Email.find({ userId });

    return JSON.parse(JSON.stringify(emails));
}

export async function upsertPreferences(
    notAmortizeYearlySubscriptions: boolean,
) {
    if (typeof notAmortizeYearlySubscriptions !== "boolean") {
        throw new Error(
            "Invalid parameter: notAmortizeYearlySubscriptions must be a boolean.",
        );
    }

    const userId = await requireAuth();

    const db = await connectToDatabase();
    const Preferences = getPreferencesModel(db);

    const existingPreferences = await Preferences.findOne({ userId });

    if (existingPreferences) {
        await Preferences.updateOne(
            { userId },
            { $set: { notAmortizeYearlySubscriptions } },
        );
    } else {
        await Preferences.create({
            notAmortizeYearlySubscriptions,
            userId,
        });
    }

    return {
        message: "Preferences updated",
    };
}

export async function getPreferences() {
    const userId = await requireAuth();

    const db = await connectToDatabase();
    const Preferences = getPreferencesModel(db);

    const preferences = await Preferences.find({ userId });

    return JSON.parse(JSON.stringify(preferences));
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
