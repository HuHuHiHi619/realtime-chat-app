import { useAuthStore } from "@/store";
import type { CreateMessageReq, Messages, UiMessages } from "@/types/chatStoreType";

export function prepareTempMessage(messageData: CreateMessageReq) {
  const tempId = -Date.now();
  const currentUserId = useAuthStore.getState().user?.id;
  if(!currentUserId) throw new Error('No current user id');

  return {
    id: tempId,
    conversation_id: messageData.conversation_id,
    sender_id: currentUserId,
    sent_at: new Date().toISOString(),
    content: messageData.content.trim(),
    message_type: messageData.message_type,
    is_edited : false
  };
}

export function normalizeMessage(message : Messages) : UiMessages {
  const currentUserId = useAuthStore.getState().user?.id;
  return {
    ...message,
    isMe: message.sender_id === currentUserId,
  }
}

