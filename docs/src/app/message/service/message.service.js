import * as userRepository from'../../user/repository/user.repository.js'
import {userNotExist} from "../../user/errors.js";
import * as MessageRepository from'../repository/message.repository.js';
export async function sendMessage(content,receiver,sender ){
   const user= await userRepository.findUserById(receiver);
   if(!user)throw userNotExist;
   return await MessageRepository.createMessage(content,receiver,sender);

}
export async function getAllMessages(userId){
   const messages = await MessageRepository.getAllMessages(userId);
   if(messages.length==0) throw new AppError('no message found',404);
   return messages;
}