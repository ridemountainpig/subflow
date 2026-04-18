import { Connection, Schema, Document } from "mongoose";

interface IApiKey extends Document {
    name: string;
    keyPrefix: string;
    keyHash: string;
    userId: string;
    lastUsedAt?: Date;
}

export const ApiKeySchema = new Schema<IApiKey>(
    {
        name: { type: String, required: true, maxlength: 50 },
        keyPrefix: { type: String, required: true },
        keyHash: { type: String, required: true },
        userId: { type: String, required: true },

        lastUsedAt: { type: Date },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

ApiKeySchema.index({ userId: 1 });
ApiKeySchema.index({ keyHash: 1 }, { unique: true });

export const getApiKeyModel = (db: Connection) => {
    return (
        db.models.ApiKey || db.model<IApiKey>("ApiKey", ApiKeySchema, "apikeys")
    );
};
