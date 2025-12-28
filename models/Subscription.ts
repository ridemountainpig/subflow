import { Connection, Schema, Document } from "mongoose";

interface ISubscription extends Document {
    userId: string;
    name: string;
    price: number;
    currency: string;
    startDate: {
        year: number;
        month: number;
        date: number;
    };
    paymentCycle: string;
    serviceId?: string;
    coSubscribers?: string[]; // Array of email addresses
}

export const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        currency: { type: String, required: true },
        startDate: {
            year: { type: Number, required: true },
            month: { type: Number, required: true },
            date: { type: Number, required: true },
        },
        paymentCycle: { type: String, required: true },
        serviceId: { type: String, required: false },
        coSubscribers: { type: [String], required: false, default: [] },
    },
    {
        timestamps: true,
    },
);

export const getSubscriptionModel = (db: Connection) => {
    return (
        db.models.Subscription ||
        db.model<ISubscription>(
            "Subscription",
            SubscriptionSchema,
            "subscriptions",
        )
    );
};
