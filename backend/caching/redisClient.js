import { createClient } from "redis";
const redisclient = createClient({
    socket: {
        host: 'redis-13238.crce283.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 13238
    },
    password: 'dJARtwvWmIpQqDVyz2shiv6GNRNt7lao'
});

redisclient.on('error', (err) => console.log('Redis redisclient error:', err));
redisclient.on('connect', () => console.log('Redis redisclient connected'));

await redisclient.connect();

export default redisclient;