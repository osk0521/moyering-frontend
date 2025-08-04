import { useCallback } from "react";
import { myAxios, url } from "../../config";

export function useGatheringList(token, setToken) {
  const fetchMyGatherings = useCallback(async (search) => {
    const requestBody = {
      page: search.page,
    };

  const handlePageChange = useCallback((page) => {
    setSearch((prev) => ({ ...prev, page }));
  }, []);
    const statusMap = {
      "전체": null,
      "진행예정": "모집중",
      "진행완료": "진행완료",
      "취소된 모임": "취소됨",
    };

    const mappedStatus = statusMap[search.status];
    if (mappedStatus) requestBody.status = mappedStatus;
    if (search.searchWord?.trim()) requestBody.word = search.searchWord.trim();

    const response = await myAxios(token, setToken).post("/user/myGatheringList", requestBody);
    return response.data;
  }, [token, setToken]);

  return { fetchMyGatherings };
}
