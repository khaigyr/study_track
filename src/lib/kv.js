// place files you want to import through the `$lib` alias in this folder.
import { createClient } from '@vercel/kv';
import { env } from '$env/dynamic/private';

// This file configures the Vercel KV client to connect to Redis.
// On Vercel, the connection is handled automatically.
// Locally, we use the REDIS_URL environment variable.

// Create the Redis client instance using the REDIS_URL from your .env file.
const kv = createClient({
    url: env.REDIS_URL,
    token: env.VERCEL_OIDC_TOKEN,
});

export { kv };
