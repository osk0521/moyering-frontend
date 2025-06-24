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