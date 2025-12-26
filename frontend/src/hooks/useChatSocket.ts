import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { ChatMessageDto } from "../api/chat";

export function useChatSocket(
  roomId: number,
  socketOrigin: string,
  onMessage: (msg: ChatMessageDto) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!Number.isFinite(roomId) || !socketOrigin) return;

    const socket = io(socketOrigin, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.emit("joinRoom", roomId);

    socket.on("newMessage", onMessage);

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, socketOrigin, onMessage]);

  return socketRef;
}
