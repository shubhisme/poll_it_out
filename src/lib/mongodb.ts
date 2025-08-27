
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if(!MONGODB_URL){
    throw new Error("Mongodb url not connected!")
}

// Extend global type to include mongoose property
declare global {
    // eslint-disable-next-line no-var
    var mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null , promise: null}
}

async function dbconnect() {
    if (!cached) {
        cached = global.mongoose = { conn: null, promise: null };
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL as string).then((mongooseInstance) => mongooseInstance.connection);
    }

    cached.conn = await cached.promise;

    return cached.conn;
}

export default dbconnect
