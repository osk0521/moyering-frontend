import axios from "axios";

export const url = "http://localhost:8080";
export const reactUrl = "http://localhost:5173";
export const KAKAO_REST_API_KEY = "d5da5075e3807c37906c708e46d9cb11";
export const KAKAO_JavaScript_API_KEY  = "f85646372872878b78061efc7e2d26b6";

export const myAxios = (token,setToken) => {
   var instance = axios.create({
      baseURL: url,
      timeout: 5000,
   })

   axios.defaults.withCredentials = true; // 세션 쿠키를 요청에 포함 (방문자 기록용)

   instance.interceptors.response.use(
      (response)=>{ 
         console.log(response)
         if(response.headers.authorization){
            setToken(response.headers.authorization)
         }
         return response;
      }
      ,
      (error)=>{
         console.log(error)
         console.log("=======")
          if (error.response && error.response.status) {
            switch (error.response.status) {
               case 401:
               case 403:
                  window.location.href = `${reactUrl}/userLogin`; break;
               default:
                  return Promise.reject(error);
            }
         }
         return Promise.reject(error);
      }
   );

   token && instance.interceptors.request.use((config) => {
      config.headers.Authorization = token;
      return config;
   });

   return instance;
}

