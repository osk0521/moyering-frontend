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
import { useGatheringInquiry } from "../../../../hooks/gathering/useGatheringInquiry";
import Pagination from "./Pagination";
export default function MyGatherInquiryList() {
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
    const getStatusDisplayText = (status) => {
    if (status === null) return "전체";
    if (status === true) return "답변완료";
    if (status === false) return "답변대기";
    return "전체";
  };
  const {
    error, loading, tabs, activeTab, currentData, currentCount,
    startDate, endDate, selectedStatus, pageInfo, pageNums,
    replyText, openId, setStartDate, setEndDate,
    handleTabChange, handleStatusChange, handlePageChange,
    toggleAccordion, handleReplyChange, handleReplySubmit, clearDates
  } = useGatheringInquiry({ token, user });

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
              <button onClick={loadInquiryData}>다시 시도</button>
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
        <aside><Sidebar /></aside>
        <section className="MyGatherInquiryList_inquiry-section_osk">
          <div className="MyGatherInquiryList_inquiry-header_osk">
            <h2>문의내역</h2>
            <div className="MyGatherInquiryList_date-filter_osk">
              <span>등록 기간</span>
              <div className="MyGatherInquiryList_date-picker-container_osk">
                <DatePicker
                  selected={startDate}
                  onChange={([start, end]) => {
                    if (start && end && end < start) end = start;
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  locale={ko}
                  dateFormat="yyyy.MM.dd"
                  placeholderText="전체"
                  maxDate={new Date()}
                  shouldCloseOnSelect={false}
                  className="MyGatherInquiryList_date-picker_osk"
                />
                {(startDate || endDate) && (
                  <button onClick={clearDates}>✕</button>
                )}
              </div>
              <span>상태</span>
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
                className={`MyGatherInquiryList_tab_osk ${activeTab === tab.value ? "MyGatherInquiryList_active_osk" : ""}`}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.display} ({tab.value === "registered" ? currentCount : currentCount})
              </button>
            ))}
          </div>
          {loading && <p>데이터를 불러오는 중...</p>}
      {currentData && (
          <div className="MyGatherInquiryList_inquiry-list_osk">
            {currentData.length === 0 ? (
              <div className="MyGatherInquiryList_empty-state_osk">
                <h4>조회된 문의가 없습니다</h4>
                <p>검색 조건을 변경하거나 새로운 문의를 등록해보세요.</p>
              </div>
            ) : (
              currentData.map((item) => (
                <div key={item.inquiryId} className="MyGatherInquiryList_inquiry-box_osk">
                  <div className="MyGatherInquiryList_accordion-header_osk" onClick={() => toggleAccordion(item.inquiryId)}>
                    <h3>{item.title}</h3>
                    <span>{item.responseState}</span>
                  </div>

                  {openId === item.inquiryId && (
                    <div className="MyGatherInquiryList_accordion-body_osk">
                      <p>Q. {item.inquiryContent}</p>
                      {item.responseContent ? (
                        <p><strong>A.</strong> {item.responseContent}</p>
                      ) : activeTab === "organized" ? (
                        <div className="MyGatherInquiryList_answer-form_osk">
                          <textarea
                            className="MyGatherInquiryList_answer-textarea_osk"
                            placeholder={`${item.nickName}님의 문의에 소중한 답변을 등록해 주세요`}
                            value={replyText[item.inquiryId] || ""}
                            onChange={(e) => handleReplyChange(item.inquiryId, e.target.value)}
                            disabled={loading}
                          />
                          <button 
                              className="MyGatherInquiryList_submit-btn_osk"
                              onClick={() => handleReplySubmit(item.inquiryId)} disabled={!replyText[item.inquiryId]?.trim()}>
                            등록
                          </button>
                        </div>
                      ) : (
                        <p>답변 대기 중입니다.</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
         <Pagination
            pageInfo={pageInfo}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}