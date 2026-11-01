import * as authService from"../service/auth.service.js";
import { toMs } from "../../../pkg/utils/time/time.js";
import { validateBody } from "../../../lib/validation/validation.js";
import {
    registerDTO,
    verifyAccountDTO,
    loginDTO,
    verifyLoginOtpDTO
} from "../dto/auth.dto.js";
import { createUser } from "../repository/auth.repository.js";
export async function register(req,res,next){
    try{
        const data =validateBody(registerDTO,req.body);
      const createdUser = await authService.register(data);
       res.status(201).json({
        message:'User Created Successfully',
        success:true,
        data:createdUser,
       })
    }catch(error){
        next(error);
    }
}
export async function verifyAccount(req,res,next){
    try{
        const data=validateBody(verifyAccountDTO,req.body);
        const{email,code}=data;
        const updatedUser=await authService.verifyAccount(email,code);
        res.json({
            message:'user verified successfully',
            success:true,
            data:updatedUser
        });
    }catch(error){
        next(error);
    }
}
export async function login(req,res,next){
    try{
        const {email,password} = validateBody(loginDTO,req.body);

        await authService.login(email,password);

        res.json({
            message: 'OTP sent successfully, check your email',
            success: true,
        });
    }catch(error){
        next(error);
    }
}
export async function verifyLoginOtp(req,res,next){
    try{
        const {email,code} = validateBody(verifyLoginOtpDTO,req.body);

        const token = await authService.verifyLoginOtp(email,code);

        res.cookie('access_token',token,{
            httpOnly:true,
            maxAge:toMs(1,'hours'),
        });

        res.json({
            message: 'User login successfully',
            success: true,
        });
    }catch(error){
        next(error);
    }
}
export async function sendOtp(req,res,next){
    try{
        const{email}=req.body;
        await authService.sendOtp(email);
        res.json({
            message:'new otp sent,check user email',
            success:true,
        });
    }catch(error){
        next(error);
    }
}
export async function resetPassword(req,res,next){
    try{
        const{email,code ,newPassword}=req.body;
        await authService.resetPassword(email,code ,newPassword);
        res.json({
            message:'password reset successfully',
            success:true,
        });
    }catch(error){
        next(error);
    }
}
export async function loginWithGoogle(req,res,next){
    try{
        const token = await authService.loginWithGoogle(email,password);
        res.cookie('access_token',token,{
            httpOnly:true,
            maxAge:toMs(1,'hours'),
        });
       res.json({
        message:'User login Successfully',
        success:true,
       });
    }catch(error){
        next(error);
    }
}

