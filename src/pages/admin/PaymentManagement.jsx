// src/components/pages/PaymentManagement.jsx

import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import './PaymentManagement.css';
import { myAxios } from '../../config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { useLocation } from 'react-router-dom';

const PaymentManagement = () => {
  const token = useAtomValue(tokenAtom);
  const location = useLocation();
  const userInfo = location.state; // MemberManagement에서 전달받은 사용자 정보
  
  // 상태 관리
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 사용자 정보가 있으면 검색어를 자동으로 설정
  useEffect(() => {
    if (userInfo && userInfo.username) {
      setSearchTerm(userInfo.username);
    }
  }, [userInfo]);

  // 데이터 로딩
  useEffect(() => {
    const fetchPayments = async () => {
      // AdminPaymentSearchCond에 맞게 파라미터 구성
      const params = {
        page: currentPage,
        size: 20,
        keyword: searchTerm || undefined,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      // 특정 사용자의 결제 내역을 조회하는 경우 userId 추가
      if (userInfo && userInfo.userId) {
        params.userId = userInfo.userId;
      }

      try {
        const response = await myAxios(token).get('/api/payment', { params });
        const data = response.data;
        setPayments(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error("결제 목록 조회 실패:", error);
        setPayments([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    };

    fetchPayments();
  }, [token, searchTerm, statusFilter, startDate, endDate, currentPage, userInfo]);

  const formatAmount = (amount) => {
    return amount != null ? amount.toLocaleString('ko-KR') : '0';
  };

  const getStatusClass = (status) => {
    const statusMap = {
      '결제완료': 'status-completed',
      '취소됨': 'status-canceled'
    };
    return statusMap[status] || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (status) => setStatusFilter(status === '전체' ? '' : status);

  const handleExcelDownload = () => alert('엑셀 파일을 다운로드합니다.');
  
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Layout>
      <div className="page-titleHY">
        <h1>
          {userInfo ? `${userInfo.username}님의 결제 내역` : '결제 관리'}
        </h1>
        {userInfo && (
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            회원 구분: {userInfo.userType}
          </div>
        )}
      </div>
      
      <div className="search-sectionHY">
        <div className="search-boxHY">
          <span className="search-iconHY">🔍</span>
          <input
            type="text"
            placeholder="주문번호, 클래스명, 수강생 ID 검색"
            value={searchTerm}
            onChange={handleSearch}
            className="search-inputHY"
          />
        </div>
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

      {/* 필터와 엑셀 다운로드 */}
      <div className="filter-and-action-sectionHY">
        <div className="filter-sectionHY">
          {['전체', '결제완료', '취소됨'].map(status => (
            <button
              key={status}
              className={`filter-btnHY ${statusFilter === (status === '전체' ? '' : status) ? 'active' : ''}`}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="right-alignHY">
          <button className="btn-excel-downloadHY" onClick={handleExcelDownload}>
            엑셀 다운로드
          </button>
        </div>
      </div>

      <span className="result-countHY">
        총 <strong>{totalElements}</strong>건
      </span><br />
      <div className="table-wrapperHY">
        <table className="tableHY">
          <thead>
            <tr>
              <th>결제번호</th>
              <th>주문번호</th>
              <th>수강생 ID</th>
              <th>클래스명</th>
              <th>클래스금액</th>
              <th>쿠폰 유형</th>
              <th>할인 유형</th>
              <th>할인금액/비율</th>
              <th>총 결제 금액</th>
              <th>결제 유형</th>
              <th>결제 상태</th>
              <th>결제일시</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.paymentId}>
                <td>{p.paymentId}</td>
                <td>{p.orderNo}</td>
                <td>{p.studentId}</td>
                <td>{p.className}</td>
                <td>{formatAmount(p.classAmount)}원</td>
                <td>{p.couponType || '-'}</td>
                <td>{p.discountType || '-'}</td>
                <td>
                  {p.calculatedDiscountAmount != null ? `${formatAmount(p.calculatedDiscountAmount)}원` : '-'}
                  {p.discountType === 'RT' && p.discountAmount != null ? ` (${p.discountAmount}%)` : ''}
                </td>
                <td>{formatAmount(p.totalAmount)}원</td>
                <td>{p.paymentType}</td>
                <td><span className={`status-badge ${getStatusClass(p.status)}`}>{p.status}</span></td>
                <td>{formatDate(p.payDate)}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>결제 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>이전</button>
        <span style={{ margin: '0 10px' }}>{currentPage + 1} / {totalPages || 1}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>다음</button>
      </div>
    </Layout>
  );
};

export default PaymentManagement;