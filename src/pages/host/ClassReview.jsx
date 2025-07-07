import React, { useEffect, useState } from 'react';
import './ClassReview.css';
import { myAxios } from './../../config';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { useLocation } from 'react-router';

const ClassReview = () => {
  const [searchFilter, setSearchFilter] = useState('클래스명');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [revRegContent, setRevRegContent] = useState(''); // 답변 내용 관리 상태
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null); // 선택된 리뷰 ID 상태
  const [replyStatus, setReplyStatus] = useState('');
  const [pageInfo, setPageInfo] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const calendarParam = params.get("calendarId");

  useEffect(() => {
    const params = {
      hostId: user.hostId,
      calendarId: calendarParam ? Number(calendarParam) : undefined,
      page: 0,
      size: 10,
    };

    token && myAxios(token, setToken).post('/host/review/search', params)
      .then((res) => {
        console.log(res.data);
        setReviews(res.data.content);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

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

    token && myAxios(token, setToken).post('/host/review/search', params)
      .then((res) => {
        console.log(res.data.content);
        setReviews(res.data.content);
        setPageInfo(res.data.pageInfo)
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

  const toggleExpand = (index, reviewId) => {
    setExpandedIndex(index === expandedIndex ? null : index);
    setSelectedReviewId(reviewId);

    // 리뷰가 펼쳐지면 답변 내용도 업데이트
    if (index !== expandedIndex) {
      const review = reviews.find((r) => r.reviewId === reviewId);
      if (review) {
        setRevRegContent(review.revRegContent || ''); // 답변 내용 업데이트
      }
    }
  };

  const handleReplyChange = (e) => {
    setRevRegContent(e.target.value); // 단일 문자열로 답변 내용 변경
  };

  const submit = () => {
    if (revRegContent && selectedReviewId) {
      token && myAxios(token, setToken).post('/host/reviewReply', null, {
        params: {
          hostId: user.hostId,
          revRegContent: revRegContent, // 답변 내용
          reviewId: selectedReviewId, // 리뷰 ID
        },
      })
        .then((res) => {
          console.log(res.data);
          alert('답변이 저장되었습니다!');
          setRevRegContent(''); // 답변 입력 필드 초기화
          setExpandedIndex(null); // 폼 닫기

          return token && myAxios(token, setToken).get("/host/review", {
            params: { hostId: user.hostId },
          });
        })
        .then((res) => {
          setReviews(res.data); // 리뷰 업데이트
          setExpandedIndex(null); // 테이블 유지
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
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className='KHJ-review-search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="KHJ-review-class-form-row">
          <label className="KHJ-review-class-label">날짜</label>
          <input className="KHJ-review-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span className="KHJ-review-class-date-separator">~</span>
          <input className="KHJ-review-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
          <button className="KHJ-review-class-reset-btn" onClick={handleReset}>초기화</button>
        </div>
      </div>

      <div className="KHJ-review-class-result-area">
        {reviews.length === 0 && (
          <div className="noneDiv">
            <div className="classNone">
              <h4>조회된 목록이 없습니다</h4>
              <p>검색 조건을 변경하거나 새로운 질문을 남겨보세요.</p>
            </div>
          </div>
        )}

        {reviews.map((review, index) => (
          <div key={review.reviewId} className="KHJ-review-card">
            <div className="KHJ-review-summary" onClick={() => toggleExpand(index, review.reviewId)}>
              <p><strong>{review.className}</strong> | 수강생: {review.studentName} | 클래스명: {review.className} | 리뷰날짜: {review.reviewDate}</p>
              <span>{review.state === 0 ? '답변대기' : '답변완료'}</span>
            </div>

            {/* 리뷰 내용 */}
            <div className="KHJ-review-content-wrapper">
              <div className="KHJ-review-content">
                <p>{review.content}</p>
              </div>
            </div>

            {/* 답변 폼 */}
            {expandedIndex === index && (
              <div className="KHJ-reply-dropdown">
                <form className="KHJ-review-reply-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                  <textarea
                    className="KHJ-review-textarea"
                    placeholder={review.revRegCotnent || "답변을 입력하세요"}
                    value={revRegContent}
                    onChange={handleReplyChange}
                  />
                  <button type="submit">{review.state === 0 ? '답변 저장' : '답변 수정'}</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassReview;
