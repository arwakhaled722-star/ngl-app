import { sendMessageDto } from '../dto/message.dto.js';
import { validateBody } from '../../../lib/validation/validation.js';
import * as messageService from '../service/message.service.js';
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
export async function requestSenderIdentity(req, res, next) {
    try {
        const { messageId } = req.params;
        const receiverId = req.user.id;

        const updatedMessage = await messageService.requestSenderIdentity(
            messageId,
            receiverId
        );

        res.json({
            message: 'Identity request sent successfully',
            success: true,
            data: updatedMessage
        });
    } catch (error) {
        next(error);
    }
}
export async function getIdentityRequests(req, res, next) {
    try {
        const senderId = req.user.id;

        const requests = await messageService.getIdentityRequests(senderId);

        res.json({
            message: 'Identity requests retrieved successfully',
            success: true,
            data: requests
        });
    } catch (error) {
        next(error);
    }
}
export async function acceptIdentityRequest(req, res, next) {
    try {
        const { messageId } = req.params;
        const senderId = req.user.id;

        const updatedMessage = await messageService.acceptIdentityRequest(
            messageId,
            senderId
        );

        res.json({
            message: 'Identity request accepted successfully',
            success: true,
            data: updatedMessage
        });
    } catch (error) {
        next(error);
    }
}
export async function rejectIdentityRequest(req, res, next) {
    try {
        const { messageId } = req.params;
        const senderId = req.user.id;

        const updatedMessage = await messageService.rejectIdentityRequest(
            messageId,
            senderId
        );

        res.json({
            message: 'Identity request rejected successfully',
            success: true,
            data: updatedMessage
        });
    } catch (error) {
        next(error);
    }
}