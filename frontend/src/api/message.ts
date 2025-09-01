import type { CreateMessageReq, Messages, PaginatedMessages } from "@/types/chatStoreType";
import { apiClient } from "../helper/apiClient";
import { createMessageSchema, paginatedMessageSchema } from "@shared/schema/chat/message.schema";
import { conversationSchema } from "@shared/schema/chat/conversation.schema";

const baseUrl = "http://localhost:5000/api";

export const messageApi = {
  clientCreateMessage: (data : CreateMessageReq, signal : AbortSignal)  => {
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

/*export const clientGetMessages = async (
  conversationId: number,
  page : number
): Promise<MessageListsResponse> => {
  try {
    const url = new URL(`http://localhost:5000/api/conversations/${conversationId}/messages`)
    url.searchParams.append('page', page.toString())
    const response = await fetch(
      url.toString(),
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const rawData = await response.json();

    const validateData = messageListsResponseSchema.parse(rawData);
   
   
    const { messages, pagination } = validateData;
    return {
      messages,
      pagination,
    };
  } catch (error: unknown) {
    console.error(error);
    throw new Error(
      `Error during get active conversation: ${getErrorMessage(error)}`
    );
  }
};

export const clientCreateMessage = async (
  messageData: CreateMessageReq
) : Promise<Messages> => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/conversations/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
        credentials: "include",
      }
    );
       if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const rawData = await response.json();
    console.log("create message raw data:" ,rawData)
    const validateData = createMessageSchema.parse(rawData);
    
    return validateData
    
  } catch (error: unknown) {
    console.error(error);
    throw new Error(
      `Error during get active conversation: ${getErrorMessage(error)}`
    );
  }
};

export const clientEditedMessage = async (
  conversationId: number,
  messageId: number,
  payload: { newContent: string; message_type: string }
) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/conversations/${conversationId}/messages/${messageId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );
    const rawData = await response.json();
    const validateData = createMessageSchema.safeParse(rawData);
    if (!validateData.success) {
      return {
        success: false,
        message: "Invalid response format",
      };
    }
    return {
      success: true,
      data: validateData.data,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const clientDeletedMessage = async (messageId: number) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/conversations/message/${messageId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const rawData = await response.json();

    return {
      success: true,
      data: rawData,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};*/
