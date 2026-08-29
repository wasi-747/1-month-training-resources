import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tolet_nest';

/**
 * Global caching mechanism across Next.js Hot Reloads in development.
 * Prevents multiple MongoDB connection pools from exhausting server limits.
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
      serverSelectionTimeoutMS: 2500, // Quick failover to mock store if local daemon isn't up
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('✅ Connected to MongoDB via Mongoose ODM');
        cached.isFallback = false;
        return m;
      })
      .catch((err) => {
        console.warn('⚠️ Local MongoDB not reachable. Seamlessly activating reactive in-memory mock store:', err.message);
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
  return cached?.isFallback ?? false;
}
