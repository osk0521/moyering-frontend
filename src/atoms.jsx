import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const initUser = {
    id:'',
    username:'',
    name:'',
    nickName:'',
    profile:'',
    userType:'',
    hostId:'',
}

export const userAtom = atomWithStorage("user",initUser,createJSONStorage(()=>sessionStorage));
export const tokenAtom = atomWithStorage("token","",createJSONStorage(()=>sessionStorage));
export const fcmTokenAtom = atomWithStorage("fcmToken", [], createJSONStorage(()=>sessionStorage));
export const alarmsAtom = atomWithStorage("alarms", [], createJSONStorage(()=>sessionStorage));