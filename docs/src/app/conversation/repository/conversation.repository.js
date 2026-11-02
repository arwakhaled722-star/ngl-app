import { Conversation } from '../model/conversation.model.js';

export async function createConversation(originalMessage, sender, receiver) {
    return Conversation.create({
        originalMessage,
        participants: [sender, receiver]
    });
}

export async function findConversationByMessage(messageId) {
    return Conversation.findOne({
        originalMessage: messageId
    });
}

export async function findConversationById(conversationId) {
    return Conversation.findById(conversationId);
}

export async function addMessage(conversationId, sender, content) {
    return Conversation.findByIdAndUpdate(
        conversationId,
        {
            $push: {
                messages: { sender, content }
            }
        },
        { returnDocument: 'after' }
    );
}

export async function getConversationMessages(conversationId) {
    const conversation = await Conversation.findById(conversationId)
        .populate('messages.sender', 'name email');

    if (!conversation) return null;

    conversation.messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    return conversation;
}
