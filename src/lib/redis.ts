import { createClient } from 'redis';

declare global{
    var redis_client: ReturnType<typeof createClient> | undefined
}

const redis = global.redis_client ?? createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-12809.crce276.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 12809
    }
});

if(!global.redis_client)
{
    redis.on('error', err => console.log('Redis Client Error', err));
    redis.connect();
    global.redis_client = redis;
}


export default redis;