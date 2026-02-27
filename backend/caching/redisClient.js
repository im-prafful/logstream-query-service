import { createClient } from "redis";
const redisclient = createClient({
    socket: {
        host: 'redis-18605.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 18605
    },
    password: 'B1NSvZBXhYGrzm1qHWkBFW3qJ1l2a2sH'
});

redisclient.on('error', (err) => console.log('Redis redisclient error:', err));
redisclient.on('connect', () => console.log('Redis redisclient connected'));

await redisclient.connect();

export default redisclient;