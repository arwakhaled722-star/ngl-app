import{otp} from "../model/otp.model.js";
 export async function createOTP(otpData){
     return await otp.create(otpData);
 }
 export async function getOtpByEmail(email) {
    return await otp.findOne({email:email});
    
}
 export async function deleteOTPsByEmail(email) {
     return await otp.deleteMany({email:email});
 }