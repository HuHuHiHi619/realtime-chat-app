import { activeConversationSchema, conversationSchema } from "@shared/schema/chat/conversation.schema";
import { apiClient } from "../helper/apiClient";
import z from "zod";
import type { ActiveConversation, Conversations } from "@/types/chatStoreType";

const baseUrl = "http://localhost:5000/api";

export const conversationApi = {
  clientGetConversations: async (signal : AbortSignal) : Promise<Conversations[]> => {
    return apiClient({
      method: "GET",
      url: `${baseUrl}/conversations`,
      schema: (data) => z.array(conversationSchema).parse(data),
      signal: signal,
    })
  },
  clientGetActiveConversation: async (
    conversationId: number,
    signal : AbortSignal
  ) : Promise<ActiveConversation> => {
    return apiClient({
      method: "GET",
      url: `${baseUrl}/conversations/${conversationId}`,
      schema: (data) => activeConversationSchema.parse(data),
      signal: signal,
    });
  },
};

