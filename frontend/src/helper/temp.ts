import type { CreateMessageReq } from "@/types/chatStoreType";

export function prepareTempMessage(messageData: CreateMessageReq, conversationId: number) {
  const tempId = -Date.now();
  return {
    id: tempId,
    conversation_id: conversationId,
    sender_id: messageData.sender_id,
    sent_at: new Date(),
    content: messageData.content.trim(),
    message_type: messageData.message_type,
    is_edited : false
  };
}
