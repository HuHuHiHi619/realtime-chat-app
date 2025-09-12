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
  UiMessages,
} from "@/types/chatStoreType";
import { normalizeMessage, prepareTempMessage } from "../helper/temp";
import { useAuthStore } from "./useAuthStore";


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

          const newMessages = response.messages
          .filter(
            (m: Messages) => !existingId.has(m.id)
          )
          .map(normalizeMessage)

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
  createMessage: async (messageData : CreateMessageReq) => {
    const activeConversation = get().activeConversation;
    if(!activeConversation) return

    const user = useAuthStore.getState().user;
    if(!user) return

    // EMIT TO SOCKET
    const { emit } = useSocketStore.getState();
    emit('send-message' , {
      conversation_id : activeConversation.conversation_id ,
      content : messageData.content.trim(),
      message_type : messageData.message_type
    })
    set({ inputMessage : "" })
  },

  // INPUT METHODS
  setInputMessage: (text: string) => set({ inputMessage: text }),
  setIsTyping: (isTyping: boolean) => set({ isTyping }),
  
  
  // UPDATE UI
  setActiveConversation: (conversation: ActiveConversation) =>
    set({ activeConversation: conversation }),
  setConversations: (conversations: Conversations[]) =>
    set({ conversations: conversations }),
  setMessages: (msg: UiMessages[]) => set({ messages: msg }),
  appendMessage: (msg: UiMessages) => set((state) => ({ messages: [...state.messages, msg] })),
  updateConversationLastMessage : (data : UiMessages) => 
    set((state) => ({
      conversations : state.conversations.map((c) => 
        c.conversation_id === data.conversation_id 
          ? {...c , last_message : {...data , sent_at : new Date(data.sent_at)}} 
          : c
        ),
    })),
  
}));
