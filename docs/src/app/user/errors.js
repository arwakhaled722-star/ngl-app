import { AppError } from "../../lib/error/error.js";

export const userNotExist=new AppError('User Not Exist',404);
export const userAlreadyExists=new AppError ("userAlreadyExist",409);
export const userAlreadyVerified=new AppError ('user already Verified',400);
export const userNotVerified= new AppError ('please verify your account first',403);