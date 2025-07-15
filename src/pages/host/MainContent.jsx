// MainContent.jsx
import { useAtom, useAtomValue } from 'jotai';
import { myAxios } from '../../config';
import './MainContent.css';
import React, { useEffect, useState } from 'react'; // 이 한 줄만 추가!
import { tokenAtom, userAtom } from '../../atoms';

export default function MainContent() {
  const [token,setToken] = useAtom(tokenAtom)
  const [noticeList,setNoticeList] = useState([]);
  const [noticeDate,setNoticeDate] = useState([]);
  const user = useAtomValue(userAtom);
  const [inquiryRate,setInquiryRate] = useState('');
  const [reviewRate,setReviewRate] = useState('');
  const [starRate,setStarRate] = useState('');
  const [calendarCount,setCalendarCount] = useState('');
  const [cancleCount,setCancleCount] = useState('');
  const [settleCount,setSettleCount] = useState('');
  const [payCount,setPayCount] = useState('');
  const [thisMonthSettle,setThisMonthSettle] = useState('');

  useEffect(()=>{
    token&&myAxios(token,setToken).get("/host/hostRateCount",{
      params:{
        hostId:user.hostId,
      }
    })
    .then(res=>{
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
    .catch(err=>{
      console.log(err)
    })
  },[token])
  
  const stats = [
    { label: '전체 판매금액', value: settleCount+'원'},
    { label: '이번달 판매금액', value: thisMonthSettle+'원' },
    { label: '이번달 진행한 클래스', value: calendarCount+"건" },
    { label: '전체 결제 건수', value: payCount+'건' },
    { label: '이번달 취소 건수', value: cancleCount+'건' },
    { label: '전체 후기수', value: reviewRate },
    { label: '평균 평점', value: starRate+'점' },
    { label: '문의 응답률', value: inquiryRate+"%" },
  ];

  const randomNumber = (start,end)=>Math.floor(Math.random()*(end-start+1))+start;

  useEffect(()=>{
    token && myAxios(token,setToken).get("/host/notice")
    .then(res=>{
      console.log(res);
      setNoticeList(res.data);
    })
    .catch(err=>{
      console.log(err)
    })
  },[token])

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
        {noticeList.map((item, i) => (
          <div className="KHJ-main__notice" key={i}>
            <span className="KHJ-main__badge">공지</span>
            <span className="KHJ-main__text">{item.title}</span>
            <span className="KHJ-main__date">{new Date(item.lastModifiedDate).toLocaleDateString("en-CA")}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
