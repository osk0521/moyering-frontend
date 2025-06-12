import React, { useState } from 'react';
import './ClassReview.css';

const ClassReview = () => {
  const [searchFilter, setSearchFilter] = useState('클래스명');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [replyOpenIndex, setReplyOpenIndex] = useState(null);
  const [replies, setReplies] = useState({});

  const reviews = [
    {
      id: 1,
      className: '클래스관련',
      reviewTitle: '클래스 뭔 내용?',
      userName: '김한채',
      date: '2025.05.05',
      status: '답변완료',
      content: '리뷰내용입니다. 수업이 정말 알차고 재미있었습니다!',
    },
    {
      id: 2,
      className: '강사관련',
      reviewTitle: '강사님 이력',
      userName: '홍길동',
      date: '2025.05.05',
      status: '답변중',
      content: '강사님 이력이 정말 대단하시네요!',
    },
  ];

  const handleSearch = () => {
    console.log('검색:', searchFilter, searchQuery);
    console.log('날짜:', startDate, endDate);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchFilter('클래스명');
    setStartDate('');
    setEndDate('');
  };

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const toggleReply = (index) => {
    setReplyOpenIndex(replyOpenIndex === index ? null : index);
  };

  const handleReplyChange = (e, index) => {
    setReplies({ ...replies, [index]: e.target.value });
  };

  const handleReplySubmit = (index) => {
    alert(`답변 저장됨: ${replies[index]}`);
    setReplies({ ...replies, [index]: '' });
    setReplyOpenIndex(null);
  };

  return (
  <div className="KHJ-review-class-container">
      <div className="KHJ-review-class-search-area">
        <h3 className="KHJ-review-class-title">리뷰조회</h3>

        <div className="KHJ-review-class-form-row">
          <label className="KHJ-review-class-label">검색어</label>
          <select value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}>
            <option value="클래스명">클래스명</option>
            <option value="강사명">강사명</option>
            <option value="사용자명">사용자명</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="KHJ-review-class-search-btn" onClick={handleSearch}>검색</button>
          <button className="KHJ-review-class-reset-btn" onClick={handleReset}>초기화</button>
        </div>

        <div className="KHJ-review-class-form-row">
          <label className="KHJ-review-class-label">날짜</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span className="KHJ-review-class-date-separator">~</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="KHJ-review-class-result-area">
        <h4 className="KHJ-review-class-subtitle">검색 결과 : {reviews.length}건</h4>
        <table className="KHJ-review-class-table">
          <thead>
            <tr>
              <th>No</th>
              <th>클래스명</th>
              <th>리뷰제목</th>
              <th>회원이름</th>
              <th>리뷰날짜</th>
              <th>리뷰댓글상태</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <React.Fragment key={review.id}>
                <tr className="KHJ-review-class-summary" onClick={() => toggleExpand(index)}>
                  <td>{index + 1}</td>
                  <td>{review.className}</td>
                  <td>{review.reviewTitle}</td>
                  <td>{review.userName}</td>
                  <td>{review.date}</td>
                  <td>{review.status}</td>
                </tr>
                <tr>
                  <td colSpan="6" className="KHJ-review-class-detail-cell">
                    <div className={`KHJ-review-class-detail ${expandedIndex === index ? 'open' : ''}`}>
                      <div className="KHJ-review-class-content">
                        <p>{review.content}</p>
                        <button className="KHJ-review-class-reply-btn" onClick={() => toggleReply(index)}>답변하기</button>
                      </div>
                      {replyOpenIndex === index && (
                        <form className="KHJ-review-class-reply-form" onSubmit={(e) => {
                          e.preventDefault();
                          handleReplySubmit(index);
                        }}>
                          <textarea
                            placeholder="답변을 입력하세요"
                            value={replies[index] || ''}
                            onChange={(e) => handleReplyChange(e, index)}
                          />
                          <button type="submit">답변 저장</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassReview;
