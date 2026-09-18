import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("MongoDB URI Missing");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { connection: null, promise: null };
}

export async function connectDB() {

    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI)
            .then(() => mongoose.connection);
    }

    try {
        cached.connection = await cached.promise;
    }
    catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.connection;
}