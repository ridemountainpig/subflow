import { Connection, Schema, Document } from "mongoose";

interface IPreferences extends Document {
    userId: string;
    notAmortizeYearlySubscriptions: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const PreferencesSchema = new Schema<IPreferences>({
    userId: { type: String, required: true },
    notAmortizeYearlySubscriptions: { type: Boolean, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

export const getPreferencesModel = (db: Connection) => {
    return (
        db.models.Preferences ||
        db.model<IPreferences>("Preferences", PreferencesSchema, "preferences")
    );
};
