import { Router } from "express";
import { authenticateToken } from "../middlewares/jwtAuth";
import { MessageRepository } from "../repositories/chat/MessageRepository";
import { MessageService } from "../services/chat/messageService";
import { MessageController } from "../controllers/chat/messageController";
import { validateRequest } from "../middlewares/validationReq";
import { requireUser } from "../middlewares/requireUser";
import { validateCreatePostRequest, validateGetPostsRequest } from "@shared/schema/chat/message.schema";

const router = Router();

// --- Manual DI ---
const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);
const messageController = new MessageController(messageService);

// --- Route ---
  // Get message
  router.get(
    "/conversations/:conversation_id/messages",
    authenticateToken,
    requireUser,
    validateRequest(validateGetPostsRequest), 
    messageController.getMessages.bind(messageController)
  );

  // Create message
  router.post(
    "/conversations/:conversation_id/messages",
    authenticateToken,
    requireUser,
    validateRequest(validateCreatePostRequest),
    messageController.createMessage.bind(messageController)
  );

export default router;
