import { createMessageRepoSchema, createMessageSchema, getMessageQuerySchema, getMessageRepoSchema, paramsMessageSchema } from "@shared/schema/chat/message.schema";
import z from "zod";

export type GetMessageServiceDTO = z.infer<typeof paramsMessageSchema> &
  z.infer<typeof getMessageQuerySchema>;

export type CreateMessageServiceDTO = z.infer<typeof paramsMessageSchema> &
  z.infer<typeof createMessageSchema> & { sender_id : number }

export type GetMessageRepoDTO = z.infer<typeof paramsMessageSchema> &
  z.infer<typeof getMessageRepoSchema>;

export type CreateMessageRepoDTO = z.infer<typeof paramsMessageSchema> &
  z.infer<typeof createMessageRepoSchema>;
