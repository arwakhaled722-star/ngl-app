import * as authRepository from '../repository/auth.repository.js';
import * as otpRepository from'../repository/otp.repository.js';
import * as userRepository from'../../user/repository/user.repository.js';
import { generateOTPCode } from '../../../lib/utils/otp.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from "jsonwebtoken";
import { toMs } from "../../../pkg/utils/time/time.js";
import { sendEmail } from '../../../lib/email/nodemailer.js';
import { logger } from '../../../pkg/logger/logger.js';
import {
    userNotExist,
    userAlreadyExists,
    userAlreadyVerified,
    userNotVerified
} from '../../user/errors.js';
import {
    otpExpired,
    invalidCode,
    invalidPassword
} from '../errors.js';
import { generateToken } from '../utils/token.js';
import { comparePassword, hashPassword } from "../utils/hash.js";
import{OAuth2Client} from "google-auth-library";
import { AppError } from '../../../pkg/error/error.js';
import { verifyGoogleToken } from '../../../lib/utils/google-auth.js';
import { email } from 'zod';
import { name } from 'nodemailer/lib/package-info.js';

export async function register (userData) {
    //1.check user existence
    const userExist = await authRepository.checkUserExistsByEmail(userData.email);
    
    //2.if yyes, throw an error
    if (userExist) throw userAlreadyExists;
 
    //3.hash password
    userData.password = await bcrypt.hash(userData.password, 10);
    //4.save user into DB
    const createdUser = await authRepository.createUser(userData);
    //5.generate otp and save it into DB
    const code =  generateOTPCode(); //بتبعتلي ال otp 6 ارقام
    logger.info(code);
     await otpRepository.createOTP({
        code:code,
        email :userData.email,
        expiresAt: new Date(Date.now()+toMs(5,"minutes")),


    });
    //6.send otp in email
    await sendEmail(
    userData.email,
    'Verify your account',
        `<h1>Your verification code is:${code} </h1>`
    );
    //7.return the created user
    return createdUser;
}
export async function verifyAccount(email, code) {
    // check user existence
    const user = await authRepository.checkUserExistsByEmail(email);
    if (!user) throw userNotExist;
    if (user.isVerified === true) throw userAlreadyVerified;
   //check otp is expired or not
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired;
    //check valid otp
    if (otp.code !== code) throw invalidCode;
  const updatedUser = await userRepository.updateUserByEmail(
    email,
    { isVerified: true }
);

//delete otp fromDB
await otpRepository.deleteOtp(email);

return updatedUser;
}
   export async function login(email,password) 
   //check user existence
   {
    const user = await authRepository.checkUserExistsByEmail(email);
    if (!user) throw userNotExist;
    if (user.isVerified === false) throw userNotVerified;
        //check password
    const match = await bcrypt.compare(password,user.password)
    if (!match) throw invalidPassword;
    //generate token
    return generateToken({id:user._id,name:user.name});
}
//1.check user existence
export async function sendOtp(email){
    const user= await authRepository.checkUserExistsByEmail(email);
    if(!user) throw userNotExist;
    //2.delete all old OTPs
    await otpRepository.deleteOTPsByEmail(email);
    //3.generate OTP and save it into db
    const code = generateOTPCode();
     await otpRepository.createOTP({
        code:code,
        email:email,
        expiresAt:Date.now()+toMs(3,'minutes')
    });

    await sendEmail(email,'new otp',`<p>your new otp is${code}</p>`)
}
export async function resetPassword (email,code,newPassword){
    //1.verify otp code
    const otp= await otpRepository.getOtpByEmail(email);
    if(!otp) throw otpExpired;
    if (otp.code!==code) throw invalidCode;
    //2.hashPass
    const hashedPassword = await hashPassword(newPassword);
    //3.update user pass
    await userRepository.updateUserByEmail(email,{password:hashedPassword});
    //4.delete old otp
    await otpRepository.deleteOTPsByEmail(email);
}
export async function loginWithGoogle(idToken){
    //1.verify idToken
     const payload=await verifyGoogleToken(idToken);
    //2.check user existence 
    const user =await authRepository.checkUserExistsByEmail(payload,email);
    //3.if exists >>generate token
    if(user){
        return generateToken({
            id:user._id,
            email:user.email,
        });
    }
    //4. if not exists>>createuser>>generate token
    const createdUser=awaitauthRepository.createUser({
        name:payload.name,
        email:payload.email,
        provider:'google',
        isVerified:true,
    });
    return generateToken({
        id:createdUser._id,
        email:createdUser.email,
    });
}