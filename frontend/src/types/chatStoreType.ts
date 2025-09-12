import type {
  activeConversationSchema,
  conversationSchema,
} from "@shared/schema/chat/conversation.schema";
import type {
  createMessageSchema,
  messageSchema,
  paginatedMessageSchema,
  paginationSchema,
  paramsMessageSchema,
} from "@shared/schema/chat/message.schema";
import type z from "zod";

export type Pagination = z.infer<typeof paginationSchema>;
export type Messages = z.infer<typeof messageSchema>;
export type PaginatedMessages = z.infer<typeof paginatedMessageSchema>
export type Conversations = z.infer<typeof conversationSchema>;
export type ActiveConversation = z.infer<typeof activeConversationSchema>;
export type CreateMessageReq = z.infer<typeof paramsMessageSchema> &
  z.infer<typeof createMessageSchema>;

export type UiMessages = Messages & {
  isMe: boolean;
};

interface ChatStateBase {
  conversations: Conversations[];
  messages: UiMessages[];
  activeConversation: ActiveConversation | null;
  pagination: Pagination;

  // INPUT STATE
  inputMessage: string;
  isTyping: boolean;
}

interface ChatMessageAction {
  // LOGIC FUNCTION
  fetchMessages: (conversation_id: number, page: number) => Promise<void>;
  createMessage: (messageData: CreateMessageReq) => Promise<void>;

  // UI FUNCTION
  setInputMessage: (text: string) => void;
  setIsTyping: (isTyping: boolean) => void;
  appendMessage: (msg: UiMessages) => void;
  setMessages: (msg: UiMessages[]) => void;
  updateConversationLastMessage : (msg : UiMessages) => void
}

interface ChatConversationAction {
  // LOGIC FUNCTION
  fetchConversations: () => Promise<void>;
  fetchActiveConversation: (conversation_id: number) => Promise<void>;

  // UI FUNCTION
  setActiveConversation: (conversation: ActiveConversation) => void;
  setConversations: (conversations: Conversations[]) => void;
}

export type ChatState = ChatConversationAction &
  ChatMessageAction &
  ChatStateBase;
