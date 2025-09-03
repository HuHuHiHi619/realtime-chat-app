import { create } from "zustand";
import { conversationApi } from "../api/conversation";
import { messageApi } from "../api/message";
import { useSocketStore } from "./useSocketStore";
import { withAbortController } from "../helper/withAbortController";
import type {
  ActiveConversation,
  ChatState,
  Conversations,
  CreateMessageReq,
  Messages,
} from "@/types/chatStoreType";
import { prepareTempMessage } from "../helper/temp";

export const useChatStore = create<ChatState>((set, get) => ({
  // CONVERSATION STATE
  conversations: [],
  messages: [],
  activeConversation: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    hasMore: false,
  },

  // INPUT STATE
  inputMessage: "",
  isTyping: false,

  // FETCH METHODS
  fetchConversations: async () => {
    try {
      await withAbortController(async (signal) => {
        const response = await conversationApi.clientGetConversations(signal);
        console.log("response fetch conversation", response);
        if (!response)
          throw new Error("No response conversations from zustand");
        set({ conversations: response });
      });
    } catch (error) {
      console.error("Error fetching conversations", error);
    }
  },

  fetchActiveConversation: async (conversationId: number) => {
    try {
      await withAbortController(async (signal) => {
        const response = await conversationApi.clientGetActiveConversation(
          conversationId,
          signal
        );
        if (!response)
          throw new Error("No response active conversation from zustand");

        set({ activeConversation: response });
      });

      return await get().fetchMessages(conversationId, 1);
    } catch (error) {
      console.error("Error fetching active conversation from zustand", error);
      set({ activeConversation: null });
    }
  },

  fetchMessages: async (conversationId: number, page: number = 1) => {
    try {
      await withAbortController(async (signal) => {
        const response = await messageApi.clientGetMessages(
          conversationId,
          page,
          signal
        );
        if (!response) throw new Error("No response messages from zustand");

        set((state) => {
          const existingId = new Set(state.messages.map((msg) => msg.id));

          const newMessages = response.messages.filter(
            (m: Messages) => !existingId.has(m.id)
          );

          return {
            messages: [...newMessages, ...state.messages],
            pagination: response.pagination,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching messages from zustand", error);
    }
  },

  // CRUD MESSAGE METHODS
  createMessage: async (messageData: CreateMessageReq) => {
    const { activeConversation } = get();
    if (!activeConversation || !messageData.content.trim()) return;

    const tempMessage = prepareTempMessage(
      messageData,
      activeConversation?.conversation_id
    );

    // optimistic update
    set({ messages: [...get().messages, tempMessage] });

    try {
      await withAbortController(async (signal) => {
        const response = await messageApi.clientCreateMessage(
          messageData,
          signal
        );
        if (!response) throw new Error("No response message from zustand");

        useSocketStore.getState().emit("send-message", response);

        // set real
        set({
          messages: get().messages.map((msg) =>
            msg.id === tempMessage.id
              ? {
                  ...response,
                  id: tempMessage.id,
                  sent_at: new Date().toISOString(),
                }
              : msg
          ),
        });
        // update active conversation last message
        const updateLastMessage = (conversation: any, message: any) => ({
          ...conversation,
          last_message: {
            id: message.id,
            content: message.content,
            sent_at: message.sent_at,
            sender_id: message.sender_id,
          },
        });

        set((state) => {
          if (!state.activeConversation) return state;

          return {
            ...state,
            activeConversation: updateLastMessage(
              state.activeConversation,
              response
            ),
          };
        });
      });
    } catch (error) {
      console.error("Error creating message from zustand", error);
    }
  },

  // INPUT METHODS
  setInputMessage: (text: string) => set({ inputMessage: text }),
  setIsTyping: (isTyping: boolean) => set({ isTyping }),
  setMessages: (msg: Messages[]) => set({ messages: msg }),

  // UPDATE UI
  setActiveConversation: (conversation: ActiveConversation) =>
    set({ activeConversation: conversation }),
  setConversations: (conversations: Conversations[]) =>
    set({ conversations: conversations }),
}));
