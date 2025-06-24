import { useEffect } from "react";
import {useSetAtom} from "jotai";
import {tokenAtom, userAtom} from "../atoms";
import axios from "axios";
import { myAxios, url } from "../config";
import { useNavigate } from "react-router";
import React from 'react';

export default function Token() {
    let params = new URL(window.location.href).searchParams;
    let token = params.get("token");

    const setToken = useSetAtom(tokenAtom);
    setToken(token);
    const setUser = useSetAtom(userAtom);

    const navigate = useNavigate();

    useEffect(()=> {
        myAxios(token).post('/userInfo')
        .then(res=> {
            console.log(res);
            setUser(res.data);
            navigate("/");
        })
    },[token])
    return(<></>)
}