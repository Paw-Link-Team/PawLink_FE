import { useEffect, useRef } from "react";

type LatLng = { lat: number; lng: number };

declare global {
  interface Window {
    kakao: any;
  }
}

export default function WalkMap({ path }: { path: LatLng[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  /* =====================
   * 지도 초기화 (중요)
   * ===================== */
  useEffect(() => {
    if (!mapRef.current) return;

    // ✅ kakao 자체가 없으면 아직 SDK 미로딩
    if (!window.kakao) return;

    // 🚨 autoload=false면 무조건 load 안에서 생성
    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

      const center = new window.kakao.maps.LatLng(
        path[0]?.lat ?? 37.5665,
        path[0]?.lng ?? 126.9780
      );

      mapInstanceRef.current = new window.kakao.maps.Map(
        mapRef.current,
        {
          center,
          level: 3,
        }
      );
    });
  }, []);

  /* =====================
   * 경로 업데이트
   * ===================== */
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!window.kakao?.maps) return;
    if (path.length < 2) return;

    const linePath = path.map(
      (p) => new window.kakao.maps.LatLng(p.lat, p.lng)
    );

    // 기존 라인 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    polylineRef.current = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: "#6b3f1d",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    });

    polylineRef.current.setMap(mapInstanceRef.current);

    // 마지막 위치로 이동
    mapInstanceRef.current.panTo(
      linePath[linePath.length - 1]
    );
  }, [path]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "300px" }}
    />
  );
}
