import { useEffect } from "react";
import { useSetAtom,useAtomValue, useAtom } from "jotai";
import { gatheringLikesAtom} from "../../atom/classAtom";
import { myAxios } from "../../config";
import { userAtom, tokenAtom } from "../../atoms";

export default function  useFetchUserGatherLikes() {
    const setGatherLikes = useSetAtom(gatheringLikesAtom);
    const user = useAtomValue(userAtom);    
    const [token,setToken] = useAtom(tokenAtom);
    const gatherLikes = useAtomValue(gatheringLikesAtom); // 현재 상태 확인용

    useEffect(() => {
    // if (gatherLikes.length > 0) {
    //     return; 
    // }
    token && myAxios(token,setToken)
        .get(`/user/gather-like-list`)
        .then((res) => {
        console.log(res);
        setGatherLikes(res.data)
        })
        .catch((err) => console.error("사용자 게더링 찜목록 로딩 실패", err));

    }, [token,user]);
};
