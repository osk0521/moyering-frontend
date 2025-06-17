import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { recommendClassAtom } from "../../atom/classAtom";
import axios from "axios";
import { url } from "../../config";

export default function useRecommendClasses(userId) {
  const setClasses = useSetAtom(recommendClassAtom);

  useEffect(() => {
    axios
      .get(`${url}/main`, {
        params: userId ? { userId } : {},
      })
      .then((res) => {
        setClasses(res.data);
      })
      .catch((err) => console.error(err));
  }, [userId]);
}
