import axios from "axios";

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

async function getLatLngFromAddress(address){
    try{
        const res = await axios.get("https://dapi.kakao.com/v2/local/search/address.json",{
            params:{
                query : address,
            },
            headers:{
                Authorization : `KakaoAK ${KAKAO_REST_API_KEY}`,
            },
            withCredentials: false, 
        })
        const result = res.data.documents[0];
        if(result){
            const latitude = result.y;
            const longitude = result.x;
            return {lat:latitude,lng:longitude};
        } else{
            throw new Error("주소를 찾을 수 없습니다.")
        }
    }catch(err){
        console.log("지오코딩 실패 : ",err);
        console.log("ㅋㅋ오키"+KAKAO_REST_API_KEY)
        return null;
    }
}

export default getLatLngFromAddress;