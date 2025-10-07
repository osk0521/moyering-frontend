
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios, url } from "../../config";

export function useGatheringList({ token, setToken, user }) {
  const navigate = useNavigate();

  // 상태
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("전체");
  const [searchWord, setSearchWord] = useState("");
  const [activeAccordion, setActiveAccordion] = useState("");
  const [selectedGatheringId, setSelectedGatheringId] = useState(null);

  const [gatheringList, setGatheringList] = useState([]);
  const [applyList, setApplyList] = useState([]);

  const [allCnt, setAllCnt] = useState(0);
  const [scheduledCnt, setScheduledCnt] = useState(0);
  const [inProgressCnt, setInProgressCnt] = useState(0);
  const [canceledCnt, setCanceledCnt] = useState(0);

  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);

  // 검색/페이징 상태
  const [search, setSearch] = useState({
    page: 1,
    status: "전체",
    searchWord: "",
  });

  /** 모임 취소 */
  const handleCancelGathering = async (gatheringId) => {
    try {
      const confirmCancel = window.confirm("정말로 이 모임을 취소하시겠습니까?");
      if (!confirmCancel) return;

      const response = await myAxios(token, setToken).post(`/user/cancelGathering/${gatheringId}`);
      if (response.status === 200) {
        setSearch((prev) => ({ ...prev })); // 새로고침 트리거
      }
    } catch (error) {
      console.error("모임 취소 오류:", error);
      alert(error.response?.data?.message || "모임 취소에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /** 수정 페이지 이동 */
  const handleEditGathering = (gatheringId) => {
    navigate(`/user/gatheringModify/${gatheringId}`);
  };

  /** 상세 페이지 이동 */
  const handleDetailGathering = (gatheringId) => {
    navigate(`/gatheringDetail/${gatheringId}`);
  };

  /** 신청자 분류 */
  const categorizeApplicants = (applyList) => {
    const pending = [];
    const accepted = [];
    const rejected = [];

    applyList.forEach((applicant) => {
      const data = {
        nickName: applicant.nickName,
        intro: applicant.intro,
        aspiration: applicant.aspiration,
        profile: applicant.profile,
        userId: applicant.userId,
        gatheringApplyId: applicant.gatheringApplyId,
        tags: [],
        isApprove: applicant.isApprove,
      };

      if (applicant.isApprove === null) pending.push(data);
      else if (applicant.isApprove === true) accepted.push(data);
      else rejected.push(data);
    });

    return { pending, accepted, rejected };
  };

  /** 신청자 승인/거절 업데이트 */
  const updateApproval = async (applyId, isApprove) => {
    try {
      setApplyList((prev) =>
        prev.map((a) =>
          a.gatheringApplyId === applyId ? { ...a, isApprove } : a
        )
      );
      await myAxios(token, setToken).post(
        `/updateApproval?applyId=${applyId}&isApprove=${isApprove}`
      );
    } catch (error) {
      console.error("승인 상태 변경 실패:", error);
      if (selectedGatheringId) {
        try {
          const res = await myAxios(token, setToken).get(
            `/getApplyListByGatheringId/${selectedGatheringId}`
          );
          setApplyList(res.data);
        } catch (rollbackError) {
          console.error("데이터 복원 실패:", rollbackError);
        }
      }
      alert("상태 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /** 수락된 참가자 내보내기 */
  const handleRemoveAccepted = async (applyId) => {
    if (window.confirm("정말로 이 참가자를 내보내시겠습니까?")) {
      await updateApproval(applyId, false);
    }
  };

  /** Accordion 토글 */
  const toggleAccordion = (id) => {
    const gatheringId = parseInt(id);

    if (activeAccordion !== id) {
      myAxios(token, setToken)
        .get(`/getApplyListByGatheringId/${gatheringId}`)
        .then((res) => {
          const applicants = categorizeApplicants(res.data);
          const total =
            applicants.pending.length +
            applicants.accepted.length +
            applicants.rejected.length;

          if (total === 0) {
            alert("신청자가 없습니다.");
            return;
          }
          setActiveAccordion(id);
          setSelectedGatheringId(gatheringId);
          setApplyList(res.data);
        })
        .catch((err) => {
          console.error("신청자 목록 로딩 오류:", err);
          alert("신청자 목록을 불러오는데 실패했습니다.");
        });
    } else {
      setActiveAccordion("");
      setSelectedGatheringId(null);
      setApplyList([]);
    }
  };

  /** 탭 변경 */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch((prev) => ({ ...prev, status: tab, page: 1 }));
  };

  /** 검색 실행 */
  const handleSearch = () => {
    setSearch((prev) => ({ ...prev, searchWord, page: 1 }));
  };

  /** 상태별 카운트 */
  const getStatusCount = (status) => {
    if (status === "전체") return allCnt;
    if (status === "진행예정") return scheduledCnt;
    if (status === "진행완료") return inProgressCnt;
    if (status === "취소된 모임") return canceledCnt;
    return 0;
  };

  /** 페이지 변경 */
  const handlePageChange = (page) => {
    setSearch((prev) => ({ ...prev, page }));
  };

  /** 모임 비활성화 여부 */
  const isGatheringDisabled = (item) => {
    if (item.canceled === true || item.status === "취소됨") return true;
    try {
      const meetingDateTime = new Date(`${item.meetingDate} ${item.startTime}`);
      return meetingDateTime < new Date();
    } catch {
      return false;
    }
  };

  /** 리스트 불러오기 */
  useEffect(() => {
    if (!(user && token)) return;
    // if (!user || !token) {
    //   if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
    //     navigate("/userlogin");
    //   } else {
    //     window.history.back();
    //   }
    //   return;
    // }

    const fetchList = async () => {
      setLoading(true);
      try {
        const requestBody = { page: search.page };
        if (search.searchWord?.trim()) requestBody.word = search.searchWord.trim();
        if (search.status === "진행예정") requestBody.status = "모집중";
        if (search.status === "진행완료") requestBody.status = "진행완료";
        if (search.status === "취소된 모임") requestBody.status = "취소됨";

        const res = await myAxios(token, setToken).post(`/user/myGatheringList`, requestBody);

        setAllCnt(res.data.allCnt);
        setScheduledCnt(res.data.scheduledCnt);
        setInProgressCnt(res.data.inProgressCnt);
        setCanceledCnt(res.data.canceledCnt);

        const resPageInfo = res.data.pageInfo;
        setPageInfo(resPageInfo);
        const pages = [];
        for (let i = resPageInfo.startPage; i <= resPageInfo.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);

        const transformedData = res.data.list.map((item) => ({
          gatheringId: item.gatheringId,
          thumbnail: `${url}/image?filename=${item.thumbnailFileName}`,
          category: item.categoryName + " > " + item.subCategoryName,
          region: item.locName,
          title: item.title,
          applyDeadline: new Date(item.applyDeadline).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          appliedCount: item.appliedCount,
          acceptedCount: item.acceptedCount,
          meetingTime: `${item.meetingDate} ${item.startTime} - ${item.endTime}`,
          meetingDate: item.meetingDate,
          startTime: item.startTime,
          participants: `${item.minAttendees}명 - ${item.maxAttendees ? `${item.maxAttendees}명` : "제한 없음"}`,
          location: `${item.address} ${item.detailAddress || ""}`.trim(),
          description: item.intrOnln || "",
          tags: (() => {
            try {
              return item.tags ? JSON.parse(item.tags) : [];
            } catch {
              return [];
            }
          })(),
          status: item.status,
          canceled: item.canceled,
          preparationItems: item.preparationItems,
        }));

        setGatheringList(transformedData);
      } catch (err) {
        console.error("데이터 로딩 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [token, search, user, navigate, setToken]);

  return {
    loading,
    activeTab,
    gatheringList,
    applyList,
    pageInfo,
    pageNums,
    searchWord,
    setSearchWord,
    handleSearch,
    handleTabChange,
    handleEditGathering,
    handleCancelGathering,
    handleDetailGathering,
    getStatusCount,
    handlePageChange,
    isGatheringDisabled,
    toggleAccordion,
    activeAccordion,
    categorizeApplicants,
    handleRemoveAccepted,
    updateApproval,
  };
}
