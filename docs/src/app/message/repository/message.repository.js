import {Message} from"../model/message.model.js";
export async function createMessage(content,receiver,sender){
    return Message.create({
        content:content,
        sender:sender,
        reciever: receiver,
    });
}
export async function getAllMessages(userId){
    return Message.find({
        receiver:userId
    },
    {},{populate:{path:"sender"}}
    );
}