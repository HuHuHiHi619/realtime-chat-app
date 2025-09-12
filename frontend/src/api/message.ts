import type { CreateMessageReq, PaginatedMessages } from "@/types/chatStoreType";
import { apiClient } from "../helper/apiClient";
import { createMessageSchema, paginatedMessageSchema } from "@shared/schema/chat/message.schema";


const baseUrl = "http://localhost:5000/api";

export const messageApi = {
  clientCreateMessage: (data : any, signal : AbortSignal)  => {
    return apiClient({
      method: "POST",
      url: `${baseUrl}/conversations/${data.conversation_id}/messages`,
      body: data,
      schema: (data) => createMessageSchema.parse(data),
      signal: signal,
    });
  },
  clientGetMessages: (
    conversationId: number,
    page: number,
    signal : AbortSignal
  ) : Promise<PaginatedMessages> => {
    return apiClient({
      method: "GET",
      url: `${baseUrl}/conversations/${conversationId}/messages?page=${page}`,
      schema: (data) => paginatedMessageSchema.parse(data),
      signal: signal,
    });
  },
};

