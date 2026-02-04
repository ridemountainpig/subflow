"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSubscriptionModel } from "@/models/Subscription";
import { getEmailModel } from "@/models/Email";
import { getPreferencesModel } from "@/models/Preferences";
import { Subscription } from "@/types/subscription";

export async function requireAuth(): Promise<string> {
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
        coSubscribers: subscriptionData.coSubscribers || [],
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

    const userInfo = await getUserInfoById(userId);
    const userEmail = userInfo?.emailAddress || "";

    const subscriptions = await Subscription.find({
        $or: [
            { userId },
            {
                coSubscribers: {
                    $elemMatch: {
                        email: userEmail,
                        confirm: true,
                    },
                },
            },
        ],
    });

    const subscriptionsWithIdentifier = subscriptions.map((sub) => ({
        ...sub.toObject(),
        isCoSubscription: sub.userId !== userId,
    }));

    return JSON.parse(JSON.stringify(subscriptionsWithIdentifier));
}

export async function getSubscriptionCount() {
    try {
        const db = await connectToDatabase();
        const Subscription = getSubscriptionModel(db);

        const count = await Subscription.countDocuments({});

        return count;
    } catch (error) {
        console.error("Error getting subscription count:", error);
        return 0;
    }
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
                _id: subscriptionId,
                userId: userId,
            },
            {
                $set: {
                    ...subscriptionData,
                    userId: userId,
                    coSubscribers: subscriptionData.coSubscribers || [],
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
            _id: subscriptionId,
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

export async function getSubscriptionsByCoSubscriberEmail(userEmail: string) {
    const userId = await requireAuth();

    const userInfo = await getUserInfoById(userId);
    if (
        !userInfo ||
        userInfo.emailAddress.toLowerCase() !== userEmail.toLowerCase().trim()
    ) {
        throw new Error(
            "Unauthorized: Email does not match authenticated user",
        );
    }

    const db = await connectToDatabase();
    const Subscription = getSubscriptionModel(db);

    try {
        const subscriptions = await Subscription.find({
            coSubscribers: {
                $elemMatch: {
                    email: userEmail.toLowerCase().trim(),
                    confirm: false,
                },
            },
        });

        return JSON.parse(JSON.stringify(subscriptions));
    } catch (error) {
        console.error(
            "Error getting subscriptions by co-subscriber email:",
            error,
        );
        throw new Error("Failed to get subscriptions by co-subscriber email");
    }
}

export async function confirmCoSubscriberInvite(
    subscriptionId: string,
    userEmail: string,
) {
    const userId = await requireAuth();

    const userInfo = await getUserInfoById(userId);
    if (
        !userInfo ||
        userInfo.emailAddress.toLowerCase() !== userEmail.toLowerCase().trim()
    ) {
        throw new Error(
            "Unauthorized: Email does not match authenticated user",
        );
    }

    const db = await connectToDatabase();
    const Subscription = getSubscriptionModel(db);

    try {
        await Subscription.updateOne(
            {
                _id: subscriptionId,
                "coSubscribers.email": userEmail.toLowerCase().trim(),
            },
            {
                $set: {
                    "coSubscribers.$.confirm": true,
                },
            },
        );

        return {
            message: "Co-subscriber invite confirmed successfully",
        };
    } catch (error) {
        console.error("Error confirming co-subscriber invite:", error);
        throw new Error("Failed to confirm co-subscriber invite");
    }
}

export async function rejectCoSubscriberInvite(
    subscriptionId: string,
    userEmail: string,
) {
    const userId = await requireAuth();

    const userInfo = await getUserInfoById(userId);
    if (
        !userInfo ||
        userInfo.emailAddress.toLowerCase() !== userEmail.toLowerCase().trim()
    ) {
        throw new Error(
            "Unauthorized: Email does not match authenticated user",
        );
    }

    const db = await connectToDatabase();
    const Subscription = getSubscriptionModel(db);

    try {
        await Subscription.updateOne(
            {
                _id: subscriptionId,
            },
            {
                $pull: {
                    coSubscribers: {
                        email: userEmail.toLowerCase().trim(),
                    },
                },
            },
        );

        return {
            message: "Co-subscriber invite rejected successfully",
        };
    } catch (error) {
        console.error("Error rejecting co-subscriber invite:", error);
        throw new Error("Failed to reject co-subscriber invite");
    }
}

// User related functions
export async function checkEmailRegistered(email: string): Promise<boolean> {
    await requireAuth();

    try {
        const client = await clerkClient();
        // Search for users by email address
        const users = await client.users.getUserList({
            emailAddress: [email.toLowerCase().trim()],
            limit: 1,
        });

        return users.data.length > 0;
    } catch (error) {
        console.error("Error checking email registration:", error);
        return false;
    }
}

export async function getUserInfoByEmail(email: string) {
    await requireAuth();

    try {
        const client = await clerkClient();
        const users = await client.users.getUserList({
            emailAddress: [email.toLowerCase().trim()],
            limit: 1,
        });

        if (users.data.length === 0) {
            return null;
        }

        const user = users.data[0];
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            emailAddress: email.toLowerCase().trim(),
        };
    } catch (error) {
        console.error("Error getting user info:", error);
        return null;
    }
}

export async function getUserInfoById(userId: string) {
    await requireAuth();

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            emailAddress:
                user.emailAddresses[0]?.emailAddress?.toLowerCase().trim() ||
                "",
        };
    } catch (error) {
        console.error("Error getting user info by id:", error);
        return null;
    }
}

// Email related functions
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

// Preferences related functions
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
