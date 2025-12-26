// export {};

// declare global {
//   interface Window {
//     kakao?: KakaoNamespace;
//   }
// }

// interface KakaoNamespace {
//   maps: {
//     Map: new (
//       container: HTMLElement,
//       options: { center: KakaoLatLng; level: number }
//     ) => KakaoMap;

//     Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;

//     Polyline: new (options: {
//       path: KakaoLatLng[];
//       strokeWeight: number;
//       strokeColor: string;
//       strokeOpacity: number;
//       strokeStyle: string;
//     }) => KakaoPolyline;

//     LatLng: new (lat: number, lng: number) => KakaoLatLng;

//     event: {
//       addListener(
//         target: KakaoMap,
//         type: "click",
//         handler: (event: KakaoMouseEvent) => void
//       ): void;
//     };

//     services: {
//       Geocoder: new () => KakaoGeocoder;
//       Places: new () => KakaoPlaces;
//       Status: { OK: string };
//     };
//   };
// }

// interface KakaoMap {
//   setCenter(latLng: KakaoLatLng): void;
//   panTo(latLng: KakaoLatLng): void;
// }

// interface KakaoMarker {
//   setMap(map: KakaoMap | null): void;
//   setPosition(latLng: KakaoLatLng): void;
// }

// interface KakaoPolyline {
//   setMap(map: KakaoMap | null): void;
// }

// interface KakaoLatLng {
//   getLat(): number;
//   getLng(): number;
// }

// interface KakaoMouseEvent {
//   latLng: KakaoLatLng;
// }

// interface KakaoGeocoder {
//   coord2Address(
//     lng: number,
//     lat: number,
//     callback: (
//       result: { address: { address_name: string } }[],
//       status: string
//     ) => void
//   ): void;
// }

// interface KakaoPlaces {
//   keywordSearch(
//     keyword: string,
//     callback: (
//       data: { x: string; y: string; place_name: string }[],
//       status: string
//     ) => void
//   ): void;
// }
