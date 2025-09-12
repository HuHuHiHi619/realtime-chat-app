// messageListener.ts - รับ socket instance เป็น parameter
import { Socket } from "socket.io-client";
import { useChatStore } from "../store";
import { normalizeMessage } from "@/helper/temp";

export const initMessageListner = (socketInstance: Socket) => {
  if (!socketInstance) {
    console.warn("[SOCKET] No socket instance provided to initMessageListner");
    return;
  }

  console.log("[SOCKET] Setting up message listeners...");
  
  // ลบ listeners เก่าออกก่อน (ป้องกัน duplicate listeners)
  socketInstance.off("message");
  socketInstance.off("new-message");
  socketInstance.off("error");
  socketInstance.off("token_expired");

  // ตั้ง listeners ใหม่
  socketInstance.on("message", (data) => {
    console.log(`[SOCKET] Received message:`, data);
    const { activeConversation, appendMessage, updateConversationLastMessage } =
      useChatStore.getState();

    const normalizeData = normalizeMessage(data);
    
    // ถ้าเป็นการสนทนาที่กำลัง active อยู่
    if (activeConversation?.conversation_id === data.conversation_id) {
      appendMessage(normalizeData);
    }

    // อัพเดท last_message ใน conversation list
    updateConversationLastMessage(normalizeData);
  });

  socketInstance.on("new-message", (data) => {
    console.log(`[SOCKET] Received new message:`, data);
    // Handle new message logic here
  });

  // จัดการ error events
  socketInstance.on("error", (error) => {
    console.error("[SOCKET] Socket error:", error);
  });

  // จัดการเมื่อ token หมดอายุ
  socketInstance.on("token_expired", (data) => {
    console.warn("[SOCKET] Token expired:", data);
    // อาจจะต้อง redirect ไป login หรือ refresh token อัตโนมัติ
  });

  console.log("[SOCKET] Message listeners initialized successfully");
};

// cleanup function สำหรับลบ listeners
export const cleanupMessageListeners = (socketInstance: Socket) => {
  if (!socketInstance) return;
  
  console.log("[SOCKET] Cleaning up message listeners...");
  socketInstance.off("message");
  socketInstance.off("new-message");
  socketInstance.off("error");
  socketInstance.off("token_expired");
};