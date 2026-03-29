import { CoSubscriber } from "./co-subscribers";

export type SubscriptionPaymentCycle = "monthly" | "quarterly" | "yearly";

export type Subscription = {
    _id?: string;
    userId: string;
    name: string;
    price: number;
    currency: string;
    startDate: {
        year: number;
        month: number;
        date: number;
    };
    paymentCycle: SubscriptionPaymentCycle;
    serviceId?: string;
    coSubscribers?: CoSubscriber[];
    isCoSubscription?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type SubscriptionWithPrice = Subscription & {
    convertedPrice: number;
};
