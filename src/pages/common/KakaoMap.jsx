// KakaoMap.jsx
import React, { useEffect, useRef, useState } from "react";
// import { KAKAO_REST_API_KEY, KAKAO_JavaScript_API_KEY } from "../../config";
export default function KakaoMap({ latitude, longitude, address }) {
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_JS_API_KEY = import.meta.env.VITE_KAKAO_JS_API_KEY;
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
  // console.log("latitude:", latitude, typeof latitude);
  // console.log("longitude:", longitude, typeof longitude);
  //   if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
  //     setErrorMessage("위도와 경도 정보가 없습니다.");
  //     setHasError(true);
  //     return;
  //   }

   const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setErrorMessage("유효한 위도와 경도 값을 입력하세요.");
      setHasError(true);
      return;
    }

    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      loadKakaoMapScript();
    }
  }, [latitude, longitude]);

  const loadKakaoMapScript = () => {
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkInterval);
          if (window.kakao.maps.load) {
            window.kakao.maps.load(() => initializeMap());
          } else {
            initializeMap();
          }
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => initializeMap());
    };
    script.onerror = () => {
      setErrorMessage("카카오맵 스크립트 로드 실패");
      setHasError(true);
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.kakao?.maps) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 3,
    });

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(latitude, longitude),
    });

    marker.setMap(map);

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${address}</div>`,
    });

    window.kakao.maps.event.addListener(marker, "click", () => {
      infowindow.open(map, marker);
    });

    setIsMapLoaded(true);
    setHasError(false);
  };

  if (hasError) {
    return (
      <>
        지도를 불러올 수 없습니다. {errorMessage}
      </>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#eee",
        border: "1px solid #ccc",
      }}
    >
      {!isMapLoaded && <div>지도를 불러오는 중입니다...</div>}
    </div>
  );
}
