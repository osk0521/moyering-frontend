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
  const [iqResContent, setIqResContent] = useState('');
  const [inquiry, setInquiry] = useState([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [replyStatus, setReplyStatus] = useState('');
  const [pageInfo, setPageInfo] = useState({ totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(0);

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const location = useLocation();

  const getQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    const classId = queryParams.get('classId');
    const calendarId = queryParams.get('calendarId');
    return { classId, calendarId };
  };

  const fetchInquiries = (classId, calendarId, page = 0) => {
    const params = {
      hostId: user.hostId,
      searchFilter,
      searchQuery,
      startDate,
      endDate,
      replyStatus: replyStatus === '답변완료' ? 1 : (replyStatus === '답변대기' ? 0 : ''),
      classId: classId ? Number(classId) : undefined,
      calendarId: calendarId ? Number(calendarId) : undefined,
      page,
      size: 5,
    };

    token && myAxios(token, setToken).post('/host/inquiry/search', params)
      .then(res => {
        console.log(res.data);
        setInquiry(res.data.content);
        setPageInfo(res.data.pageInfo);
        setCurrentPage(page);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const { classId, calendarId } = getQueryParams();
    fetchInquiries(classId, calendarId, currentPage);
  }, [searchQuery, startDate, endDate, replyStatus, location, token, currentPage]);

  const goToPage = (page) => {
    if (page >= 0 && page < pageInfo.allPage) {
      const { classId, calendarId } = getQueryParams();
      fetchInquiries(classId, calendarId, page);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchFilter('클래스명');
    setStartDate('');
    setEndDate('');
    setReplyStatus('');
    setCurrentPage(0);
    const { classId, calendarId } = getQueryParams();
    fetchInquiries(classId, calendarId, 0);
  };

  const toggleExpand = (index, inquiryId) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setSelectedInquiryId(inquiryId);
  };

  const handleReplyClick = (index, inquiryId) => {
    setSelectedInquiryId(inquiryId);
    setExpandedIndex(index);
    const existingReply = inquiry.find(item => item.inquiryId === inquiryId)?.iqResContent || '';
    setIqResContent(existingReply);
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
      .then(() => {
        alert("답변이 등록되었습니다!");
        setIqResContent('');
        setExpandedIndex(null);
        setSelectedInquiryId(null);

        const { classId, calendarId } = getQueryParams();
        fetchInquiries(classId, calendarId, currentPage);
      })
      .catch(err => console.error(err));
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
          <input type="date" value={startDate} onChange={handleStartDateChange} className="KHJ-inquiry-input" />
          <span>~</span>
          <input type="date" value={endDate} onChange={handleEndDateChange} className="KHJ-inquiry-input" />
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
              <div className="KHJ-no-data">조회된 목록이 없습니다.</div>
            </div>
          </div>
        )}
        {inquiry.map((item, index) => (
          <div key={item.inquiryId} className="KHJ-inquiry-card">
            <div className="KHJ-inquiry-summary" onClick={() => toggleExpand(index, item.inquiryId)}>
              <p><strong>{item.className}</strong> | 문의자: {item.studentName} | 클래스명: {item.className} | 문의일: {item.inquiryDate}</p>
              <span>{item.state === 1 ? '답변완료' : '답변대기'}</span>
            </div>

            <div className="KHJ-inquiry-content-wrapper">
              <div style={{ float: 'left', padding: "0 2px 2px 2px", marginRight: "20px", color: "gray" }}>문의 <span style={{ color: "lightGray" }}>&nbsp;|</span></div>
              <div className="KHJ-inquiry-content">
                <p>{item.content}</p>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="KHJ-reply-dropdown">
                <div className="KHJ-inquiry-content-wrapper">
                  <div style={{ float: 'left', padding: "2px", marginRight: "20px", color: "gray" }}>답변 <span style={{ color: "lightGray" }}>&nbsp;|</span></div>
                  <form className="KHJ-reply-form" onSubmit={(e) => { e.preventDefault(); handleReplySubmit(); }}>
                    <textarea
                      className="KHJ-reply-textarea"
                      placeholder={item.iqResContent || "답변을 입력하세요"}
                      name="iqResContent"
                      value={iqResContent}
                      onChange={(e) => setIqResContent(e.target.value)}
                    />
                    <button type="submit">{item.state ? '수정' : '등록'}</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="KHJ-pagination">
          {pageInfo.allPage > 1 && (
            <div className="KHJ-pagination">
              {(() => {
                const totalPage = pageInfo.allPage;
                const currentPage = pageInfo.curPage; // 1부터 시작
                const maxButtons = 5;

                let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                let end = start + maxButtons - 1;

                if (end > totalPage) {
                  end = totalPage;
                  start = Math.max(1, end - maxButtons + 1);
                }

                const pages = [];

                if (currentPage > 1) {
                  pages.push(
                    <button key="prev" onClick={() => goToPage(currentPage - 2)} className="KHJ-page-button">
                      ◀ 이전
                    </button>
                  );
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => goToPage(i - 1)} // 0부터 시작하니까 -1
                      className={`KHJ-page-button ${i === currentPage ? 'active' : ''}`}
                    >
                      {i}
                    </button>
                  );
                }

                if (currentPage < totalPage) {
                  pages.push(
                    <button key="next" onClick={() => goToPage(currentPage)} className="KHJ-page-button">
                      다음 ▶
                    </button>
                  );
                }

                return pages;
              })()}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Inquiry;
