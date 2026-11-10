import { createClient } from 'redis';

declare global{
    var redis_client: ReturnType<typeof createClient> | undefined
}

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error('REDIS_URL is not configured');
}

const redis = global.redis_client ?? createClient({
    url: redisUrl
});

if(!global.redis_client)
{
    redis.on('error', err => console.error('Redis Client Error', err));
    global.redis_client = redis;
    void redis.connect().catch(error => {
        console.error('Redis connection failed', error);
    });
}


export default redis;