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

export default function GatherInquiry() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState("participated");
  const [myInquiryCnt, setMyInquiryCnt] = useState(0);
  const [myInquiryList, setMyInquiryList] = useState([]);
  const [receivedInquiryCnt, setReceivedInquiryCount] = useState(0);
  const [receivedInquiryList, setReceivedInquiryList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [openId, setOpenId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1
  });

  // 검색 조건 생성 함수
  const createSearchParams = useCallback((page = 1) => {
    const params = { page };
    
    if (selectedStatus !== "전체") {
      params.status = selectedStatus;
    }
    
    if (startDate && endDate) {
      params.startDate = startDate.toISOString().split('T')[0];
      params.endDate = endDate.toISOString().split('T')[0];
    }
    
    return params;
  }, [selectedStatus, startDate, endDate]);

  // 데이터 로딩 함수
  const loadInquiryData = useCallback(async (page = 1) => {
    if (!user && !token) {
      if (confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
        navigate("/userlogin");
      } else {
        navigate(-1);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestParams = createSearchParams(page);
      const isOrganized = activeTab === "organized";
      const endpoint = isOrganized 
        ? `/user/getGatheringInquiriesByOrganizerUserId`
        : `/user/getGatheringInquiriesByUserId`;

      const response = await myAxios(token, setToken).get(endpoint, { params: requestParams });
      const { data } = response;

      setMyInquiryCnt(data.findInquirieCntSentByUser || 0);
      setReceivedInquiryCount(data.findInquirieCntReceivedByOrganizer || 0);
      setPageInfo(data.pageInfo || { curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
      setCurrentPage(data.pageInfo?.curPage || 1);

      if (isOrganized) {
        setReceivedInquiryList(data.gatheringInquiryList || []);
      } else {
        setMyInquiryList(data.gatheringInquiryList || []);
      }

    } catch (err) {
      console.error("데이터 로딩 오류:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [user, token, activeTab, createSearchParams, navigate, setToken]);

  // 검색 실행
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    loadInquiryData(1);
  }, [loadInquiryData]);

  // 페이지 변경
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    loadInquiryData(page);
  }, [loadInquiryData]);

  // 탭 변경
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedStatus("전체");
    setCurrentPage(1);
    setOpenId(null);
    setReplyText({});
  }, []);

  // 답변 등록
  const handleReplySubmit = useCallback(async (inquiryId) => {
    const reply = replyText[inquiryId];
    if (!reply || !reply.trim()) {
      alert("답변을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      // API 호출 로직 추가 필요
      // await myAxios(token, setToken).post(`/user/submitInquiryResponse`, {
      //   inquiryId,
      //   responseContent: reply.trim()
      // });
      
      alert("답변이 등록되었습니다.");
      setReplyText(prev => ({ ...prev, [inquiryId]: "" }));
      loadInquiryData(currentPage); // 데이터 재로딩
    } catch (err) {
      console.error("답변 등록 오류:", err);
      alert("답변 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [replyText, token, setToken, currentPage, loadInquiryData]);

  // 초기 로딩 및 조건 변경 시 재로딩
  useEffect(() => {
    loadInquiryData(1);
  }, [activeTab, selectedStatus, startDate, endDate]);

  // 현재 탭에 따른 데이터 선택
  const currentData = activeTab === "participated" ? myInquiryList : receivedInquiryList;
  const currentCount = activeTab === "participated" ? myInquiryCnt : receivedInquiryCnt;

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
    setStartDate(start);
    setEndDate(end);
  }, []);

  // 날짜 초기화
  const clearDates = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  // 페이지네이션 렌더링
  const renderPagination = () => {
    const pages = [];
    for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`MyGatherInquiryList_pagination-btn_osk ${
            i === currentPage ? "MyGatherInquiryList_pagination-active_osk" : ""
          }`}
          onClick={() => handlePageChange(i)}
          disabled={loading}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (error) {
    return (
      <div>
        <Header />
        <main className="MyGatherPage_container MyGatherInquiryList_gather-inquiry-page_osk">
          <Sidebar />
          <section className="MyGatherInquiryList_inquiry-section_osk">
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => loadInquiryData(currentPage)}>다시 시도</button>
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="MyGatherInquiryList_status-select_osk"
              >
                <option value="전체">전체</option>
                <option value="답변대기">답변대기</option>
                <option value="답변완료">답변완료</option>
              </select>
            </div>
          </div>

          <div className="MyGatherInquiryList_inquiry-tabs_osk">
            <button
              className={activeTab === "participated" ? "MyGatherInquiryList_active_osk" : ""}
              onClick={() => handleTabChange("participated")}
              disabled={loading}
            >
              내가 등록한 모임문의 ({myInquiryCnt})
            </button>
            <button
              className={activeTab === "organized" ? "MyGatherInquiryList_active_osk" : ""}
              onClick={() => handleTabChange("organized")}
              disabled={loading}
            >
              내가 주최한 모임문의 ({receivedInquiryCnt})
            </button>
          </div>

          {loading && (
            <div className="MyGatherInquiryList_loading_osk">
              <p>데이터를 불러오는 중...</p>
            </div>
          )}

          <div className="MyGatherInquiryList_inquiry-list_osk">
            {currentData.length === 0 ? (
              <div className="MyGatherInquiryList_no-data_osk">
                <p>문의 내역이 없습니다.</p>
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
                        <div className="MyGatherInquiryList_user-profile_osk">
                          {item.profile && (
                            <img src={`${url}/image?filename=${item.profile}`} alt= {item.nickName} />
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
                              {loading ? "등록 중..." : "등록"}
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
              <button
                className="MyGatherInquiryList_pagination-btn_osk"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
              >
                ‹
              </button>
              {renderPagination()}
              <button
                className="MyGatherInquiryList_pagination-btn_osk"
                onClick={() => handlePageChange(Math.min(pageInfo.allPage, currentPage + 1))}
                disabled={currentPage === pageInfo.allPage || loading}
              >
                ›
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}