import { useState, useEffect } from 'react';
import './ClassSettlement.css'
import React from 'react'; // 이 한 줄만 추가!
import { tokenAtom, userAtom } from './../../atoms';
import { useAtom, useAtomValue } from 'jotai';
import { myAxios } from './../../config';

const ClassSettlement = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [token, setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);
  const [settlementList, setSettlementList] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);

  useEffect(() => {
    const params = {
      hostId: user.hostId,
      page: 0,
      size: 10,
    }
    token && myAxios(token, setToken).post("/host/settlementList", params)
      .then(res => {
        console.log(res);
        setSettlementList(res.data.content);
        setPageInfo(res.data.pageInfo);
      })
      .catch(err => {
        console.log(err);
      })
  }, [token])

  const handleDateFilterClick = (label) => {
    const today = new Date();
    let newStart = new Date(today);
    let newEnd = new Date(today);

    switch (label) {
      case '오늘':
        break;
      case '1개월':
        newStart.setMonth(today.getMonth() - 1);
        break;
      case '3개월':
        newStart.setMonth(today.getMonth() - 3);
        break;
      case '6개월':
        newStart.setMonth(today.getMonth() - 6);
        break;
      case '1년':
        newStart.setFullYear(today.getFullYear() - 1);
        break;
      case '전체':
        newStart = '';
        newEnd = '';
        break;
      default:
        break;
    }

    setStartDate(newStart ? newStart.toISOString().split('T')[0] : '');
    setEndDate(newEnd ? newEnd.toISOString().split('T')[0] : '');
    setDateFilter(label);
  };

  const totalAmount = settlementList
    .filter((s) => s.settlementStatus === 'CP')
    .reduce((acc, cur) => acc + cur.amount, 0);


  const handleSearch = () => {
    const params = {
      hostId: user.hostId,
      startDate,
      endDate,
      page: 0,
      size: 10,
    }

    console.log("전송데이터",JSON.stringify(params,null,2));
    token && myAxios(token, setToken).post("/host/settlementList", params)
    .then(res=>{
      setSettlementList(res.data.content);
      setPageInfo(res.data.pageInfo);
    })
    .catch(err=>{
      console.log(err);
    })
  };

  return (
    <div className="KHJ-class-settlement-container">
      <div className="KHJ-settlement-search">
        <h3>정산 계획 조회</h3>
        <div className="KHJ-search-row">
          <label>조회기간</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span>~</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <div className="KHJ-quick-buttons">
            {['오늘', '1개월', '3개월', '6개월', '1년', '전체'].map((label) => (
              <button
                key={label}
                className={dateFilter === label ? 'KHJ-active' : ''}
                onClick={() => handleDateFilterClick(label)}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="KHJ-search-btn" onClick={handleSearch}>검색</button>
        </div>
      </div>

      <div className="KHJ-settlement-result">
        <div className="KHJ-settlement-header">
          <h4>총 건수 : {settlementList.length}</h4>
          <span>총 정산된 금액 : {totalAmount.toLocaleString()}</span>
        </div>

        <table className="KHJ-settlement-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>정산 금액</th>
              <th>수수료</th>
              <th>등록일</th>
              <th>정산 상태</th>
              <th>정산 요청</th>
            </tr>
          </thead>
          <tbody>
            {settlementList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.settlementAmount}</td>
                <td>10%</td>
                <td>{item.settlementDate}</td>
                {item.settlementStatus === 'WT' ? <td>정산대기</td> :
                  item.settlementStatus === 'RQ' ? <td>정산요청완료</td> :
                    <td>정산완료</td>}
                <td>
                  {item.settlementStatus === 'WT' ? (
                    <button className="KHJ-settle-btn">정산 요청</button>
                  ) : (
                    <button className="KHJ-cancel-btn" disabled>정산 요청</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="KHJ-info-msg">
          강의 종료 후 7일째에 정산이 진행됩니다. <br />
          정산은 매일 05:00시에 진행되며,<br />
          <strong>수업 7일 후에도 정산이 완료되지 않았다면 정산요청 버튼을 눌러주세요!</strong>
        </div>
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
    </div>
  );
}

export default ClassSettlement;