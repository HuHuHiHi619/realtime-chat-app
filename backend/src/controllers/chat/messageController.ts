import { NextFunction, Request, Response } from "express";
import { MessageService } from "../../services/chat/messageService";
import { ApiError } from "../../utils/apiError";

export class MessageController {
  constructor(private messageService: MessageService) {}

  // GET /conversation/:conversation_id/messages
  public async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.validatedQuery;
      const conversation_id = req.validatedParams.conversation_id
      const user_id = req.user.id;
      const isParticipant = await this.messageService.checkParticipants(
        user_id,
        conversation_id
      );

      if (!isParticipant) {
        return ApiError.forbidden(
          "You are not a participant in this conversation"
        );
      }

      const data = await this.messageService.getMessages({
        conversation_id,
        page,
        limit,
      });

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // POST /conversation/messages
  public async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const sender_id = req.user.id
      const input = {
        conversation_id : req.validatedParams.conversation_id,
        ...req.validatedBody,
        sender_id
      }
      console.log('create message input: ', input)
      const data = await this.messageService.createMessage(input);

      return res.status(201).json(data);
    } catch (error) {
      next(error)
    }
  }
}
