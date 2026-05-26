import mongoose from "mongoose";

let mongodbUrl = process.env.MONGODB_URL;

if (!mongodbUrl) {
  throw new Error("db error");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUrl).then((conn) => conn.connection);

    // 🔥 FORCE LOAD MODELS HERE
    await import("@/models/order.model");
    await import("@/models/deliveryAssignment.model");
  }

  try {
    let conn = await cached.promise;
    cached.conn = conn;
    return conn;
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;