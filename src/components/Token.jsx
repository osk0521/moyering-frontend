import { useEffect } from "react";
import {useSetAtom} from "jotai";
import {tokenAtom, userAtom} from "../atoms";
import axios from "axios";
import { url } from "../config";
import { useNavigate } from "react-router";

export default function Token() {
    let params = new URL(window.location.href).searchParams;
    let token = params.get("token");

    const setToken = useSetAtom(tokenAtom);
    setToken(token);
    const setUser = useSetAtom(userAtom);

    const navigate = useNavigate();

    useEffect(()=> {
        axios.post(`${url}/user`,null,{
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