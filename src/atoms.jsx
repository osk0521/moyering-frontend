import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const initUser = {
    userId:'',
    username:'',
    name:'',
    nickName:'',
    userType:'',
    profile:'',
}

export const userAtom = atomWithStorage("user",initUser,createJSONStorage(()=>sessionStorage));
export const tokenAtom = atomWithStorage("token","",createJSONStorage(()=>sessionStorage));