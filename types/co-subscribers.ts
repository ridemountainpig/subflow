export type UserInfo = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    emailAddress: string;
};

export type CoSubscriber = {
    email: string;
    confirm: boolean;
    amount: number;
    currency: string;
};

export type CoSubscribersManagerProps = {
    coSubscribers: CoSubscriber[];
    onChange: (coSubscribers: CoSubscriber[]) => void;
    subscriptionCurrency: string;
};
