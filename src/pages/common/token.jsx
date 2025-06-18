import { useEffect } from "react";
import { useNavigate } from "react-router";
import { url } from "../../config";

export default function token(){
    let params = new URL(window.location.href).searchParams;
    let token = params.get("token");
    const navigate = useNavigate();
    const setToken = useSetAtom(tokenAtom);
    setToken(token);
    const setUser = useSetAtom(userAtom);

    useEffect(()=>{
        axios.post(`${url}/`,null,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(res=>{
            setUser(res.data);
            navigate("/");
        })
        .catch(err=>{
            console.err("인증 실패",err);
            navigate("/userLogin");
        })
    },[token])

    return null;
}