import { sendMessageDto } from '../dto/message.dto.js';
import { validateBody } from '../../../lib/validation/validation.js';
import * as messageService from '../service/message.service.js';
import { success } from 'zod';
export async function sendMessage(req,res,next){
    try{
       const data= validateBody(sendMessageDto,req.body);
       const {content,reciever}=data;
       const sender=req.user?.id;
       const createdMessage= await messageService.sendMessage(content,reciever,sender);
       res.status(201).json({
        message:'message created successfully',
        success:true,
        data:createdMessage
       })
    }catch(error){
        next(error);

    }
}
export async function getAllMessages(req,res,next){
    try{
        const messages=await messageService.getAllMessages(req.user.id);
        res.json({
            message:"ok",
            success:true,
            data:messages,

        });
    }catch(error){
        next(error);
    }
}