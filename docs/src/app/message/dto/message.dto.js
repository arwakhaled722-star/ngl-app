import{z}from'zod'
import mongoose from "mongoose";
export const sendMessageDto=z.object({
    content:z.string().trim().min(1).max(200),
    reciever:z.string().trim().refine((val)=>{
        return mongoose.Types.ObjectId.isValid(val)
     
    })
})