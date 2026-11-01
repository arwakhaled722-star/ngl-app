import express, { Router } from 'express';
import authRouter from './app/auth/auth.route.js';
import userRouter from './app/user/user.route.js';
import messageRouter from './app/message/message.route.js';

export function createApp() {
    const app = express();

    app.use(express.json());

    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/message', messageRouter);

    return app;
}
