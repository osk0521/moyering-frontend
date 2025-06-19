import { useEffect } from "react";
import { useSetAtom,useAtomValue } from "jotai";
import { recommendClassAtom,hotClassAtom ,recommendGatheringAtom,mainBannerList} from "../../atom/classAtom";
import { myAxios } from "../../config";
import { userAtom, tokenAtom } from "../../atoms";

export default function useRecommendClasses() {
  const setRecommendClasses = useSetAtom(recommendClassAtom);
  const setHotClasses = useSetAtom(hotClassAtom);
  const setGathers = useSetAtom(recommendGatheringAtom);
  const setBanners = useSetAtom(mainBannerList);

  const user = useAtomValue(userAtom);    
  const token = useAtomValue(tokenAtom);

  console.log(user.name);

  useEffect(() => {
    const isLoggedIn = !!token;
    
    myAxios(token)
      .get(`/main`)
      .then((res) => {
        setRecommendClasses(res.data.classes);
        setHotClasses(res.data.hotClasses);
        setGathers(res.data.gathers);
        setBanners(res.data.banners);
      })
      .catch((err) => console.error("클래스 추천 데이터 로딩 실패", err));
      setRecommendClasses([]);
      setHotClasses([]);
      setGathers([]);
      setBanners([]);
  }, [token,user]);
}
