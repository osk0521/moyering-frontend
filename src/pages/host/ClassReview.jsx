import React, { useEffect, useState } from 'react';
import './ClassReview.css';
import { myAxios } from './../../config';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';

const ClassReview = () => {
  const [searchFilter, setSearchFilter] = useState('클래스명');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [replyOpenIndex, setReplyOpenIndex] = useState(null);
  const [revRegContent, setRevRegContent] = useState(''); // 답변 내용 관리 상태
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null); // 선택된 리뷰 ID 상태
  const [replyStatus, setReplyStatus] = useState('');

  useEffect(() => {
    if (token) {
      myAxios(token, setToken)
        .get('/host/review', {
          params: {
            hostId: user.hostId,
          },
        })
        .then((res) => {
          console.log(res.data);
          setReviews(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, user.hostId]);

  const handleSearch = () => {
    const params = {
      hostId: user.hostId,
      searchFilter,
      searchQuery,
      startDate,
      endDate,
      replyStatus, // 추가된 필드
      page: 0,
      size: 10,
    };

    console.log("✅ 전송 데이터 확인:", JSON.stringify(params, null, 2));

    token &&
      myAxios(token, setToken)
        .post('/host/review/search', params)
        .then((res) => {
          console.log(res.data.content);
          setReviews(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
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

  // 답변하기 버튼 클릭 시, 선택된 리뷰 ID를 상태에 저장
  const toggleReply = (index, reviewId) => {
    setReplyOpenIndex(replyOpenIndex === index ? null : index);
    setSelectedReviewId(reviewId); // reviewId 저장
  };

  const handleReplyChange = (e) => {
    setRevRegContent(e.target.value); // 단일 문자열로 답변 내용 변경
  };

  const handleReplySubmit = (index) => {
    alert(`답변 저장됨: ${revRegContent}`);
    setRevRegContent(''); // 답변 제출 후, 상태 초기화
    setReplyOpenIndex(null);
  };

  // 제출 시 선택된 리뷰 ID를 함께 보내기
  const submit = () => {
    if (revRegContent && selectedReviewId) {
      token && myAxios(token, setToken).post('/host/reviewReply', null, {
        params: {
          hostId: user.hostId,
          revRegContent: revRegContent, // 답변 내용을 서버에 전송
          reviewId: selectedReviewId, // 선택된 리뷰 ID 전송
        },
      })
        .then((res) => {
          console.log(res.data);
          alert('답변이 저장되었습니다!');
          setRevRegContent(''); // 답변 입력 필드 초기화
          setReplyOpenIndex(null); // 폼 닫기
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert('답변 내용과 리뷰 ID를 확인해 주세요.');
    }
  };

  return (
    <div className="KHJ-review-class-container">
      <div className="KHJ-review-class-search-area">
        <h3 className="KHJ-review-class-title">리뷰조회</h3>

        <div className="KHJ-review-class-form-row">
          <label className="KHJ-review-class-label">검색어</label>
          <select value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}>
            <option value="클래스명">클래스명</option>
            <option value="학생명">학생명</option>
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
        <div className="KHJ-form-row">
          <label>답변 상태</label>
          <label>
            <input
              type="radio"
              name="status"
              value=""
              checked={replyStatus === ''}
              onChange={() => setReplyStatus('')}
            />
            전체
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="답변대기"
              checked={replyStatus === '답변대기'}
              onChange={() => setReplyStatus('답변대기')}
            />
            답변대기
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="답변완료"
              checked={replyStatus === '답변완료'}
              onChange={() => setReplyStatus('답변완료')}
            />
            답변완료
          </label>
        </div>
      </div>

      <div className="KHJ-review-class-result-area">
        <h4 className="KHJ-review-class-subtitle">검색 결과 : {reviews.length}건</h4>
        <table className="KHJ-review-class-table">
          <thead>
            <tr>
              <th>No</th>
              <th>클래스명</th>
              <th>회원이름</th>
              <th>리뷰날짜</th>
              <th>리뷰댓글상태</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <React.Fragment key={review.reviewId}>
                <tr className="KHJ-review-class-summary" onClick={() => toggleExpand(index)}>
                  <td>{index + 1}</td>
                  <td>{review.className}</td>
                  <td>{review.studentName}</td>
                  <td>{review.reviewDate}</td>
                  {review.state === 0 ? <td>답변대기</td> : <td>답변완료</td>}
                </tr>
                <tr>
                  <td colSpan="6" className="KHJ-review-class-detail-cell">
                    <div className={`KHJ-review-class-detail ${expandedIndex === index ? 'open' : ''}`}>
                      <div className="KHJ-review-class-content">
                        <p>{review.content}</p>
                        <button className="KHJ-review-class-reply-btn" onClick={() => toggleReply(index, review.reviewId)}>답변하기</button>
                      </div>
                      {replyOpenIndex === index && (
                        <form className="KHJ-review-class-reply-form" onSubmit={(e) => {
                          e.preventDefault();
                          submit(); // reviewId를 사용하여 답변을 제출
                        }}>
                          <textarea
                            placeholder="답변을 입력하세요"
                            value={revRegContent}
                            onChange={handleReplyChange} // 단일 문자열로 관리
                          />
                          {review.state === 0 ? (
                            <button type="submit">답변 저장</button> // "답변대기" 상태에서 저장 버튼
                          ) : (
                            <button type="submit">답변 수정</button> // "답변완료" 상태에서 수정 버튼
                          )}
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
