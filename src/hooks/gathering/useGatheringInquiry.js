import { useState, useCallback, useEffect } from "react";
import { myAxios } from "../../config";
import { useNavigate } from "react-router-dom";

export function useGatheringInquiry({ token, user, setToken }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("registered");
  const [myInquiryCnt, setMyInquiryCnt] = useState(0);
  const [myInquiryList, setMyInquiryList] = useState([]);
  const [receivedInquiryCnt, setReceivedInquiryCnt] = useState(0);
  const [receivedInquiryList, setReceivedInquiryList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [pageNums, setPageNums] = useState([]);
  const [search, setSearch] = useState({ page: 1 });

  const tabs = [
    { display: "내가 등록한 게더링 문의", value: "registered" },
    { display: "내가 주최한 게더링 문의", value: "organized" }
  ];
  const currentData = activeTab === "registered" ? myInquiryList : receivedInquiryList;
  const currentCount = activeTab === "registered" ? myInquiryCnt : receivedInquiryCnt;

  const createRequestBody = useCallback(() => {
    const body = { page: search.page };
    if (selectedStatus !== null) body.isAnswered = selectedStatus;
    if (startDate) body.startDate = startDate.toISOString().split("T")[0];
    if (endDate) body.endDate = endDate.toISOString().split("T")[0];
    return body;
  }, [search.page, selectedStatus, startDate, endDate]);
  const loadInquiryData = useCallback(async () => {
    if (!(user && token)) {
      setError("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isOrganized = activeTab === "organized";
      const endpoint = isOrganized
        ? `/user/getGatheringInquiriesByOrganizerUserId`
        : `/user/getGatheringInquiriesByUserId`;

      const requestBody = createRequestBody();
      const response = await myAxios(token, setToken).post(endpoint, requestBody);
      const data = response.data;

      setMyInquiryCnt(data.findInquirieCntSentByUser || 0);
      setReceivedInquiryCnt(data.findInquirieCntReceivedByOrganizer || 0);

      if (data.pageInfo) {
        setPageInfo(data.pageInfo);
        const pages = [];
        for (let i = data.pageInfo.startPage; i <= data.pageInfo.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      }

      if (isOrganized) {
        setReceivedInquiryList(data.gatheringInquiryList || []);
      } else {
        setMyInquiryList(data.gatheringInquiryList || []);
      }
    } catch (err) {
      console.error("문의 데이터 로딩 실패:", err);
      if (err.response?.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        setToken("");
        navigate("/userlogin");
      } else {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, user, activeTab, search.page, selectedStatus, startDate, endDate]);

  const handleTabChange = useCallback((tabValue) => {
    setActiveTab(tabValue);
    setSelectedStatus(null);
    setSearch({ page: 1 });
    setReplyText({});
    setOpenId(null);
  }, []);

  const handlePageChange = useCallback((page) => {
    setSearch((prev) => ({ ...prev, page }));
  }, []);

  const handleStatusChange = useCallback((statusValue) => {
    let booleanStatus = null;
    if (statusValue === "답변대기") booleanStatus = false;
    else if (statusValue === "답변완료") booleanStatus = true;
    else booleanStatus = null;
    setSelectedStatus(booleanStatus);
    setSearch({ page: 1 });
  }, []);

  const handleReplyChange = useCallback((id, text) => {
    setReplyText((prev) => ({ ...prev, [id]: text }));
  }, []);

  const toggleAccordion = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const clearDates = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  const handleReplySubmit = useCallback(async (inquiryId) => {
    const reply = replyText[inquiryId]?.trim();
    if (!reply) return alert("답변을 입력해주세요.");

    const targetList = receivedInquiryList;
    const target = targetList.find((item) => item.inquiryId === inquiryId);
    if (!target) return alert("문의 정보를 찾을 수 없습니다.");

    try {
      setLoading(true);
      const payload = {
        inquiryId,
        gatheringId: target.gatheringId,
        responseContent: reply,
        responseDate: new Date().toISOString().split("T")[0],
      };
      await myAxios(token, setToken).post(`/user/responseToGatheringInquiry`, payload);
      setReplyText((prev) => ({ ...prev, [inquiryId]: "" }));
      setOpenId(null);
      loadInquiryData();
    } catch (err) {
      console.error("답변 등록 오류:", err);
      alert("답변 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [replyText, receivedInquiryList]);

  useEffect(() => {
    if (token && user) {
      loadInquiryData();
    }
  }, [token, user, search, activeTab, selectedStatus, startDate, endDate]);

  return {
    error,
    loading,
    tabs,
    activeTab,
    currentData,
    currentCount,
    startDate,
    endDate,
    selectedStatus,
    pageInfo,
    pageNums,
    replyText,
    openId,
    setStartDate,
    setEndDate,
    handleTabChange,
    handleStatusChange,
    handlePageChange,
    toggleAccordion,
    handleReplyChange,
    handleReplySubmit,
    clearDates,
  };
}
