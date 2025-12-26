import api from "./api";

/**
 * 서버 AppointmentDto와 1:1 매칭
 */
export type AppointmentPayload = {
  date?: string;                  // yyyy-MM-dd
  time?: string;                  // HH:mm:ss
  locationAddress?: string;
  reminderMinutesBefore?: number;
};

/**
 * 약속 조회
 * GET /api/chat/appointments/{chatRoomId}
 */
export const fetchAppointmentByRoom = (chatRoomId: number) => {
  return api.get<{
    success: boolean;
    data: AppointmentPayload | null;
  }>(`/api/appointments/${chatRoomId}`);
};

/**
 * 약속 생성/수정
 * POST /api/chat/appointments/{chatRoomId}
 */
export const upsertAppointment = (
  chatRoomId: number,
  payload: AppointmentPayload
) => {
  return api.post<{
    success: boolean;
  }>(`/api/appointments/${chatRoomId}`, payload);
};
