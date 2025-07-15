// MainContent.jsx
import { useAtom, useAtomValue } from 'jotai';
import { myAxios } from '../../config';
import './MainContent.css';
import React, { useEffect, useState } from 'react'; // 이 한 줄만 추가!
import { tokenAtom, userAtom } from '../../atoms';
import { Link } from 'react-router';

export default function MainContent() {
  const [token, setToken] = useAtom(tokenAtom)
  const [noticeList, setNoticeList] = useState([]);
  const [noticeDate, setNoticeDate] = useState([]);
  const user = useAtomValue(userAtom);
  const [inquiryRate, setInquiryRate] = useState('');
  const [reviewRate, setReviewRate] = useState('');
  const [starRate, setStarRate] = useState('');
  const [calendarCount, setCalendarCount] = useState('');
  const [cancleCount, setCancleCount] = useState('');
  const [settleCount, setSettleCount] = useState('');
  const [payCount, setPayCount] = useState('');
  const [thisMonthSettle, setThisMonthSettle] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 보여줄 공지 수

  const sortedNotices = [...noticeList]
    .sort((a, b) => new Date(b.lastModifiedDate || b.createdAt) - new Date(a.lastModifiedDate || a.createdAt));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = sortedNotices.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(noticeList.length / itemsPerPage);

  useEffect(() => {
    token && myAxios(token, setToken).get("/host/hostRateCount", {
      params: {
        hostId: user.hostId,
      }
    })
      .then(res => {
        console.log("hi")
        console.log(res);
        setInquiryRate(res.data.inquiryRate);
        setReviewRate(res.data.reviewRate);
        setStarRate(res.data.starRate);
        setCalendarCount(res.data.calendarCount);
        setCancleCount(res.data.cancleCount);
        setSettleCount(res.data.settleCount);
        setPayCount(res.data.payCount);
        setThisMonthSettle(res.data.thisMonthSettle);
      })
      .catch(err => {
        console.log(err)
      })
  }, [token])

  const stats = [
    { label: '전체 판매금액', value: settleCount + '원' },
    { label: '이번달 판매금액', value: thisMonthSettle + '원' },
    { label: '이번달 진행한 클래스', value: calendarCount + "건" },
    { label: '전체 결제 건수', value: payCount + '건' },
    { label: '이번달 취소 건수', value: cancleCount + '건' },
    { label: '전체 후기수', value: reviewRate },
    { label: '평균 평점', value: starRate + '점' },
    { label: '문의 응답률', value: inquiryRate + "%" },
  ];

  const randomNumber = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start;

  useEffect(() => {
    token && myAxios(token, setToken).get("/host/notice")
      .then(res => {
        console.log(res);
        setNoticeList(res.data);
      })
      .catch(err => {
        console.log(err)
      })
  }, [token])

  return (
    <main className="KHJ-main">
      <section className="KHJ-main__dashboard">
        <table className="KHJ-main__table">
          <tbody>
            {[0, 1].map((row) => (
              <tr key={row}>
                {stats.slice(row * 4, row * 4 + 4).map((item, i) => (
                  <td key={i} className="KHJ-main__cell">

                    <div className="KHJ-main__label">{item.label}</div>
                    <div className="KHJ-main__value">{item.value}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="KHJ-main__notice-board">
        <h3 className="KHJ-main-title">공지사항</h3>
        {currentNotices.map((item, i) => (
          <Link
            to={`/notice/${item.noticeId}`}
            key={i}
            className="KHJ-main__notice-link-wrapper"
          >
            <div className="KHJ-main__notice">
              <span className="KHJ-main__badge">공지</span>
              <span className="KHJ-main__text">{item.title}</span>
              <span className="KHJ-main__content">{item.content}</span>
              <span className="KHJ-main__date">
                {new Date(item.lastModifiedDate || item.createdAt).toLocaleDateString("en-CA")}
              </span>
            </div>
          </Link>
        ))}
        <div className="KHJ-pagination">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`KHJ-page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </section>
    </main >
  );
}
