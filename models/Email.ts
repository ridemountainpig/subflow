import { Connection, Schema, Document } from "mongoose";

interface IEmail extends Document {
    userId: string;
    email: string;
    language: "en" | "zh" | "ja";
    notify: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const EmailSchema = new Schema<IEmail>({
    userId: { type: String, required: true },
    email: { type: String, required: false },
    language: { type: String, required: true, enum: ["en", "zh", "ja"] },
    notify: { type: Boolean, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

export const getEmailModel = (db: Connection) => {
    return db.models.Email || db.model<IEmail>("Email", EmailSchema, "emails");
};
