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
import { AppError } from '../../../lib/error/error.js';
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
await otpRepository.deleteOTPsByEmail(email);

return updatedUser;
}
 export async function login(email,password) {
    const user = await authRepository.checkUserExistsByEmail(email);
    if (!user) throw userNotExist;

    if (user.isBanned) {
    throw new AppError('Your account has been banned', 403);
}

    if (user.isVerified === false) throw userNotVerified;

    const match = await bcrypt.compare(password,user.password);
    if (!match) throw invalidPassword;

    // delete old OTPs
    await otpRepository.deleteOTPsByEmail(email);

    // generate new OTP
    const code = generateOTPCode();

    await otpRepository.createOTP({
        code: code,
        email: email,
        expiresAt: new Date(Date.now() + toMs(3,'minutes'))
    });

    // send OTP
    await sendEmail(
        email,
        'Login Verification',
        `<h1>Your login verification code is: ${code}</h1>`
    );

    return { message: 'OTP sent successfully' };
}

export async function verifyLoginOtp(email, code) {
    const user = await authRepository.checkUserExistsByEmail(email);
    if (!user) throw userNotExist;

    if (user.isBanned) {
    throw new AppError('Your account has been banned', 403);
}

    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired;

    // check OTP expiration
    if (otp.expiresAt < new Date()) {
        await otpRepository.deleteOTPsByEmail(email);
        throw otpExpired;
    }

    // check OTP code
    if (otp.code !== code) throw invalidCode;

    // delete OTP after successful verification
    await otpRepository.deleteOTPsByEmail(email);

    // generate login token
    return generateToken({
        id: user._id,
        name: user.name
    });
}
export async function sendOtp(email) {
    // 1. Check user existence
    const user = await authRepository.checkUserExistsByEmail(email);
    if (!user) throw userNotExist;

    // 2. Delete old OTPs
    await otpRepository.deleteOTPsByEmail(email);

    // 3. Generate new OTP
    const code = generateOTPCode();

    // 4. Save OTP
    await otpRepository.createOTP({
        code: code,
        email: email,
        expiresAt: new Date(Date.now() + toMs(3, 'minutes'))
    });

    // 5. Send OTP
    await sendEmail(
        email,
        'Reset Password',
        `<h1>Your password reset code is: ${code}</h1>`
    );
}
export async function resetPassword(email, code, newPassword) {

    // 1. Check user existence
    const user = await authRepository.checkUserExistsByEmail(email);
    if (!user) throw userNotExist;

    // 2. Get OTP
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired;

    // 3. Check OTP expiration
    if (otp.expiresAt < new Date()) {
        await otpRepository.deleteOTPsByEmail(email);
        throw otpExpired;
    }

    // 4. Check OTP code
    if (otp.code !== code) throw invalidCode;

    // 5. Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // 6. Update password
    await userRepository.updateUserByEmail(email, {
        password: hashedPassword
    });

    // 7. Delete OTP
    await otpRepository.deleteOTPsByEmail(email);
}
export async function loginWithGoogle(idToken){
    //1.verify idToken
     const payload=await verifyGoogleToken(idToken);
    //2.check user existence 
    const user =await authRepository.checkUserExistsByEmail(payload.email);
    //3.if exists >>generate token
    if (user) {
    if (user.isBanned) {
        throw new AppError('Your account has been banned', 403);
    }

    return generateToken({
        id: user._id,
        email: user.email,
    });
}
    //4. if not exists>>createuser>>generate token
    const createdUser=await authRepository.createUser({
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