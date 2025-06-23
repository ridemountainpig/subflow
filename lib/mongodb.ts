import mongoose from "mongoose";
let db: mongoose.Connection | null = null;
export const connectToDatabase = async (): Promise<mongoose.Connection> => {
    if (!db || mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        db = mongoose.connection.useDb("subflow");
    }
    return db;
};
