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
      transports: ["polling", "websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
      socket.emit("joinRoom", roomId);
    });

    socket.on("newMessage", onMessage);

    socket.on("connect_error", (err) => {
      console.error("socket connect error", err);
    });

    return () => {
      socket.emit("leaveRoom", roomId);
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
