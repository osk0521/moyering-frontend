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

    let statusParam = null;
    if (replyStatus === '답변대기') statusParam = 0;
    else if (replyStatus === '답변완료') statusParam = 1;

    const params = {
      hostId: user.hostId,
      calendarId:calendarParam ? Number(calendarParam) : undefined,
      searchFilter,
      searchQuery,
      startDate,
      endDate,
      replyStatus : statusParam, // 추가된 필드
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
          alert('답변이 등록되었습니다!');
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
  }, [replyStatus, searchQuery, startDate, endDate])

  return (
    <div className="KHJ-review-class-container">
      <div className="KHJ-review-class-search-area">
        <h3 className="KHJ-review-class-title">리뷰조회</h3>

        <div className="KHJ-review-class-form-row">
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className='KHJ-review-search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="KHJ-review-class-form-row">
          <input className="KHJ-review-date" type="date" value={startDate} onChange={handleStartDateChange} />
          <span className="KHJ-review-class-date-separator">~</span>
          <input className="KHJ-review-date" type="date" value={endDate} onChange={handleEndDateChange} />
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
          <button className="KHJ-review-class-reset-btn" onClick={handleReset}>초기화</button>
        </div>
      </div>

      <div className="KHJ-review-class-result-area">
        {reviews.length === 0 && (
          <div className="noneDiv">
            <div className="classNone">
              <div className="KHJ-no-data">조회된 목록이 없습니다.</div>
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
              <div style={{ float: 'left', padding: "0 2px 2px 2px", marginRight: "20px", color: "gray" }}>문의 <span style={{ color: "lightGray" }}>&nbsp;|</span></div>
              <div className="KHJ-review-content">
                <p>{review.content}</p>
              </div>
            </div>

            {/* 답변 폼 */}
            {expandedIndex === index && (
              <div className="KHJ-reply-dropdown">
                <div className="KHJ-inquiry-content-wrapper">
                  <div style={{ float: 'left', padding: "2px", marginRight: "20px", color: "gray" }}>답변 <span style={{ color: "lightGray" }}>&nbsp;|</span></div>
                  <form className="KHJ-review-reply-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <textarea
                      className="KHJ-review-textarea"
                      placeholder={review.revRegCotnent || "답변을 입력하세요"}
                      value={revRegContent}
                      onChange={handleReplyChange}
                    />
                    <button type="submit">{review.state === 0 ? '답변 등록' : '답변 수정'}</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassReview;
