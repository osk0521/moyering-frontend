import React, { useEffect, useState } from 'react';
import './Inquiry.css';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { myAxios } from '../../config';
import { useLocation } from 'react-router';

const Inquiry = () => {
  const [searchFilter, setSearchFilter] = useState('클래스명');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [iqResContent, setIqResContent] = useState(''); // 답변 내용
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [inquiry, setInquiry] = useState([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [replyStatus, setReplyStatus] = useState('');
  const [pageInfo, setPageInfo] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const classIdParam = params.get("classId");
  const calendarIdParam = params.get("calendarId");

  useEffect(() => {
    const params = {
      hostId: user.hostId,
      classId: classIdParam ? Number(classIdParam) : undefined,
      calendarId: calendarIdParam ? Number(calendarIdParam) : undefined,
      page: 0,
      size: 10,
    };

    token && myAxios(token, setToken).post("/host/inquiry/search", params)
      .then(res => {
        setInquiry(res.data.content);
        setPageInfo(res.data.pageInfo);
      })
      .catch(err => console.error(err));
  }, [token]);

  const handleSearch = () => {
    const params = {
      hostId: user.hostId,
      searchFilter,
      searchQuery,
      startDate,
      endDate,
      replyStatus,
      page: 0,
      size: 10,
    };

    console.log("✅ 전송 데이터 확인:", JSON.stringify(params, null, 2));

    token && myAxios(token, setToken).post("/host/inquiry/search", params)
      .then(res => {
        setInquiry(res.data.content);
        setPageInfo(res.data.pageInfo);
      })
      .catch(err => console.error(err));
  };

  const toggleExpand = (index, inquiryId) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setSelectedInquiryId(inquiryId);
  };

  const handleReplyClick = (index, inquiryId) => {
    setSelectedInquiryId(inquiryId);
    setExpandedIndex(index);
    // Set iqResContent to the existing reply if available
    const existingReply = inquiry.find(item => item.inquiryId === inquiryId)?.iqResContent || '';
    setIqResContent(existingReply); // Pre-fill with the existing response if any
  };

  const handleReplySubmit = () => {
    if (!iqResContent.trim()) {
      alert("답변을 입력해주세요!");
      return;
    }

    token && myAxios(token, setToken).post("/host/inquiryReply", null, {
      params: {
        hostId: user.hostId,
        iqResContent: iqResContent,
        inquiryId: selectedInquiryId,
      }
    })
      .then(res => {
        console.log(res);
        alert("답변이 등록되었습니다!");
        setIqResContent('');
        setExpandedIndex(null);
        setSelectedInquiryId(null);

        return token && myAxios(token, setToken).get(`/host/inquiry?hostId=${user.hostId}`);
      })
      .then(res => {
        setInquiry(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchFilter('클래스명');
    setStartDate('');
    setEndDate('');
    setReplyStatus('');
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    if (endDate && newStart > endDate) {
      alert("시작 날짜는 종료 날짜보다 늦을 수 없습니다.");
      return;
    }
    setStartDate(newStart);
  };

  const handleEndDateChange = (e) => {
    const newEnd = e.target.value;
    if (startDate && newEnd < startDate) {
      alert("종료 날짜는 시작 날짜보다 빠를 수 없습니다.");
      return;
    }
    setEndDate(newEnd);
  };


  useEffect(() => {
    handleSearch();
  }, [replyStatus, searchQuery, startDate, endDate]);

  return (
    <>
      <div className="KHJ-inquiry-container">
        <h3>문의 관리</h3>

        <div className="KHJ-form-row">
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="KHJ-inquiry-input"
          />
        </div>

        <div className="KHJ-form-row">
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="KHJ-inquiry-input"
          />
          <span>~</span>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="KHJ-inquiry-input"
          />
        </div>

        <div className="KHJ-form-row">
          <div className="KHJ-radio-buttons">
            {['전체', '답변대기', '답변완료'].map(key => (
              <label key={key} className={`KHJ-radio-button ${replyStatus === key ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="replyStatus"
                  value={key}
                  checked={replyStatus === key}
                  onChange={() => setReplyStatus(key)}
                />
                <span>{key}</span>
              </label>
            ))}
          </div>
          <button className="KHJ-inquiry-btn reset" onClick={handleReset}>초기화</button>
        </div>
      </div>

      <div className="KHJ-inquiry-result-container">
        {inquiry.length === 0 && (
          <div className="noneDiv">
            <div className="classNone">
              <h4>조회된 목록이 없습니다</h4>
              <p>검색 조건을 변경하거나 새로운 질문을 남겨보세요.</p>
            </div>
          </div>
        )}

        {inquiry.map((item, index) => (
          <div key={item.inquiryId} className="KHJ-inquiry-card">
            <div className="KHJ-inquiry-summary" onClick={() => toggleExpand(index, item.inquiryId)}>
              <p><strong>{item.className}</strong> | 수강생: {item.studentName} | 클래스명: {item.className} | 문의일: {item.inquiryDate}</p>
              <span>{item.state === 1 ? '답변완료' : '답변대기'}</span>
            </div>

            {/* 문의 내용 */}
            <div className="KHJ-inquiry-content-wrapper">
              <div style={{ float: 'left', padding: "0 2px 2px 2px", marginRight: "20px", color: "gray" }}>문의 <span style={{ color: "lightGray" }}>&nbsp;|</span></div>
              <div className="KHJ-inquiry-content">
                <p>{item.content}</p>
              </div>
            </div>

            {/* 답변 폼 */}
            {expandedIndex === index && (
              <div className="KHJ-reply-dropdown">
                <div className="KHJ-inquiry-content-wrapper">
                  <div style={{ float: 'left', padding: "2px", marginRight: "20px", color: "gray" }}>답변 <span style={{ color: "lightGray" }}>&nbsp;|</span></div>
                  <form className="KHJ-reply-form" onSubmit={(e) => { e.preventDefault(); handleReplySubmit(); }} >
                    <textarea
                      className="KHJ-reply-textarea"
                      placeholder={item.iqResContent || "답변을 입력하세요"}
                      name="iqResContent"
                      value={iqResContent}
                      onChange={(e) => setIqResContent(e.target.value)}
                    />
                    <button type="submit">{item.state ? '수정' : '저장'}</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Inquiry;
