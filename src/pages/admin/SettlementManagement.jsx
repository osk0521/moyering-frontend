// src/components/pages/SettlementManagement.jsx
import React, { useState } from 'react';
import Layout from '../common/Layout';

import './SettlementManagement.css';

const SettlementManagement = () => {
  // ===== 상태 관리 =====
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 정산 데이터 - 피그마와 정확히 동일하게
  const [settlements, setSettlements] = useState([
    {
      id: 1,
      no: 1,
      settlementId: 'user',
      className: '베이킹 베이직기',
      applicationDate: '2024-05-10',
      settlementAmount: 1296000,
      adjustmentDate: '2024-05-01',
      adjustmentAmount: 120000,
      participants: 12,
      status: '정산하기'
    },
    {
      id: 2,
      no: 2,
      settlementId: 'user2',
      className: '그림을 배우기',
      applicationDate: '2024-05-10',
      settlementAmount: 2025000,
      adjustmentDate: '2024-05-01',
      adjustmentAmount: 150000,
      participants: 15,
      status: '정산하기'
    },
    {
      id: 3,
      no: 3,
      settlementId: 'user3',
      className: '제품 반영하기나과',
      applicationDate: '2024-05-10',
      settlementAmount: 3600000,
      adjustmentDate: '2024-05-01',
      adjustmentAmount: 200000,
      participants: 20,
      status: '정산하기'
    },
    {
      id: 4,
      no: 4,
      settlementId: 'user4',
      className: '피아노 베이직과',
      applicationDate: '2024-05-10',
      settlementAmount: 936000,
      adjustmentDate: '2024-05-01',
      adjustmentAmount: 80000,
      participants: 13,
      status: '정산하기'
    },
    {
      id: 5,
      no: 5,
      settlementId: 'user5',
      className: '디자인을 베이직과!!',
      applicationDate: '2024-05-10',
      settlementAmount: 705600,
      adjustmentDate: '2024-05-01',
      adjustmentAmount: 98000,
      participants: 8,
      status: '정산하기'
    }
  ]);

  // ===== 헬퍼 함수들 =====
  // 금액 포맷팅 (천 단위 구분자)
  const formatAmount = (amount) => {
    return amount.toLocaleString('ko-KR');
  };

  // ===== 이벤트 핸들러들 =====
  // 검색어 변경
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 정산하기 버튼 클릭
  const handleSettlement = (settlementId) => {
    alert(`${settlementId}의 정산을 진행합니다.`);
    // 실제 구현에서는 정산 로직 추가
  };

  // 필터링된 정산 목록
  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = 
      settlement.settlementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.className.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // ===== 렌더링 =====
  return (
    <Layout>
      <div className="settlement-managementHY">
        {/* 페이지 헤더 */}
        <div className="page-headerHY">
          <h1>오늘 정산할 내역</h1>
        </div>

        {/* 검색 영역 */}
        <div className="search-sectionHY">
          <div className="search-boxHY">
            <span className="search-iconHY">🔍</span>
            <input
              type="text"
              placeholder="정산자, 클래스명 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-inputHY"
            />
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="info-messageHY">
          출력값은 누적금, 금회차기 기준이며 출력값 상품현재지금 이용 수 수료 / 금회 무월 수 정산기간 누적금 집임
        </div>

        {/* 정산 테이블 */}
        <div className="table-wrapperHY">
          <table className="settlement-tableHY">
            <thead>
              <tr>
                <th>No</th>
                <th>정산 ID</th>
                <th>출력수급</th>
                <th>정산 신청일</th>
                <th>정산 금액일</th>
                <th>출력수정일</th>
                <th>출력수 금액</th>
                <th>인원</th>
                <th>정산하기</th>
              </tr>
            </thead>
            <tbody>
              {filteredSettlements.map(settlement => (
                <tr key={settlement.id}>
                  <td className="no-columnHY">{settlement.no}</td>
                  <td className="settlement-idHY">{settlement.settlementId}</td>
                  <td className="class-nameHY">{settlement.className}</td>
                  <td>{settlement.applicationDate}</td>
                  <td className="amountHY">{formatAmount(settlement.settlementAmount)}</td>
                  <td>{settlement.adjustmentDate}</td>
                  <td className="amountHY">{formatAmount(settlement.adjustmentAmount)}</td>
                  <td className="participantsHY">{settlement.participants}</td>
                  <td>
                    <button 
                      className="btn-settlementHY"
                      onClick={() => handleSettlement(settlement.settlementId)}
                    >
                      정산하기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SettlementManagement;