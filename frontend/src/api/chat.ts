import api from "./api";

/* ======================
 * 공통 타입
 * ====================== */

/** 채팅 메시지 */
export type ChatMessageDto = {
  chatRoomId: number;
  senderUserId?: number;
  senderNickname?: string;
  message: string;
  sentAt?: string; // LocalDateTime → ISO string
  read?: boolean;
};

/** 약속 정보 */
export type AppointmentPayload = {
  date?: string;            // YYYY-MM-DD
  time?: string;            // HH:mm:ss
  locationAddress?: string;
};

/** 채팅방 상세 */
export type ChatRoomDetail = {
  chatRoomId: number;

  profileName: string;
  profilePhone?: string;

  post?: {
    id: number;
    title: string;
    information?: string;
  };

  appointment?: AppointmentPayload;
  messages: ChatMessageDto[];
};

/* ======================
 * 채팅방 목록
 * ====================== */

/**
 * 프론트 조회용 상태
 * (백엔드 ChatRoomStatus와 구분)
 */
export type ChatRoomStatus = "ALL" | "UNREAD" | "COMPLETED";

/**
 * 백엔드 ChatRoomListDto와 1:1 매칭
 */
export interface ChatRoomSummary {
  chatRoomId: number;
  profileImgUrl: string | null;
  title: string | null;
  lastMessage: string | null;
  lastSentAt: string | null; // LocalDateTime → string
  unreadCount: number;
  status: ChatRoomStatus;
}

/* ======================
 * 채팅방 API
 * ====================== */

/** 게시글 ID로 채팅방 생성/조회 */
export const createChatRoomByBoardId = (boardId: number) => {
  return api.post<{
    success: boolean;
    data: number; // chatRoomId
  }>(`/api/chat/rooms/by-board/${boardId}`);
};

/** 채팅방 상세 조회 */
export const fetchChatRoomDetail = (chatRoomId: number) => {
  return api.get<{
    success: boolean;
    data: ChatRoomDetail;
  }>(`/api/chat/rooms/${chatRoomId}`);
};

/** 채팅방 목록 조회 */
export const fetchChatRooms = (status: ChatRoomStatus) => {
  return api.get<{
    success: boolean;
    data: ChatRoomSummary[];
  }>("/api/chat/rooms", {
    params: { status },
  });
};

/** 안 읽은 메시지 조회 */
export const fetchUnreadMessages = (chatRoomId: number) => {
  return api.get<{
    success: boolean;
    data: ChatMessageDto[];
  }>(`/api/chat/rooms/${chatRoomId}/messages/unread`);
};

/* ======================
 * 약속 (Appointment)
 * ====================== */

/** 채팅방 기준 약속 조회 */
export const fetchAppointmentByRoom = (chatRoomId: number) => {
  return api.get<{
    success: boolean;
    data: AppointmentPayload | null;
  }>(`/api/chat/rooms/${chatRoomId}/appointment`);
};

/** 채팅방 기준 약속 생성/수정 */
export const upsertAppointmentByRoom = (
  chatRoomId: number,
  payload: AppointmentPayload
) => {
  return api.post<{
    success: boolean;
  }>(`/api/chat/rooms/${chatRoomId}/appointment`, payload);
};

/* ======================
 * 🔥 호환용 alias
 * ====================== */

/**
 * 기존 코드 호환용
 */
export const upsertAppointment = upsertAppointmentByRoom;
