import { Router } from "express";

import { authenticateToken } from "../middlewares/jwtAuth";
import { ConversationRepository } from "../repositories/chat/ConversationRepository";
import { ConversationService } from "../services/chat/conversationService";
import { ConversationController } from "../controllers/chat/conversationController";
import { validateRequest } from "../middlewares/validationReq";

import { requireUser } from "../middlewares/requireUser";
import { createConversationSchema, paramsConversationSchema } from "@shared/schema/chat/conversation.schema";

const router = Router();

// --- Manual DI ---
const conversationRepository = new ConversationRepository();
const conversationService = new ConversationService(conversationRepository);
const conversationController = new ConversationController(conversationService);

// --- Routes ---
  // Get conversation
  router.get(
    "/conversations",
    authenticateToken,
    requireUser,
    conversationController.getConversations.bind(conversationController)
  );
  
  // Get active conversation
  router.get(
    "/conversations/:conversation_id",
    authenticateToken,
    requireUser,
    validateRequest({
      params : paramsConversationSchema
    }),
    conversationController.getActiveConversation.bind(conversationController)
  );
  
  // Create conversation
  router.post(
    "/conversations",
    authenticateToken,
    requireUser,
    validateRequest({
      body : createConversationSchema
    }),
    conversationController.createConversation.bind(conversationController)
  );

export default router;
