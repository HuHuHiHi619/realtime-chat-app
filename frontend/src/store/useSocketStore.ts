import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import type { SocketState } from "../types/socket/socketTypes";
import { initMessageListner } from "../socket/messageListner";

const socket: Socket = io("http://localhost:5000", { autoConnect: false });

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  reconnectAttempts: 0,
  maxReconnectAttemps: 5,

  // ACTIONS
  connect: () => {
    const { socket: currentSocket } = get();
    if (currentSocket?.connected) return;

    socket.connect();

    socket.on("connect", () => {
      set({
        isConnected: true,
        socket,
        reconnectAttempts: 0,
      });
      get().initListeners();
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    socket.on("reconnect_failed", () => {
      const { reconnectAttempts, maxReconnectAttemps } = get();
      if (reconnectAttempts < maxReconnectAttemps) {
        set({ reconnectAttempts: reconnectAttempts + 1 });
        setTimeout(() => socket.connect(), 2000);
      }
    });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        isConnected: false,
        socket: null,
        reconnectAttempts: 0,
      });
    }
  },

  emit: (e, data) => {
    const { socket } = get();
    if (socket?.connected) {
     console.log(`[SOCKET] Emit: ${e}`, data);
     socket.emit(e, data);
    }else {
    console.warn(`[SOCKET] Tried to emit ${e}, but socket is disconnected`);
  }

  },

  initListeners : () => {
    initMessageListner()
  }
}));
