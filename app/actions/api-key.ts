"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { getApiKeyModel } from "@/models/ApiKey";
import { generateApiKey, hashApiKey, getKeyPrefix } from "@/lib/api-key";
import { requireAuth } from "@/app/actions/action";

const API_KEY_NAME_MAX_LENGTH = 50;
const MAX_API_KEYS_PER_USER = 5;

export async function createApiKey(name: string) {
    const userId = await requireAuth();

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > API_KEY_NAME_MAX_LENGTH) {
        return { error: "INVALID_NAME" as const };
    }

    const db = await connectToDatabase();
    const ApiKey = getApiKeyModel(db);

    const existingCount = await ApiKey.countDocuments({ userId });
    if (existingCount >= MAX_API_KEYS_PER_USER) {
        return { error: "LIMIT_REACHED" as const };
    }

    const plainKey = generateApiKey();
    const keyHash = hashApiKey(plainKey);
    const keyPrefix = getKeyPrefix(plainKey);

    const apiKey = new ApiKey({
        name: trimmedName,
        keyPrefix,
        keyHash,
        userId,
    });

    await apiKey.save();

    return {
        id: apiKey._id.toString(),
        name: apiKey.name,
        keyPrefix: apiKey.keyPrefix,
        secretKey: plainKey,
        createdAt: apiKey.createdAt,
    };
}

export async function listApiKeys() {
    const userId = await requireAuth();

    const db = await connectToDatabase();
    const ApiKey = getApiKeyModel(db);

    const apiKeys = await ApiKey.find({ userId })
        .select("_id name keyPrefix createdAt lastUsedAt")
        .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(apiKeys));
}

export async function revokeApiKey(id: string) {
    const userId = await requireAuth();

    const db = await connectToDatabase();
    const ApiKey = getApiKeyModel(db);

    const result = await ApiKey.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
        return { error: "NOT_FOUND" as const };
    }

    return { message: "API Key revoked successfully" };
}
