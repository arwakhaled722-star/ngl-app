import * as conversationService from '../service/conversation.service.js';

export async function sendMessage(req, res, next) {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const message = await conversationService.sendMessage(
            conversationId,
            userId,
            content
        );

        res.status(201).json({
            message: 'Message sent successfully',
            success: true,
            data: message
        });
    } catch (error) {
        next(error);
    }
}

export async function getConversationMessages(req, res, next) {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        const messages = await conversationService.getConversationMessages(
            conversationId,
            userId
        );

        res.json({
            message: 'Conversation messages retrieved successfully',
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
}