import * as userRepository from'../../user/repository/user.repository.js'
import {userNotExist} from "../../user/errors.js";
import * as MessageRepository from'../repository/message.repository.js';
import { AppError } from '../../../lib/error/error.js';
import * as conversationRepository from '../../conversation/repository/conversation.repository.js';
export async function sendMessage(content,receiver,sender ){
   const user= await userRepository.findUserById(receiver);
   if(!user)throw userNotExist;
   return await MessageRepository.createMessage(content,receiver,sender);

}
export async function getAllMessages(userId) {
    const messages = await MessageRepository.getAllMessages(userId);

    if (messages.length === 0) {
        throw new AppError('no message found', 404);
    }

    return messages.map(message => {
        const messageData = message.toObject();

        if (messageData.identityRequestStatus !== 'accepted') {
            delete messageData.sender;
        }

        return messageData;
    });
}
export async function requestSenderIdentity(messageId, receiverId) {
    const message = await MessageRepository.findMessageById(messageId);

    if (!message) {
        throw new AppError('Message not found', 404);
    }

    if (message.reciever.toString() !== receiverId.toString()) {
        throw new AppError('You are not allowed to request this identity', 403);
    }

    if (!message.sender) {
        throw new AppError('Sender identity is not available', 400);
    }

    if (message.identityRequestStatus !== 'none') {
        throw new AppError('Identity request already exists', 400);
    }

    return MessageRepository.updateMessageById(messageId, {
        identityRequestStatus: 'pending'
    });
}
export async function getIdentityRequests(senderId) {
    const requests = await MessageRepository.getIdentityRequests(senderId);

    return requests;
}
export async function acceptIdentityRequest(messageId, senderId) {
    const message = await MessageRepository.findMessageById(messageId);

    if (!message) {
        throw new AppError('Message not found', 404);
    }

    if (!message.sender) {
        throw new AppError('Sender identity is not available', 400);
    }

    if (message.sender.toString() !== senderId.toString()) {
        throw new AppError('You are not allowed to accept this request', 403);
    }

    if (message.identityRequestStatus !== 'pending') {
        throw new AppError('No pending identity request found', 400);
    }

    await MessageRepository.updateMessageById(messageId, {
        identityRequestStatus: 'accepted'
    });

    let conversation = await conversationRepository.findConversationByMessage(messageId);

    if (!conversation) {
        conversation = await conversationRepository.createConversation(
            messageId,
            message.sender,
            message.reciever
        );
    }

    return conversation;
}
export async function rejectIdentityRequest(messageId, senderId) {
    const message = await MessageRepository.findMessageById(messageId);

    if (!message) {
        throw new AppError('Message not found', 404);
    }

    if (!message.sender) {
        throw new AppError('Sender identity is not available', 400);
    }

    if (message.sender.toString() !== senderId.toString()) {
        throw new AppError('You are not allowed to reject this request', 403);
    }

    if (message.identityRequestStatus !== 'pending') {
        throw new AppError('No pending identity request found', 400);
    }

    return MessageRepository.updateMessageById(messageId, {
        identityRequestStatus: 'rejected'
    });
}
