import { Router } from 'express';
import { guard } from '../auth/guard.js';
import * as conversationController from './controller/conversation.controller.js';

const conversationRouter = Router();

conversationRouter.post(
    '/:conversationId/messages',
    guard,
    conversationController.sendMessage
);

conversationRouter.get(
    '/:conversationId/messages',
    guard,
    conversationController.getConversationMessages
);

export default conversationRouter;