import { useEffect } from 'react';
import axios from 'axios';

export default function AutoLocationFilter({ setSelectedSido, setFilter, fetchClassList }) {

    useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
        const { latitude, longitude } = position.coords;

        try {
            const res = await axios.get(`/api/location/sido`, {
            params: {
                lat: latitude,
                lng: longitude,
            },
            });

            const sido = res.data; // 예: '서울특별시'
            const simplified = simplifyRegionName(sido); // 예: '서울
            if (sido) {
                setSelectedSido(sido);
                setFilter((prev) => ({
                ...prev,
                sido: simplified
                }));            
                fetchClassList();
            }
        } catch (err) {
            console.error("위치 기반 시도 필터링 실패", err);
        }
        },
        (err) => {
        console.error("위치 접근 실패", err);
        }
    );
    }, []);

    return null;
}
function simplifyRegionName(fullName) {
    const map = {
        '서울특별시': '서울',
        '부산광역시': '부산',
        '대구광역시': '대구',
        '인천광역시': '인천',
        '광주광역시': '광주',
        '대전광역시': '대전',
        '울산광역시': '울산',
        '세종특별자치시': '세종특별자치시',
        '경기도': '경기도',
        '강원특별자치도': '강원특별자치도',
        '충청북도': '충북',
        '충청남도': '충남',
        '전라북도': '전북',
        '전라남도': '전남',
        '경상북도': '경북',
        '경상남도': '경남',
        '제주특별자치도': '제주특별자치도',
        };
    return map[fullName] || fullName;
}