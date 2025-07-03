// MainContent.jsx
import { useAtom } from 'jotai';
import { myAxios } from '../../config';
import './MainContent.css';
import React, { useEffect, useState } from 'react'; // 이 한 줄만 추가!
import { tokenAtom } from '../../atoms';

export default function MainContent() {
  const [token,setToken] = useAtom(tokenAtom)
  const [noticeList,setNoticeList] = useState([]);
  const [noticeDate,setNoticeDate] = useState([]);
  const stats = [
    { label: '전체 판매금액', value: '100,000,000' },
    { label: '이번달 판매금액', value: '250,000' },
    { label: '이번달 진행 클래스', value: '5' },
    { label: '전체 결제 건수', value: '20' },
    { label: '이번달 취소 건수', value: '1' },
    { label: '전체 후기수', value: '34' },
    { label: '평균 평점', value: '4.41' },
    { label: '문의 응답률', value: '91.12%' },
  ];

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
        <h2>공지사항</h2>
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
