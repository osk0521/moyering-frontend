import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios, url } from "../../config";

export function useGatheringApplyList({ token, setToken, navigate, user }) {
  const [applyList, setApplyList] = useState([]);
  const [activeTab, setActiveTab] = useState("전체");
  const [searchWord, setSearchWord] = useState("");
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [pageNums, setPageNums] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ 전체: 0, 대기중: 0, 수락됨: 0, 거절됨: 0 });
  const [search, setSearch] = useState({ page: 1, status: "전체", searchWord: "" });

  const getStatusCount = useCallback((status) => statusCounts[status] ?? 0, [statusCounts]);

  const isGatheringDisabled = (item) => {
    if (item.canceled) return true;
    try {
      return new Date(`${item.meetingDate} ${item.startTime}`) < new Date();
    } catch {
      return false;
    }
  };

  const handleCancelApply = async (gathering) => {
    if (!window.confirm(`'${gathering.title}' 참여를 취소하시겠습니까?`)) return;
    try {
      const res = await myAxios(token, setToken).post(`/user/cancelGatheringApply/${gathering.gatheringApplyId}`);
      if (res.status === 200) {
        alert("참여가 취소되었습니다.");
        setApplyList(list => list.filter(i => i.gatheringApplyId !== gathering.gatheringApplyId));
        setStatusCounts(prev => {
          const copy = { ...prev };
          copy.전체--;
          if (gathering.status in copy) copy[gathering.status]--;
          return copy;
        });
      }
    } catch (err) {
      alert(err.response?.data?.message ?? "취소 실패");
    }
  };
  const handlePageChange = useCallback((page) => {
    setSearch((prev) => ({ ...prev, page }));
  }, []);

  const handleDetailGathering = (id) => navigate(`/gatheringDetail/${id}`);

  const handleSearch = () => setSearch(prev => ({ ...prev, searchWord, page: 1 }));

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch(prev => ({ ...prev, status: tab, page: 1 }));
  };

  useEffect(() => {
    if (!(user && token)) return;
    const reqBody = { page: search.page };
    if (search.searchWord?.trim()) reqBody.word = search.searchWord.trim();
    if (search.status !== "전체") reqBody.status = search.status;

    myAxios(token, setToken).post(`/user/myApplyList`, reqBody).then(res => {
      setStatusCounts({
        전체: res.data.allCnt,
        대기중: res.data.undefinedCnt,
        수락됨: res.data.inProgressCnt,
        거절됨: res.data.canceledCnt,
      });
      const pageData = res.data.pageInfo;
      setPageInfo(pageData);
      setPageNums(Array.from({ length: pageData.endPage - pageData.startPage + 1 }, (_, i) => pageData.startPage + i));
      const transformed = res.data.list.map(item => ({
        ...item,
        image: `${url}/image?filename=${item.thumbnailFileName}`,
        location: item.address ? `${item.address} (${item.locName})` : item.locName,
        participants: `${item.minAttendees}명 - ${item.maxAttendees || "제한 없음"}`,
        time: `${item.startTime} - ${item.endTime}`,
        status: getApprovalStatus(item.isApprove, item.canceled),
        tags: safeParse(item.tags),
      }));
      setApplyList(transformed);
    }).catch(err => console.error("목록 로딩 오류:", err));
  }, [token, search]);

  return {
    activeTab,
    applyList,
    pageInfo,
    pageNums,
    searchWord,
    setSearchWord,
    handleCancelApply,
    handleDetailGathering,
    handleSearch,
    handleTabChange,
    getStatusCount,
    isGatheringDisabled
  };
}

function getApprovalStatus(isApprove, canceled) {
  if (canceled) return "취소됨";
  if (isApprove === false) return "거절됨";
  if (isApprove === null) return "대기중";
  if (isApprove === true) return "수락됨";
  return "대기중";
}

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("태그 파싱 오류:", e, json);
    return [];
  }
}
