import api from "./api";

export type ApiEnvelope<T> = {
  code: number;
  success: boolean;
  message: string;
  status: string;
  data: T;
};

export type ChatRoomStatus = "ALL" | "UNREAD" | "COMPLETED";

export type ChatRoomSummary = {
  chatRoomId: number;
  profileImgUrl?: string | null;
  title?: string | null;
  lastMessage?: string | null;
  lastSentAt?: string | null;
  unreadCount: number;
  status: ChatRoomStatus;
};

export type BoardSummary = {
  id: number;
  title: string;
  information: string;
  description: string;
  viewCount: number;
  userId: number;
  userNickname: string;
};

export type ChatMessageDto = {
  chatRoomId: number;
  senderUserId: number | null;
  senderNickname?: string | null;
  message: string;
  sentAt?: string | null;
  read?: boolean;
};

export type AppointmentPayload = {
  date: string;
  time: string;
  locationAddress: string;
  reminderMinutesBefore: number;
};

export type ChatRoomDetail = {
  chatRoomId: number;
  profileName?: string | null;
  profilePhone?: string | null;
  post?: BoardSummary | null;
  appointment?: AppointmentPayload | null;
  messages: ChatMessageDto[];
};

export const fetchChatRooms = (filter: ChatRoomStatus = "ALL") =>
  api.get<ApiEnvelope<ChatRoomSummary[]>>("/api/chat/rooms", {
    params: { filter },
  });

export const fetchChatRoomDetail = (chatRoomId: number) =>
  api.get<ApiEnvelope<ChatRoomDetail>>(`/api/chat/rooms/${chatRoomId}`);

export const fetchAppointmentByRoom = (chatRoomId: number) =>
  api.get<ApiEnvelope<AppointmentPayload | null>>(`/api/chat/appointments/${chatRoomId}`);

export const upsertAppointment = (chatRoomId: number, payload: AppointmentPayload) =>
  api.post(`/api/chat/appointments/${chatRoomId}`, payload);

export const createChatRoomByBoardId = (boardId: number) =>
  api.post<ApiEnvelope<number>>(`/api/chat/board/${boardId}`);
