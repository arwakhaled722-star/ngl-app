
import { RedisCacheProvider as RedisCacheProviderClass } from "../../pkg/cache/redis.js";
import { env } from "../config/env.js";

export const cacheProvider = new RedisCacheProviderClass({
    host: env.redis.host,
    port: env.redis.PORT,
    password: env.redis.password || ''
});
