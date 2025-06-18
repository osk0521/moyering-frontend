import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { recommendClassAtom,hotClassAtom ,recommendGatheringAtom,mainBannerList} from "../../atom/classAtom";
import axios from "axios";
import { url } from "../../config";

export default function useRecommendClasses(userId) {
  const setRecommendClasses = useSetAtom(recommendClassAtom);
  const setHotClasses = useSetAtom(hotClassAtom);
  const setGathers = useSetAtom(recommendGatheringAtom);
  const setBanners = useSetAtom(mainBannerList);

  useEffect(() => {
    axios
      .get(`${url}/main`, {
        params: userId ? { userId } : {},
      })
      .then((res) => {
        setRecommendClasses(res.data.classes);
        setHotClasses(res.data.hotClasses);
        setGathers(res.data.gathers);
        setBanners(res.data.banners);
      })
      .catch((err) => console.error("클래스 추천 데이터 로딩 실패", err));
  }, [userId]);
}
