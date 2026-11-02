import * as conversationRepository from '../repository/conversation.repository.js';
import { AppError } from '../../../lib/error/error.js';
function validateContent(content) {
    if (typeof content !== 'string' || !content.trim() || content.trim().length > 200) {
        throw new AppError('Message must be between 1 and 200 characters', 400);
    }
}
export async function sendMessage(conversationId, userId, content) {
    const conversation = await conversationRepository.findConversationById(conversationId);

    if (!conversation) {
        throw new AppError('Conversation not found', 404);
    }

    const isParticipant = conversation.participants.some(
        id => id.toString() === userId.toString()
    );

    if (!isParticipant) {
        throw new AppError('Access denied', 403);
    }
    validateContent(content);
    return conversationRepository.addMessage(conversationId, userId, content);
}

export async function getConversationMessages(conversationId, userId) {
    const conversation = await conversationRepository.findConversationById(conversationId);

    if (!conversation) {
        throw new AppError('Conversation not found', 404);
    }

    const isParticipant = conversation.participants.some(
        id => id.toString() === userId.toString()
    );

    if (!isParticipant) {
        throw new AppError('Access denied', 403);
    }

    return conversationRepository.getConversationMessages(conversationId);
}