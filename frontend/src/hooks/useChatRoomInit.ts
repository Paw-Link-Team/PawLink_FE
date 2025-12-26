import { useEffect, useRef, useState } from "react";
import { fetchChatRoomDetail, createChatRoomByBoardId } from "../api/chat";
import { getMyInfo } from "../api/mypage";
import type { ChatRoomDetail, ChatMessageDto } from "../api/chat";

export function useChatRoomInit(roomId?: string, boardId?: string) {
  const initRef = useRef(false);

  const [numericRoomId, setNumericRoomId] = useState<number>(
    roomId ? Number(roomId) : NaN
  );
  const [detail, setDetail] = useState<ChatRoomDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [me, setMe] = useState<{ userId: number; nickname: string; phoneNumber?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    let cancelled = false;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        let currentRoomId = numericRoomId;

        if (!Number.isFinite(currentRoomId) && boardId) {
          const res = await createChatRoomByBoardId(Number(boardId));
          currentRoomId = res.data.data;
          setNumericRoomId(currentRoomId);
        }

        if (!Number.isFinite(currentRoomId)) {
          throw new Error("Invalid roomId");
        }

        const [roomRes, meRes] = await Promise.all([
          fetchChatRoomDetail(currentRoomId),
          getMyInfo(),
        ]);

        if (cancelled) return;

        setDetail(roomRes.data.data);
        setMessages(roomRes.data.data?.messages ?? []);
        setMe(meRes.data.data);
      } catch (e) {
        if (!cancelled) setError("채팅방 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [roomId, boardId]);

  return {
    numericRoomId,
    detail,
    messages,
    setMessages,
    me,
    loading,
    error,
  };
}
