import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import './SettlementManagement.css';
import { useLocation } from 'react-router-dom';

const SettlementManagement = () => {
  const location = useLocation();
  const userInfo = location.state; // MemberManagement에서 전달받은 사용자 정보
  
  // ===== 상태 관리 =====
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 더미 데이터
  const [allSettlements] = useState([
    {
      id: 1,
      no: 1,
      settlementId: 'user',
      className: '베이킹 베이직기',
      settlementRequestDate: '2024-05-10',
      settlementRequestAmount: 1296000,
      classDate: '2024-05-01',
      classAmount: 120000,
      participants: 12,
      status: '정산하기'
    },
    {
      id: 2,
      no: 2,
      settlementId: 'user2',
      className: '그림을 배우기',
      settlementRequestDate: '2024-05-10',
      settlementRequestAmount: 2025000,
      classDate: '2024-05-01',
      classAmount: 150000,
      participants: 15,
      status: '정산하기'
    },
    {
      id: 3,
      no: 3,
      settlementId: 'user3',
      className: '제품 반영하기나과',
      settlementRequestDate: '2024-05-10',
      settlementRequestAmount: 3600000,
      classDate: '2024-05-01',
      classAmount: 200000,
      participants: 20,
      status: '정산하기'
    },
    {
      id: 4,
      no: 4,
      settlementId: 'user4',
      className: '피아노 베이직과',
      settlementRequestDate: '2024-05-10',
      settlementRequestAmount: 936000,
      classDate: '2024-05-01',
      classAmount: 80000,
      participants: 13,
      status: '정산하기'
    },
    {
      id: 5,
      no: 5,
      settlementId: 'user5',
      className: '디자인을 베이직과!!',
      settlementRequestDate: '2024-05-10',
      settlementRequestAmount: 705600,
      classDate: '2024-05-01',
      classAmount: 98000,
      participants: 8,
      status: '정산하기'
    }
  ]);

  // 사용자 정보가 있으면 검색어를 자동으로 설정
  useEffect(() => {
    if (userInfo && userInfo.username) {
      setSearchTerm(userInfo.username);
    }
  }, [userInfo]);

  // ===== 헬퍼 함수들 =====
  // 금액 포맷팅 (천 단위 구분자)
  const formatAmount = (amount) => {
    return amount.toLocaleString('ko-KR');
  };

  // 날짜 비교 함수
  const isDateInRange = (targetDate, startDate, endDate) => {
    if (!startDate && !endDate) return true; // 날짜 필터가 없으면 모두 포함
    
    const target = new Date(targetDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return target >= start && target <= end;
    } else if (start) {
      return target >= start;
    } else if (end) {
      return target <= end;
    }
    
    return true;
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

  // 필터 초기화
  const handleResetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  // 필터링된 정산 목록 (검색어 + 날짜 범위)
  const filteredSettlements = allSettlements.filter(settlement => {
    // 1. 사용자 정보 필터링
    if (userInfo && userInfo.username) {
      if (settlement.settlementId !== userInfo.username) {
        return false;
      }
    }
    
    // 2. 검색어 필터링
    const matchesSearch = !searchTerm || 
      settlement.settlementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.className.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 3. 날짜 범위 필터링 (정산 요청일 기준)
    const matchesDateRange = isDateInRange(settlement.settlementRequestDate, startDate, endDate);
    
    return matchesSearch && matchesDateRange;
  });

  // ===== 렌더링 =====
  return (
    <Layout>
        {/* 페이지 헤더 */}
        <div className="page-titleHY">
          <h1>
            {userInfo ? `${userInfo.username}님의 정산 내역` : '오늘 정산할 내역'}
          </h1>
          {userInfo && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
              회원 구분: {userInfo.userType}
            </div>
          )}
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
          
          <div className="date-filter-groupHY">
            <label className="date-labelHY">정산 요청 기간</label>
            <input
              type="date"
              className="date-inputHY"
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="시작일"
            />
            <span className="date-separatorHY">~</span>
            <input
              type="date"
              className="date-inputHY"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="종료일"
            />
            
            {/* 필터 초기화 버튼 */}
            {(searchTerm || startDate || endDate) && (
              <button 
                className="reset-filterHY"
                onClick={handleResetFilters}
                type="button"
              >
                필터 초기화
              </button>
            )}
          </div>
        </div>
  
        {/* 결과 수 표시 */}
        <div className="result-countHY">
          총 <strong>{filteredSettlements.length}</strong>건
          {(startDate || endDate) && (
            <span className="filter-infoHY">
              {startDate && endDate ? ` (${startDate} ~ ${endDate})` :
               startDate ? ` (${startDate} 이후)` :
               ` (${endDate} 이전)`}
            </span>
          )}
        </div>

        {/* 정산 테이블 */}
        <div className="table-containerHY">
        <table className="tableHY">
            <thead>
              <tr>
                <th>No</th>
                <th>정산 ID</th>
                <th>클래스명</th>
                <th>정산 요청일</th>
                <th>정산 요청금액</th>
                <th>클래스 일자</th>
                <th>클래스 금액</th>
                <th>수강생 인원</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredSettlements.length > 0 ? (
                filteredSettlements.map((settlement, index) => (
                  <tr key={settlement.id}>
                    <td className="no-columnHY">{index + 1}</td>
                    <td className="settlement-idHY">{settlement.settlementId}</td>
                    <td className="class-nameHY">{settlement.className}</td>
                    <td>{settlement.settlementRequestDate}</td>
                    <td className="amountHY">{formatAmount(settlement.settlementRequestAmount)}원</td>
                    <td>{settlement.classDate}</td>
                    <td className="amountHY">{formatAmount(settlement.classAmount)}원</td>
                    <td className="participantsHY">{settlement.participants}명</td>
                    <td>
                      <button 
                        className="btn-settlementHY"
                        onClick={() => handleSettlement(settlement.settlementId)}
                      >
                        정산하기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                    {userInfo ? `${userInfo.username}님의 정산 내역이 없습니다.` : 
                     (startDate || endDate) ? '해당 기간에 정산 내역이 없습니다.' : '정산 내역이 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

    </Layout>
  );
};

export default SettlementManagement;