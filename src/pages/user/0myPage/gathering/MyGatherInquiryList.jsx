import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MyGatherInquiryList.css";
import Sidebar from "../common/Sidebar";
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../../../atoms";
import { myAxios, url } from "../../../../config";
import { ko } from "date-fns/locale";

export default function GatherInquiry() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  // 상태 관리
  const [activeTab, setActiveTab] = useState("registered");
  const [myInquiryCnt, setMyInquiryCnt] = useState(0);
  const [myInquiryList, setMyInquiryList] = useState([]);
  const [receivedInquiryCnt, setReceivedInquiryCount] = useState(0);
  const [receivedInquiryList, setReceivedInquiryList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이지네이션 상태
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1
  });
  const [pageNums, setPageNums] = useState([]);
  const [search, setSearch] = useState({
    page: 1,
    status: "",
    startDate: "",
    endDate: ""
  });

  // 탭 정의
  const tabs = [
    { display: "내가 등록한 게더링 문의", value: "registered" },
    { display: "내가 주최한 게더링 문의", value: "organized" }
  ];

  // 검색 파라미터 생성
  const createRequestBody = useCallback(() => {
    const requestBody = {
      page: search.page,
    };

    if (selectedStatus !== null) {
      requestBody.isAnswered = selectedStatus;
    }
    if (startDate) {
      requestBody.startDate = startDate.toISOString().split('T')[0];
    }  
    if (endDate) {
      requestBody.endDate = endDate.toISOString().split('T')[0];
    } 
    return requestBody;
  }, [search, startDate, endDate]);

  // 데이터 로딩 함수
  const loadInquiryData = useCallback(async () => {
    if (!user && !token) {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
        navigate("/userlogin");
      } else {
        window.history.back();
      }
      return;
    }

    if (!token) {
      console.log('토큰이 없습니다. 로딩을 건너뜁니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody = createRequestBody();
      const isOrganized = activeTab === "organized";
      const endpoint = isOrganized
        ? `/user/getGatheringInquiriesByOrganizerUserId`
        : `/user/getGatheringInquiriesByUserId`;

      console.log("API 요청:", { endpoint, requestBody });

      const response = await myAxios(token, setToken).post(endpoint, requestBody );
      const { data } = response;

      console.log("API 응답:", data);

      setMyInquiryCnt(data.findInquirieCntSentByUser || 0);
      setReceivedInquiryCount(data.findInquirieCntReceivedByOrganizer || 0);

      // 페이지 정보 설정
      if (data.pageInfo) {
        setPageInfo(data.pageInfo);
        const pages = [];
        for (let i = data.pageInfo.startPage; i <= data.pageInfo.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      }

      // 문의 목록 설정
      if (isOrganized) {
        setReceivedInquiryList(data.gatheringInquiryList || []);
      } else {
        setMyInquiryList(data.gatheringInquiryList || []);
      }

    } catch (err) {
      console.error("데이터 로딩 오류:", err);

      if (err.response?.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        setToken('');
        if (window.confirm("로그인이 만료되었습니다. 로그인 페이지로 이동하시겠습니까?")) {
          navigate("/userlogin");
        }
      } else {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [user, token, activeTab, createRequestBody]);

  // 페이지 변경
  const handlePageChange = useCallback((page) => {
    setSearch(prev => ({ ...prev, page }));
  }, []);

  // 탭 변경
  const handleTabChange = useCallback((tabValue) => {
    setActiveTab(tabValue);
    setSelectedStatus(null);
    setSearch(prev => ({
      ...prev,
      page: 1,
      isAnswered: null
    }));
    setOpenId(null);
    setReplyText({});
  }, []);

  // 상태 변경
  const handleStatusChange = useCallback((statusValue) => {
  let booleanStatus = null;
  switch(statusValue) {
    case "전체":
      booleanStatus = null;
      break;
    case "답변대기":
      booleanStatus = false;
      break;
    case "답변완료":
      booleanStatus = true;
      break;
    default:
      booleanStatus = null;
  }
  
  console.log("변환된 Boolean 값:", booleanStatus);
  
  setSelectedStatus(booleanStatus);
  setSearch(prev => ({ 
    ...prev, 
    isAnswered: booleanStatus, 
    page: 1 
  }));
}, []);
  const getStatusDisplayText = (booleanStatus) => {
      if (booleanStatus === null) return "전체";
      if (booleanStatus === true) return "답변완료";
      if (booleanStatus === false) return "답변대기";
      return "전체";
    };
  // 답변 등록
 const handleReplySubmit = useCallback(async (inquiryId) => {
  const reply = replyText[inquiryId];
  if (!reply || !reply.trim()) {
    alert("답변을 입력해주세요.");
    return;
  }

  // currentInquiry 찾기 및 검증을 먼저 수행
  const currentInquiry = receivedInquiryList.find(item => item.inquiryId === inquiryId);
  if (!currentInquiry) {
    alert("문의 정보를 찾을 수 없습니다.");
    return;
  }

try {
    setLoading(true);
    
    const requestData = {
        inquiryId: inquiryId,
        gatheringId: currentInquiry.gatheringId,
        responseContent: reply.trim(),
        responseDate: new Date().toISOString().split('T')[0]
    };
    
    const response = await myAxios(token, setToken).post(
        `/user/responseToGatheringInquiry`, 
        requestData 
    );
    alert("답변이 등록되었습니다.");
    setReplyText(prev => ({ ...prev, [inquiryId]: "" }));
    setOpenId(null); // 아코디언 닫기
    loadInquiryData(); // 데이터 재로딩
  } catch (err) {
    console.error("답변 등록 오류:", err);
    if (err.response?.status === 401) {
      setError("인증이 만료되었습니다. 다시 로그인해주세요.");
      setToken('');
      if (window.confirm("로그인이 만료되었습니다. 로그인 페이지로 이동하시겠습니까?")) {
        navigate("/userlogin");
      }
    } else if (err.response?.status === 400) {
      alert("잘못된 요청입니다. 입력 내용을 확인해주세요.");
    } else {
      alert("답변 등록 중 오류가 발생했습니다.");
    }
  } finally {
    setLoading(false);
  }
}, [replyText, token, setToken, loadInquiryData, navigate, setError, setToken]);

  // 데이터 로딩 useEffect
  useEffect(() => {
    if (token && user) {
      loadInquiryData();
    }
  }, [token, user, search, activeTab, selectedStatus, startDate, endDate, loadInquiryData]);

  // 현재 탭에 따른 데이터 선택
  const currentData = activeTab === "registered" ? myInquiryList : receivedInquiryList;
  const currentCount = activeTab === "registered" ? myInquiryCnt : receivedInquiryCnt;

  // 아코디언 토글
  const toggleAccordion = useCallback((id) => {
    setOpenId(prev => prev === id ? null : id);
  }, []);

  // 답변 텍스트 변경
  const handleReplyChange = useCallback((id, text) => {
    setReplyText(prev => ({ ...prev, [id]: text }));
  }, []);

  // 날짜 변경
  const onChange = useCallback((dates) => {
    const [start, end] = dates;
    if (start && end) {
      if (end < start) {
        setStartDate(start);
        setEndDate(start);
        return;
      }
    }
    setStartDate(start);
    setEndDate(end);
  }, []);

  // 날짜 초기화
  const clearDates = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  // 에러 상태 렌더링
  if (error) {
    return (
      <div>
        <Header />
        <main className="MyGatherPage_container MyGatherInquiryList_gather-inquiry-page_osk">
          <Sidebar />
          <section className="MyGatherInquiryList_inquiry-section_osk">
            <div className="MyGatherInquiryList_error-state_osk">
              <h4>오류가 발생했습니다</h4>
              <p>{error}</p>
              <button onClick={() => loadInquiryData()}>다시 시도</button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="MyGatherPage_container MyGatherInquiryList_gather-inquiry-page_osk">
        <Sidebar />
        <section className="MyGatherInquiryList_inquiry-section_osk">
          <div className="MyGatherInquiryList_inquiry-header_osk">
            <h2 className="MyGatherInquiryList_inquiry-title_osk">문의내역</h2>

            <div className="MyGatherInquiryList_date-filter_osk">
              <span className="MyGatherInquiryList_date-label_osk">등록 기간</span>
              <div className="MyGatherInquiryList_date-picker-container_osk">
                <DatePicker
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  placeholderText="전체"
                  className="MyGatherInquiryList_date-picker_osk"
                  dateFormat="yyyy.MM.dd"
                  isClearable={false}
                  locale={ko} 
                  maxDate={new Date()} 
                  shouldCloseOnSelect={false} 
                />
                {(startDate || endDate) && (
                  <button
                    type="button"
                    className="MyGatherInquiryList_clear-button_osk"
                    onClick={clearDates}
                    aria-label="Clear dates"
                  >
                    ✕
                  </button>
                )}
              </div>

              <span className="MyGatherInquiryList_date-label_osk">상태</span>
              <select
                value={getStatusDisplayText(selectedStatus)} 
                onChange={(e) => handleStatusChange(e.target.value)}
                className="MyGatherInquiryList_status-select_osk"
              >
                <option value="전체">전체</option>
                <option value="답변대기">답변대기</option>    
                <option value="답변완료">답변완료</option>   
              </select>
            </div>
          </div>

          <div className="MyGatherInquiryList_inquiry-tabs_osk">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`MyGatherInquiryList_tab_osk ${activeTab === tab.value ? "MyGatherInquiryList_active_osk" : ""
                  }`}
                onClick={() => handleTabChange(tab.value)}
                disabled={loading}
              >
                {tab.display} ({tab.value === "registered" ? myInquiryCnt : receivedInquiryCnt})
              </button>
            ))}
          </div>

          {loading && (
            <div className="MyGatherInquiryList_loading_osk">
              <p>데이터를 불러오는 중...</p>
            </div>
          )}

          <div className="MyGatherInquiryList_inquiry-list_osk">
            {currentCount <= 0 ? (
              <div className="MyGatherInquiryList_empty-state_osk">
                <div className="MyGatherInquiryList_empty-content_osk">
                  <h4>조회된 문의가 없습니다</h4>
                  <p>검색 조건을 변경하거나 새로운 문의를 등록해보세요.</p>
                </div>
              </div>
            ) : (
              currentData.map((item) => (
                <div key={item.inquiryId} className="MyGatherInquiryList_inquiry-box_osk">
                  <div
                    className="MyGatherInquiryList_accordion-header_osk"
                    onClick={() => toggleAccordion(item.inquiryId)}
                  >
                    <div className="MyGatherInquiryList_inquiry-info_osk">
                      <div className="MyGatherInquiryList_user-info_osk">
                        <div className="MyGatherInquiryList_user-profile_osk ">
                          {item.profile && (
                            <img
                              src={`${url}/image?filename=${item.profile}`}
                              alt="프로필"
                              onError={(e) => {
                                e.target.src = '/default-profile.png';
                              }}
                            />
                          )}
                        </div>
                        <span className="MyGatherInquiryList_username_osk">
                          {item.nickName}
                        </span>
                        <span className={`MyGatherInquiryList_status_osk status-${item.responseState}`}>
                          {item.responseState}
                        </span>
                      </div>
                      <div className="MyGatherInquiryList_inquiry-details_osk">
                        <h3 className="MyGatherInquiryList_inquiry-title-item_osk">
                          {item.title}
                        </h3>
                        <div className="MyGatherInquiryList_inquiry-dates_osk">
                          <span>문의 등록일: {item.inquiryDate}</span>
                          <span>모임일: {item.meetingDate}</span>
                          {item.responseDate && (
                            <span>답변일: {item.responseDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {openId === item.inquiryId && (
                    <div className="MyGatherInquiryList_accordion-body_osk">
                      <p className="MyGatherInquiryList_question_osk">
                        Q. {item.inquiryContent}
                      </p>

                      {item.responseContent ? (
                        <div className="MyGatherInquiryList_answer_osk">
                          <p>
                            <strong>A.</strong> {item.responseContent}
                          </p>
                        </div>
                      ) : activeTab === "organized" ? (
                        <div className="MyGatherInquiryList_answer-form_osk">
                          <textarea
                            className="MyGatherInquiryList_answer-textarea_osk"
                            placeholder={`${item.nickName}님의 문의에 소중한 답변을 등록해 주세요`}
                            value={replyText[item.inquiryId] || ""}
                            onChange={(e) => handleReplyChange(item.inquiryId, e.target.value)}
                            disabled={loading}
                          />
                          <div className="MyGatherInquiryList_submit-btn-container_osk">
                            <button
                              className="MyGatherInquiryList_submit-btn_osk"
                              onClick={() => handleReplySubmit(item.inquiryId)}
                              disabled={loading || !replyText[item.inquiryId]?.trim()}
                            >
                              등록
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="MyGatherInquiryList_no-answer_osk">
                          <p>답변 대기 중입니다.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {pageInfo.allPage > 1 && (
            <div className="MyGatherInquiryList_pagination_osk">
              {pageInfo.curPage > 1 && (
                <button
                  className="MyGatherInquiryList_pagination-btn_osk"
                  onClick={() => handlePageChange(pageInfo.curPage - 1)}
                  disabled={loading}
                >
                  〈
                </button>
              )}
              {pageNums.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={
                    pageInfo.curPage === pageNum
                      ? "MyGatherInquiryList_pagination-btn_osk MyGatherInquiryList_pagination-active_osk"
                      : "MyGatherInquiryList_pagination-btn_osk"
                  }
                  disabled={loading}
                >
                  {pageNum}
                </button>
              ))}
              {pageInfo.curPage < pageInfo.allPage && (
                <button
                  className="MyGatherInquiryList_pagination-btn_osk"
                  onClick={() => handlePageChange(pageInfo.curPage + 1)}
                  disabled={loading}
                >
                  〉
                </button>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}