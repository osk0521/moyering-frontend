import { useEffect } from "react";
import {useSetAtom} from "jotai";
import {tokenAtom, userAtom} from "../atoms";
import axios from "axios";
import { url } from "../config";
import { useNavigate } from "react-router";
import { useAtomValue } from "jotai/react";
import { fcmTokenAtom } from "../atoms";


export default function Token() {
    let params = new URL(window.location.href).searchParams;
    let token = params.get("token");
    const fcmToken = useAtomValue(fcmTokenAtom);

    const setToken = useSetAtom(tokenAtom);
    setToken(token);
    const setUser = useSetAtom(userAtom);

    const navigate = useNavigate();

    useEffect(()=> {
        let formData = new FormData();
        formData.append("fcmToken", fcmToken);
        axios.post(`${url}/user`,formData,{
            headers:{Authorization:token}
        })
        .then(res=> {
            console.log(res);
            setUser(res.data);
            navigate("/");
        })
    },[token])
    return(<></>)
}