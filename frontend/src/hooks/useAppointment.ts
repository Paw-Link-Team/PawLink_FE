// src/hooks/useAppointment.ts
import { useCallback, useState } from "react";
import { upsertAppointment, type AppointmentPayload } from "../api/appointment";

export function useAppointment(roomId: number) {
  const [date] = useState<Date>(new Date());
  const [hour, setHour] = useState<number>(15);
  const [minute, setMinute] = useState<number>(0);

  const [place, setPlace] = useState<string>("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const canSubmit = Boolean(place) && roomId > 0;

  const submit = useCallback(async () => {
    const payload: AppointmentPayload = {
      date: date.toISOString().slice(0, 10),
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}:00`,
      locationAddress: place,
      reminderMinutesBefore: 15,
    };

    await upsertAppointment(roomId, payload);
  }, [roomId, date, hour, minute, place]);

  return {
    date,
    hour,
    minute,
    place,
    latLng,
    setHour,
    setMinute,
    setPlace,
    setLatLng,
    canSubmit,
    submit,
  };
}
