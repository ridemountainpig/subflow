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
};

export type CoSubscribersManagerProps = {
    coSubscribers: CoSubscriber[];
    onChange: (coSubscribers: CoSubscriber[]) => void;
};
