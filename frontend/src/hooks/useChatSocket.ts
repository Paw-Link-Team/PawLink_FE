import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { ChatMessageDto } from "../api/chat";

export function useChatSocket(
  roomId: number,
  onMessage: (msg: ChatMessageDto) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
  if (!Number.isFinite(roomId)) return;

  const socket = io("https://api-pawlink.duckdns.org", {
    path: "/socket.io",
    // ❌ transports 강제 제거
    // ❌ autoConnect 제거
  });

  console.log("SOCKET OPTS", socket.io.opts);

  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("✅ connected", socket.id);
    socket.emit("joinRoom", roomId);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ connect_error", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ disconnected", reason);
  });

  socket.on("newMessage", onMessage);

  return () => {
    socket.disconnect();
    socketRef.current = null;
  };
}, [roomId, onMessage]);

  const sendMessage = useCallback(
    (message: string, senderUserId: number) => {
      socketRef.current?.emit("sendMessage", {
        chatRoomId: roomId,
        senderUserId,
        message,
      });
    },
    [roomId]
  );

  return { sendMessage };
}
