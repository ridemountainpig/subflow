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
    paymentCycle: "monthly" | "yearly";
    serviceId?: string;
    coSubscribers?: string[]; // Array of email addresses
    createdAt?: Date;
    updatedAt?: Date;
};

export type SubscriptionWithPrice = Subscription & {
    convertedPrice: number;
};
