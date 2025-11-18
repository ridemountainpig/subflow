import { Connection, Schema, Document } from "mongoose";

interface IEmail extends Document {
    userId: string;
    email: string;
    language: "en" | "zh" | "ja";
    notify: boolean;
}

export const EmailSchema = new Schema<IEmail>(
    {
        userId: { type: String, required: true },
        email: { type: String, required: false },
        language: { type: String, required: true, enum: ["en", "zh", "ja"] },
        notify: { type: Boolean, required: true },
    },
    {
        timestamps: true,
    },
);

EmailSchema.index({ userId: 1 }, { unique: true });

export const getEmailModel = (db: Connection) => {
    return db.models.Email || db.model<IEmail>("Email", EmailSchema, "emails");
};
