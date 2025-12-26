// src/components/AppointmentMap.tsx
import { useEffect, useRef } from "react";

export type LatLng = { lat: number; lng: number };

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  value?: LatLng | null;
  onSelect: (pos: LatLng, address: string) => void;
};

export default function AppointmentMap({ value, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  /* =====================
   * 지도 초기화 (1회)
   * ===================== */
  useEffect(() => {
    if (!containerRef.current) return;
    if (!window.kakao) return;

    window.kakao.maps.load(() => {
      if (!containerRef.current) return;
      if (mapRef.current) return; // ✅ 중복 방지

      const center = new window.kakao.maps.LatLng(
        value?.lat ?? 37.5665,
        value?.lng ?? 126.978
      );

      const map = new window.kakao.maps.Map(containerRef.current, {
        center,
        level: 3,
      });

      const marker = new window.kakao.maps.Marker({ position: center });
      marker.setMap(map);

      window.kakao.maps.event.addListener(map, "click", (e: any) => {
        const lat = e.latLng.getLat();
        const lng = e.latLng.getLng();

        marker.setPosition(e.latLng);

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(lng, lat, (res: any, status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            onSelect(
              { lat, lng },
              res[0].address.address_name
            );
          }
        });
      });

      mapRef.current = map;
      markerRef.current = marker;
    });
  }, []);

  /* =====================
   * 외부 값 변경 반영
   * ===================== */
  useEffect(() => {
    if (!value) return;
    if (!mapRef.current || !markerRef.current) return;

    const pos = new window.kakao.maps.LatLng(value.lat, value.lng);
    markerRef.current.setPosition(pos);
    mapRef.current.panTo(pos);
  }, [value]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "260px" }}
    />
  );
}
