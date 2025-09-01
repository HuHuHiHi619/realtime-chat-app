import type {
  activeConversationSchema,
  conversationSchema,
} from "@shared/schema/chat/conversation.schema";
import type {
  createMessageRepoSchema,
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
  z.infer<typeof createMessageRepoSchema>;

interface ChatStateBase {
  conversations: Conversations[];
  messages: Messages[];
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
  setMessages: (msg: Messages[]) => void;
}

interface ChatConversationAction {
  // LOGIC FUNCTION
  fetchConversations: (signal: AbortSignal) => Promise<void>;
  fetchActiveConversation: (conversation_id: number) => Promise<void>;

  // UI FUNCTION
  setActiveConversation: (conversation: ActiveConversation) => void;
  setConversations: (conversations: Conversations[]) => void;
}

export type ChatState = ChatConversationAction &
  ChatMessageAction &
  ChatStateBase;
