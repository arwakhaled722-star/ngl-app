import { isObjectIdOrHexString } from 'mongoose';
import {config}from"dotenv";
config();
import { z } from 'zod';
const schema=z.object({
    port:z.string().default('3000'),
    MONGODB_URL:z.string (),
    JWT_SECRET:z.string(),
    MAIL_USER:z.string().trim().toLowerCase(),
    MAIL_PASSWORD:z.string(),
    GOOGLE_WEB_OAUTH_CLIENT_ID:z.string(),
    REDIS_PORT:z.string().default ('6379'),
    REDIS_HOST:z.string(),
    REDIS_PASSWORD:z.string(),
});
const parsed=schema.parse(process.env);
export const env={
    port:Number(parsed.port),
    db:{
        url:parsed.MONGODB_URL,
    },
    google:{
        webClientId:parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
        iosClientId:parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
    },
    redis:{
        host:parsed.REDIS_HOST,
        PORT:Number(parsed.REDIS_PORT),
        password:parsed.REDIS_PASSWORD,
    },
    nodemailer:{
        user:parsed.MAIL_USER,
        password:parsed.MAIL_PASSWORD,
    },
    jwt:{
        secret:parsed.JWT_SECRET,
    },
    payments:{},
    aws:{},
}