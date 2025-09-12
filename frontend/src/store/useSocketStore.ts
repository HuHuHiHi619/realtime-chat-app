// useSocketStore.ts - ปรับปรุงใหม่
import { create } from "zustand";
import { io } from "socket.io-client";
import type { SocketState } from "../types/socketTypes";
import { initMessageListner, cleanupMessageListeners } from "../socket/messageListner";
import { authApi } from "@/api/auth";

const URL = "http://localhost:5000";

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  reconnectAttempts: 0,
  maxReconnectAttemps: 5,
  isConnecting: false, // เพิ่ม state นี้เพื่อป้องกันการ connect หลายครั้ง

  // ACTIONS
  connect: async () => {
    const { socket: currentSocket, isConnecting } = get();
    
    // ป้องกันการ connect หลายครั้งพร้อมกัน
    if (isConnecting) {
      console.log("[SOCKET] Connection already in progress...");
      return;
    }

    if (currentSocket?.connected) {
      console.log("[SOCKET] Already connected, skipping...");
      return;
    }

    set({ isConnecting: true });

    try {
      console.log("[SOCKET] Getting access token...");
      
      // 1. เอา access token ก่อน
      const tokenResponse = await authApi.clientGetTokenSocket(new AbortController().signal);
      const accessToken = tokenResponse.accessToken;
      
      console.log("[SOCKET] Creating new socket connection...");
      
      // 2. cleanup socket เก่า (ถ้ามี)
      if (currentSocket) {
        cleanupMessageListeners(currentSocket);
        currentSocket.disconnect();
      }
      
      // 3. สร้าง socket ใหม่
      const newSocket = io(URL, {
        autoConnect: false,
        withCredentials: true,
        auth: {
          token: accessToken
        }
      });

      // 4. setup event handlers สำหรับ socket connection
      newSocket.on("connect", () => {
        console.log(`[SOCKET] ✅ Connected with id: ${newSocket.id}`);
        set({
          isConnected: true,
          socket: newSocket,
          reconnectAttempts: 0,
          isConnecting: false
        });
        
        // 5. ตั้ง message listeners (ส่ง socket instance ไป)
        console.log("[SOCKET] Initializing listeners...");
        initMessageListner(newSocket);
      });

      newSocket.on("connect_error", (error) => {
        console.error("[SOCKET] Connection error:", error);
        set({ isConnecting: false });
      });

      newSocket.on("disconnect", (reason) => {
        console.warn(`[SOCKET] ❌ Disconnected (reason: ${reason})`);
        set({ isConnected: false });
        
        // cleanup listeners เมื่อ disconnect
        cleanupMessageListeners(newSocket);
      });

      // 6. จัดการ token หมดอายุ
      newSocket.on("token_expired", async () => {
        console.log("[SOCKET] Token expired, reconnecting...");
        cleanupMessageListeners(newSocket);
        newSocket.disconnect();
        set({ isConnected: false });
        
        // รอสักครู่แล้วลองเชื่อมต่อใหม่
        setTimeout(() => {
          get().connect();
        }, 1000);
      });

      newSocket.on("reconnect_attempt", (attempt) => {
        console.log(`[SOCKET] 🔄 Reconnect attempt #${attempt}`);
      });

      newSocket.on("reconnect_failed", () => {
        const { reconnectAttempts, maxReconnectAttemps } = get();
        console.error(
          `[SOCKET] ⚠️ Reconnect failed (attempts: ${reconnectAttempts}/${maxReconnectAttemps})`
        );

        if (reconnectAttempts < maxReconnectAttemps) {
          set({ reconnectAttempts: reconnectAttempts + 1 });
          console.log("[SOCKET] Retrying connection in 2s...");
          setTimeout(() => get().connect(), 2000);
        } else {
          console.error("[SOCKET] ❌ Max reconnect attempts reached");
          set({ isConnecting: false });
        }
      });

      // 7. เชื่อมต่อ
      console.log("[SOCKET] Connecting...");
      newSocket.connect();

    } catch (error) {
      console.error("[SOCKET] Failed to get token or connect:", error);
      set({ isConnecting: false });
      
      // อาจจะต้อง redirect ไป login หรือ show error message
      // หรือ retry หลังจากครู่หนึ่ง
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      console.log("[SOCKET] 🔌 Disconnecting manually...");
      
      // cleanup listeners ก่อน disconnect
      cleanupMessageListeners(socket);
      socket.disconnect();
      
      set({
        isConnected: false,
        socket: null,
        reconnectAttempts: 0,
        isConnecting: false
      });
    } else {
      console.log("[SOCKET] No active socket to disconnect");
    }
  },

  emit: (event, data) => {
    const { socket } = get();
    if (socket?.connected) {
      console.log(`[SOCKET] 📤 Emit: ${event}`, data);
      socket.emit(event, data);
    } else {
      console.warn(
        `[SOCKET] ⚠️ Tried to emit "${event}", but socket is disconnected`
      );
    }
  },

  // เพิ่ม method สำหรับ force reconnect
  forceReconnect: () => {
    console.log("[SOCKET] Force reconnecting...");
    get().disconnect();
    setTimeout(() => {
      get().connect();
    }, 500);
  }
}));