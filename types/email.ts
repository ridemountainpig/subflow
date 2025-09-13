export type Email = {
    _id?: string;
    userId: string;
    email: string;
    language: "en" | "zh" | "ja";
    notify: boolean;
    createdAt: Date;
    updatedAt: Date;
};
