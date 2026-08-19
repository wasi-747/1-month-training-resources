import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow_pro';

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections from growing exponentially during Next.js API Route execution.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isFallback: false };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500, // Fast failover to local fallback if Mongo daemon isn't running
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('✅ Connected to MongoDB via Mongoose ODM');
      cached.isFallback = false;
      return m;
    }).catch((err) => {
      console.warn('⚠️ Local MongoDB daemon not reachable, activating in-memory/mock fallback engine:', err.message);
      cached.isFallback = true;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.isFallback = true;
    console.error('MongoDB connection error:', e);
  }

  return cached.conn;
}

export function isUsingFallback() {
  return cached?.isFallback || false;
}
