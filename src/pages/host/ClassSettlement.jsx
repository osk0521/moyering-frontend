import { useState } from 'react';
import './ClassSettlement.css'
import React from 'react'; // 이 한 줄만 추가!

const ClassSettlement = () => {
     const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [settlements, setSettlements] = useState([
    {
      id: 1,
      teacher: '홍길동',
      content: '수강신청',
      amount: 15000,
      feeRate: 0.1,
      date: '2025.05.05',
      status: '정산완료',
    },
    {
      id: 2,
      teacher: '황보길동',
      content: '수강신청',
      amount: 15000,
      feeRate: 0.1,
      date: '2025.05.05',
      status: '미정산',
    },
  ]);

  const handleSearch = () => {
    console.log('검색 실행', startDate, endDate);
  };

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

  const totalAmount = settlements
    .filter((s) => s.status === '정산완료')
    .reduce((acc, cur) => acc + cur.amount, 0);

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
          <h4>총 건수 : {settlements.length}</h4>
          <span>총 정산된 금액 : {totalAmount.toLocaleString()}</span>
        </div>

        <table className="KHJ-settlement-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>수강생</th>
              <th>정산 내용</th>
              <th>정산 금액</th>
              <th>수수료</th>
              <th>등록일</th>
              <th>정산 상태</th>
              <th>정산 요청</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.teacher}</td>
                <td>{item.content}</td>
                <td>{item.amount.toLocaleString()}</td>
                <td>{(item.feeRate * 100).toFixed(0)}%</td>
                <td>{item.date}</td>
                <td>{item.status}</td>
                <td>
                  {item.status === '미정산' ? (
                    <button className="KHJ-settle-btn">정산 요청</button>
                  ) : (
                    <button className="KHJ-cancel-btn" disabled>정산 완료</button>
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
      </div>
    </div>
  );
}

export default ClassSettlement;