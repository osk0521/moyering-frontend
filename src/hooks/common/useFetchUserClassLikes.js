import { useEffect } from "react";
import { useSetAtom,useAtomValue, useAtom } from "jotai";
import { classLikesAtom} from "../../atom/classAtom";
import { myAxios } from "../../config";
import { userAtom, tokenAtom } from "../../atoms";

export default function useFetchUserClassLikes() {
    const setClassLikes = useSetAtom(classLikesAtom);
    const user = useAtomValue(userAtom);    
    const [token,setToken] = useAtom(tokenAtom);
    const classLikes = useAtomValue(classLikesAtom); // 현재 상태 확인용

    useEffect(() => {
        // if (classLikes.length > 0) {
        //     return; 
        // }
    token && myAxios(token,setToken)
        .get(`/user/class-like-list`)
        .then((res) => {
        console.log(res);
        setClassLikes(res.data)
        
        })
        .catch((err) => console.error("사용자 클래스 찜목록 로딩 실패", err));

    }, [token,user]);
}
