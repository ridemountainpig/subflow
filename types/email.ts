export type Email = {
    _id?: string;
    userId: string;
    email: string;
    language: "en" | "zh" | "ja" | "es";
    notify: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
