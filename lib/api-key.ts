import { randomBytes, createHash } from "crypto";

const API_KEY_PREFIX = "sk_sf_";

export function generateApiKey(): string {
    const randomPart = randomBytes(32).toString("hex");
    return `${API_KEY_PREFIX}${randomPart}`;
}

export function hashApiKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
}

export function getKeyPrefix(key: string): string {
    return key.substring(0, API_KEY_PREFIX.length + 8) + "...";
}
