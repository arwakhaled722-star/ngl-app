import {config} from 'dotenv'

import'./lib/db/mongoose.js';
import express from 'express';
import authRouter from "./app/auth/auth.route.js";
import userRouter from "./app/user/user.route.js";
import messageRouter from "./app/message/message.route.js";
import { otp } from './app/auth/model/otp.model.js';
import { logger } from './pkg/logger/logger.js';
import cors from 'cors';
config();
const app= express();
app.use(cors({origin:'http://localhost:4200'}));
app.use(express.json());
app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/message',messageRouter);
app.listen(3000, () => logger.info("server started on port 3000"));

//global error handler
app.use((err, req, res, next) => {
    console.error(err);

 if(err.isOperational===true){
     return res.status(err.statusCode).json({
        message: err.message,
        success: false,
        stack: err.stack,
       });
 }
  return res.status(500).json({
    error:'something went wrong',
     success:false,
  });
     
})
