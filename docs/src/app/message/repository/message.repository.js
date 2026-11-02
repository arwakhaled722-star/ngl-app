import {Message} from"../model/message.model.js";
export async function createMessage(content,receiver,sender){
    return Message.create({
        content:content,
        sender:sender,
        reciever: receiver,
    });
}
export async function getAllMessages(userId) {
    return Message.find({
        reciever: userId,
        isDeleted: false
    }).populate({
        path: 'sender',
        select: 'name email'
    });
}
export async function findMessageById(messageId) {
    return Message.findOne({
        _id: messageId,
        isDeleted: false
    });
}
export async function updateMessageById(messageId, updatedData) {
    return Message.findByIdAndUpdate(
        messageId,
        updatedData,
        { returnDocument: 'after' }
    );
}
export async function getIdentityRequests(senderId) {
    return Message.find({
        sender: senderId,
        identityRequestStatus: 'pending',
        isDeleted: false
    }).populate('reciever', 'name email');
}