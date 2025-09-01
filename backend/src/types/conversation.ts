import { createConversationSchema, paramsConversationSchema } from "@shared/schema/chat/conversation.schema";
import z from "zod";

export type CreateConversationInputDTO = z.infer<
  typeof createConversationSchema
>;

export type ParamsConversationInputDTO = z.infer<
  typeof paramsConversationSchema
>;

export type GetActiveConversationServiceDTO = z.infer<
  typeof paramsConversationSchema
> & { user_id: number };
