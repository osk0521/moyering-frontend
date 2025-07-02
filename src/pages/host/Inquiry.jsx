import React, { useEffect, useState } from 'react';
import './Inquiry.css';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { myAxios } from '../../config';

const Inquiry = () => {
  const [searchFilter, setSearchFilter] = useState('클래스명');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showReplyFormIndex, setShowReplyFormIndex] = useState(null);
  const [iqResContent, setIqResContent] = useState('');
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [inquiry, setInquiry] = useState([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [replyStatus, setReplyStatus] = useState('');
  const [pageInfo,setPageInfo] = useState([]);

  useEffect(() => {
    token && myAxios(token, setToken).get(`/host/inquiry?hostId=${user.hostId}`)
      .then(res => {
        console.log(res.data);
        setInquiry(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [token])


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

    token && myAxios(token, setToken).post("/host/inquiry/search", params)
      .then(res => {
        console.log("검색")
        console.log(res.data.content);
        setInquiry(res.data.content);
        setPageInfo(res.data.pageInfo);
      })
      .catch(err => console.error(err));
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setShowReplyFormIndex(null);
  };

  const handleReplyClick = (index, inquiryId) => {
    setShowReplyFormIndex(index);
    setSelectedInquiryId(inquiryId);
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

  const submit = () => {
    token && myAxios(token, setToken).post("/host/inquiryReply", null, {
      params: {
        hostId: user.hostId,
        iqResContent: iqResContent,
        inquiryId: selectedInquiryId
      }
    })
      .then(res => {
        console.log(res);
        alert("답변이 등록되었습니다!")
        setIqResContent('');
        setShowReplyFormIndex(null);
        setExpandedIndex('');

        return token && myAxios(token, setToken).get(`/host/inquiry?hostId=${user.hostId}`)
      })
      .then(res => {
        setInquiry(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

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
            <option value="학생명">사용자명</option>
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

      <div className="KHJ-inquiry-result-container">
        <h4 className="KHJ-inquiry-result">검색 결과 : {inquiry.length}건</h4>
        <table className="KHJ-inquiry-table">
          <thead>
            <tr>
              <th>No</th>
              <th>클래스명</th>
              <th>회원이름</th>
              <th>문의일자</th>
              <th>답변 상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiry.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr onClick={() => toggleExpand(index)} className="KHJ-inquiry-summary-row">
                  <td>{item.inquiryId}</td>
                  <td>{item.className}</td>
                  <td>{item.studentName}</td>
                  <td>{item.inquiryDate}</td>
                  {item.state ? <td>답변완료</td> : <td>답변대기</td>}
                </tr>
                {expandedIndex === index && (
                  <tr className="KHJ-inquiry-detail-row">
                    <td colSpan="6" className="KHJ-inquiry-td">
                      <div className={`KHJ-inquiry-dropdown-wrapper ${expandedIndex === index ? 'open' : ''}`}>
                        <div className="KHJ-inquiry-content-box">
                          <p className="KHJ-inquiry-content">{item.content}</p>
                          <button className="KHJ-reply-button" onClick={() => handleReplyClick(index, item.inquiryId)}>답변하기</button>
                        </div>
                        <div className={`KHJ-reply-dropdown ${showReplyFormIndex === index ? 'open' : ''}`}>
                          <form
                            className="KHJ-reply-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleReplySubmit(index);
                            }}
                          >
                            {item.iqResContent ? <textarea
                              className='KHJ-reply-textarea'
                              placeholder={item.iqResContent}
                              name='iqResContent'
                              value={iqResContent}
                              onChange={(e) => setIqResContent(() => e.target.value)}
                            /> :
                              <textarea
                                className='KHJ-reply-textarea'
                                placeholder="답변을 입력하세요"
                                name='iqResContent'
                                value={iqResContent}
                                onChange={(e) => setIqResContent(() => e.target.value)}
                              />
                            }
                            {/* <textarea 
                            className='KHJ-reply-textarea'
                              placeholder="답변을 입력하세요"
                              name='iqResContent'
                              value={iqResContent}
                              onChange={(e) => setIqResContent(()=>e.target.value)}
                            /> */}
                            {item.state ? <button type="button" onClick={submit}>답변수정</button> : <button type="button" onClick={submit}>답변저장</button>}

                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {pageInfo.allPage > 1 && (
          <div className="KHJ-pagination">
            {(() => {
              const totalPage = pageInfo.allPage;
              const currentPage = pageInfo.curPage;
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
                  <button key="prev" onClick={() => fetchClassList(currentPage - 1)} className="KHJ-page-button">
                    ◀ 이전
                  </button>
                );
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => fetchClassList(i)}
                    className={`KHJ-page-button ${i === currentPage ? 'active' : ''}`}
                  >
                    {i}
                  </button>
                );
              }

              if (currentPage < totalPage) {
                pages.push(
                  <button key="next" onClick={() => fetchClassList(currentPage + 1)} className="KHJ-page-button">
                    다음 ▶
                  </button>
                );
              }
              return pages;
            })()}
          </div>
        )}
      </div>
    </>
  );
};

export default Inquiry;
