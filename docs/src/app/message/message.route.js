import {Router} from 'express';
import*as messageController from'./controller/message.controller.js'
import { guard } from "../auth/guard.js";
const messageRouter=Router();
messageRouter.post('/',messageController.sendMessage);
messageRouter.get('/', guard, messageController.getAllMessages);
messageRouter.patch(
    '/:messageId/request-identity',
    guard,
    messageController.requestSenderIdentity
);
messageRouter.get(
    '/identity-requests',
    guard,
    messageController.getIdentityRequests
);
messageRouter.patch(
    '/:messageId/accept-identity-request',
    guard,
    messageController.acceptIdentityRequest
);
messageRouter.patch(
    '/:messageId/reject-identity-request',
    guard,
    messageController.rejectIdentityRequest
);
export default messageRouter;