import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { recommendClassAtom,hotClassAtom } from "../../atom/classAtom";
import axios from "axios";
import { url } from "../../config";

export default function useRecommendClasses(userId) {
  const setRecommendClasses = useSetAtom(recommendClassAtom);
  const setHotClasses = useSetAtom(hotClassAtom);

  useEffect(() => {
    axios
      .get(`${url}/main`, {
        params: userId ? { userId } : {},
      })
      .then((res) => {
        setRecommendClasses(res.data.classes);
        setHotClasses(res.data.hotClasses);
      })
      .catch((err) => console.error("클래스 추천 데이터 로딩 실패", err));
  }, [userId]);
}
