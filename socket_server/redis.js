import 'dotenv/config';
import { createClient } from 'redis';

const redis = globalThis.redis_client ?? createClient({
    // username: 'default',
    // password: process.env.REDIS_PASSWORD,
    // socket: {
    //     host: 'redis-12809.crce276.ap-south-1-3.ec2.cloud.redislabs.com',
    //     port: 12809
    // }

    url : process.env.REDIS_URL
});


const connectRedis = async ()=>{
    if (!globalThis.redis_client)
    {
        redis.on('error', err => console.log('Redis Client Error', err));
        console.log("connecting redis: ");
        console.log("REDIS URL:", process.env.REDIS_URL);
        await redis.connect();
        globalThis.redis_client = redis;
    }
}

connectRedis();

export default redis;