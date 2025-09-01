import type { NextFunction, Request, Response } from "express";
import { ConversationService } from "../../services/chat/conversationService";

export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  // GET /api/conversations
  public async getConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user_id = req.user.id;

      const conversations = await this.conversationService.getConversations(
        user_id
      );

      return res.status(200).json(conversations);
    } catch (error) {
      next();
    }
  }

  // GET /api/conversations/:conversation_id
  public async getActiveConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input = {
        conversation_id : req.validatedParams.conversation_id,
        user_id : req.user.id
      }

      const activeConversation =
        await this.conversationService.getActiveConversation(input);

      return res.status(200).json(activeConversation);
    } catch (error) {
      next();
    }
  }

  // POST /api/conversations
  public async createConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user_id = req.user.id;

      const input = {
        ...req.validatedBody,
        user_id: user_id,
      };

      const conversation = await this.conversationService.createConversation(
        input
      );

      return res.status(201).json(conversation);
    } catch (error) {
      next();
    }
  }
}
