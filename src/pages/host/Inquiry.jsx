import React, { useState } from 'react';
import './Inquiry.css';

const Inquiry = () => {
  const [searchFilter, setSearchFilter] = useState('클래스명');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showReplyFormIndex, setShowReplyFormIndex] = useState(null);
  const [replies, setReplies] = useState({});

  const inquiries = [
    {
      id: 1,
      className: '클래스명1',
      questionTitle: '클래스 뭘 내용?',
      userName: '김한채',
      date: '2025.05.05',
      status: '답변완료',
      questionContent: '이 클래스는 주 2회 진행되며 실습이 포함됩니다.',
    },
    {
      id: 2,
      className: '클래스명2',
      questionTitle: '강사님 이력',
      userName: '홍길동',
      date: '2025.05.06',
      status: '답변중',
      questionContent: '강사님은 10년 이상의 경력을 가지고 계십니다.',
    },
  ];

  const handleSearch = () => {
    console.log('검색:', searchFilter, searchQuery);
    console.log('날짜:', startDate, endDate);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setShowReplyFormIndex(null);
  };

  const handleReplyClick = (index) => {
    setShowReplyFormIndex(index);
  };

  const handleReplyChange = (e, index) => {
    setReplies({ ...replies, [index]: e.target.value });
  };

  const handleReplySubmit = (index) => {
    alert(`답변 저장: ${replies[index]}`);
    setReplies({ ...replies, [index]: '' });
    setShowReplyFormIndex(null);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchFilter('클래스명');
    setStartDate('');
    setEndDate('');
  };

  return (
    <>
      <div className="KHJ-inquiry-container">
        <h3>문의 관리</h3>

        <div className="KHJ-form-row">
          <label>검색어</label>
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="KHJ-inquiry-select"
          >
            <option value="클래스명">클래스명</option>
            <option value="강사명">강사명</option>
            <option value="사용자명">사용자명</option>
          </select>

          <input
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="KHJ-inquiry-input"
          />

          <button className="KHJ-inquiry-btn search" onClick={handleSearch}>검색</button>
          <button className="KHJ-inquiry-btn reset" onClick={handleReset}>초기화</button>
        </div>

        <div className="KHJ-form-row">
          <label>날짜</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="KHJ-inquiry-input"
          />
          <span>~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="KHJ-inquiry-input"
          />
        </div>
      </div>

      <div className="KHJ-inquiry-result-container">
        <h4>검색 결과 : {inquiries.length}건</h4>
        <table className="KHJ-inquiry-table">
          <thead>
            <tr>
              <th>No</th>
              <th>클래스명</th>
              <th>문의명</th>
              <th>회원이름</th>
              <th>문의일자</th>
              <th>답변 상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr onClick={() => toggleExpand(index)} className="KHJ-inquiry-summary-row">
                  <td>{index + 1}</td>
                  <td>{item.className}</td>
                  <td>{item.questionTitle}</td>
                  <td>{item.userName}</td>
                  <td>{item.date}</td>
                  <td>{item.status}</td>
                </tr>
                <tr className="KHJ-inquiry-detail-row">
                  <td colSpan="6">
                    <div className={`KHJ-inquiry-dropdown ${expandedIndex === index ? 'open' : ''}`}>
                      <div className="KHJ-inquiry-content-box">
                        <p className="KHJ-inquiry-content">{item.questionContent}</p>
                        <button className="KHJ-reply-button" onClick={() => handleReplyClick(index)}>답변하기</button>
                      </div>
                      <div className={`KHJ-reply-dropdown ${showReplyFormIndex === index ? 'open' : ''}`}>
                        <form className="KHJ-reply-form" onSubmit={(e) => { e.preventDefault(); handleReplySubmit(index); }}>
                          <textarea
                            placeholder="답변을 입력하세요"
                            value={replies[index] || ''}
                            onChange={(e) => handleReplyChange(e, index)}
                          />
                          <button type="submit">답변 저장</button>
                        </form>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Inquiry;
