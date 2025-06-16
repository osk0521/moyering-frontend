import axios from "axios";

export const url = "http://localhost:8080";

export const myAxios = (token) => {
   var instance = axios.create({
      baseURL : url,
      timeout:5000,
   })

   token && instance.interceptors.request.use((config)=>{
    config.headers.Authorization = token;
    return config;
  });

  return instance;
}

