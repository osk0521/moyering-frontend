// src/components/pages/PaymentManagement.jsx

import React, { useState } from 'react';
import Layout from "./Layout";
import './PaymentManagement.css';

const PaymentManagement = () => {
  // ===== 상태 관리 =====
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 전체, 결제완료, 취소됨 필터
  const [payStatus, setPayStatus] = useState('전체'); 

  // 결제일시 상태 
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

  // 결제 데이터 
  // eslint-disable-next-line no-unused-vars
  const [payments, setPayments] = useState([
    {
      id: 1,
      orderNumber: 'ORD-20230610-001',
      paymentId: 'user1',
        className: '김매닝의 클래스하기',
      paymentAmount: 150000,
      fee: -5000,
      feeRate: 15000,
      totalAmount: 115000,
      paymentMethod: '신용카드',
      status: '결제완료',
      paymentDate: '2023-05-10 14:23:45'
    },
    {
      id: 2,
      orderNumber: 'ORD-20230511-002',
      paymentId: 'user2',
      className: 'DIY 수업기 포함',
      paymentAmount: 180000,
      fee: -32000,
      feeRate: 18000,
      totalAmount: 166000,
      paymentMethod: '간편결제',
      status: '결제완료',
      paymentDate: '2023-05-11 10:15:22'
    },
    {
      id: 3,
      orderNumber: 'ORD-20230512-003',
      paymentId: 'user3',
      className: '영어 회화 클래스',
      paymentAmount: 200000,
      fee: -33300,
      feeRate: 20000,
      totalAmount: 186700,
      paymentMethod: '신용카드',
      status: '취소됨',
      paymentDate: '2023-05-12 16:45:12'
    },
  ]);

  // 함수들 
  // 금액 포맷팅 (천 단위 구분자)
  const formatAmount = (amount) => {
    return amount.toLocaleString('ko-KR');
  };

  // 상태별 CSS 클래스
  const getStatusClass = (status) => {
    const statusMap = {
      '결제완료': 'status-completed',
      '취소됨': 'status-canceled'
    };
    return statusMap[status] || '';
  };

  // ===== 이벤트 핸들러들 =====
    // 검색어 입력받아서 상태에 저장 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // 필터 유형 체크 (전체, 결제완료, 취소됨)
  const  handlePayStatusChange = (status) => {
    setPayStatus(status); 
  }


  // 엑셀 다운로드
  const handleExcelDownload = () => {
    alert('엑셀 파일을 다운로드합니다.');
    // 실제 구현에서는 엑셀 다운로드 로직 추가
  };

  // 필터링된 결제 목록
  const filteredPayments = payments.filter(payment => {
    // 검색어 필터링
    const matchesSearch = 
      payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase());

     // 결제 상태 필터 (전체, 결제완료, 취소됨)
    const matchesStatus = payStatus === '전체' || payment.status === payStatus;



    const payDay = new Date(payment.paymentDate); // 가입일 
    const start = startDate ? new Date(startDate) : null; // 시작일 (없으면 NULL)
    const end = endDate ? new Date(endDate) : null; // 종료일 (없으면 NULL)
        const matchesDate =
      (!start || payDay >= start) &&  // 시작일 없거나, 가입일이 시작일 이후
      (!end || payDay <= end);  // 종료일 없거나, 가입일이 종료일 이전

    return matchesSearch && matchesStatus && matchesDate;
  });

  // ===== 렌더링 =====
  return (
    <Layout>
        {/* 페이지 제목 */}
        <div className="page-titleHY">
          <h1>결제 관리</h1>
        </div>


      {/* 검색 및 필터 영역 */}
          <div className="search-sectionHY">
            {/* 검색 박스 */}
            <div className="search-boxHY">
              <span className="search-iconHY">🔍</span>
              <input
                type="text"
                placeholder="주문번호, 주문명, 결제아이디 검색"
                value={searchTerm}
                onChange={handleSearch}
                className="search-inputHY"
              />
            </div>

        {/* 결제 기간 필터 */}
        <div className="date-filter-group">
            <label className="date-labelHY">결제 기간</label>
            <input
              type="date"
              className="date-inputHY"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="date-separatorHY">~</span>
            <input
              type="date"
              className="date-inputHY"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

        {/* 상태 필터 */}
        <div className="filter-sectionHY">
          {['전체', '결제완료', '취소됨'].map(status => (
            <button
            key={status}
              className={`filter-btnHY ${payStatus === status ? 'active' : ''}`}
              onClick={() => handlePayStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      
        {/* 오른쪽 엑셀 다운로드 버튼 */}
        <div className="right-alignHY">
  <button className="btn-excel-downloadHY" onClick={handleExcelDownload}>
    엑셀 다운로드
  </button>
        </div>
      </div>

  <span className="result-countHY">
          총 <strong>{filteredPayments.length}</strong>건
        </span><br />
          
        {/* 결제 테이블 */}
        <div className="table-wrapperHY">
          <table className="tableHY">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>결제 ID</th>
                <th>클래스명</th>
                <th>결제금액</th>
                <th>쿠폰할인금액</th>
                <th>수수료</th>
                <th>총 결제금액</th>
                <th>결제수단</th>
                <th>상태</th>
                <th>결제일시</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id}>
                  <td className="order-numberHY">{payment.orderNumber}</td>
                  <td>{payment.paymentId}</td>
                  <td className="className-nameHY">{payment.className}</td>
                  <td className="amountHY">{formatAmount(payment.paymentAmount)}</td>
                  <td className="feeHY">{formatAmount(payment.fee)}</td>
                  <td className="amountHY">{formatAmount(payment.feeRate)}</td>
                  <td className="total-amountHY">{formatAmount(payment.totalAmount)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="payment-dateHY">{payment.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
    </Layout>
  );
};


export default PaymentManagement;