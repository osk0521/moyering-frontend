import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import './UnsettlementManagement.css';
import { useLocation } from 'react-router-dom';

const SettlementManagement = () => {
  const location = useLocation();
  const userInfo = location.state; // MemberManagement에서 전달받은 사용자 정보
  
  // ===== 상태 관리 =====
  // 탭 상태 (새로 추가)
  const [activeTab, setActiveTab] = useState('unsettled'); // 'unsettled' 또는 'requests'
  
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 미정산 더미 데이터
  const [allUnsettledItems] = useState([
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

  // 정산내역 요청 더미 데이터 (새로 추가)
  const [allSettlementRequests] = useState([
    {
      id: 1,
      no: 1,
      settlementId: 'user6',
      className: '요리 마스터 클래스',
      requestDate: '2024-05-15',
      requestAmount: 1800000,
      classDate: '2024-05-05',
      classAmount: 150000,
      participants: 12,
      status: '승인대기',
      requestType: '정산요청'
    },
    {
      id: 2,
      no: 2,
      settlementId: 'user7',
      className: '영어회화 집중과정',
      requestDate: '2024-05-14',
      requestAmount: 2400000,
      classDate: '2024-05-03',
      classAmount: 200000,
      participants: 12,
      status: '승인완료',
      requestType: '정산요청'
    },
    {
      id: 3,
      no: 3,
      settlementId: 'user8',
      className: '프로그래밍 입문',
      requestDate: '2024-05-13',
      requestAmount: 3200000,
      classDate: '2024-05-02',
      classAmount: 160000,
      participants: 20,
      status: '반려',
      requestType: '정산요청'
    },
    {
      id: 4,
      no: 4,
      settlementId: 'user9',
      className: '사진 촬영 워크샵',
      requestDate: '2024-05-12',
      requestAmount: 1350000,
      classDate: '2024-05-01',
      classAmount: 90000,
      participants: 15,
      status: '승인대기',
      requestType: '정산요청'
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

  // 상태별 스타일 클래스 반환
  const getStatusClass = (status) => {
    switch (status) {
      case '승인대기':
        return 'status-pendingHY';
      case '승인완료':
        return 'status-completedHY';
      case '반려':
        return 'status-failedHY';
      default:
        return '';
    }
  };

  // ===== 이벤트 핸들러들 =====
  // 탭 변경 (새로 추가)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // 탭 변경 시 필터 초기화
    setSearchTerm(userInfo?.username || '');
    setStartDate('');
    setEndDate('');
  };

  // 검색어 변경
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 정산하기 버튼 클릭
  const handleSettlement = (settlementId) => {
    alert(`${settlementId}의 정산을 진행합니다.`);
    // 실제 구현에서는 정산 로직 추가
  };

  // 정산요청 처리 (새로 추가)
  const handleRequestAction = (requestId, action) => {
    if (action === 'approve') {
      alert(`${requestId}의 정산요청을 승인합니다.`);
    } else if (action === 'reject') {
      alert(`${requestId}의 정산요청을 반려합니다.`);
    }
    // 실제 구현에서는 해당 로직 추가
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setSearchTerm(userInfo?.username || '');
    setStartDate('');
    setEndDate('');
  };

  // 현재 활성 탭에 따른 데이터 선택
  const getCurrentData = () => {
    return activeTab === 'unsettled' ? allUnsettledItems : allSettlementRequests;
  };

  // 필터링된 목록 
  const filteredItems = getCurrentData().filter(item => {
    // 1. 사용자 정보 필터링
    if (userInfo && userInfo.username) {
      if (item.settlementId !== userInfo.username) {
        return false;
      }
    }
    
    // 2. 검색어 필터링
    const matchesSearch = !searchTerm || 
      item.settlementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.className.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 3. 날짜 범위 필터링
    const targetDate = activeTab === 'unsettled' ? item.settlementRequestDate : item.requestDate;
    const matchesDateRange = isDateInRange(targetDate, startDate, endDate);
    
    return matchesSearch && matchesDateRange;
  });

  // ===== 렌더링 =====
  return (
    <Layout>
        {/* 페이지 헤더 */}
        <div className="page-titleHY">
          <h1>
            {userInfo ? `${userInfo.username}님의 정산 관리` : '정산 관리'}
          </h1>
          {userInfo && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
              회원 구분: {userInfo.userType}
            </div>
          )}
        </div>

        {/* 탭 네비게이션 (새로 추가) */}
        <div className="tab-navigationHY">
          <button 
            className={`tab-buttonHY ${activeTab === 'unsettled' ? 'active' : ''}`}
            onClick={() => handleTabChange('unsettled')}
          >
            미정산 리스트
          </button>
          <button 
            className={`tab-buttonHY ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => handleTabChange('requests')}
          >
            정산내역 요청
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="search-sectionHY">
          <div className="search-boxHY">
            <span className="search-iconHY">🔍</span>
            <input
              type="text"
              placeholder={activeTab === 'unsettled' ? "정산자, 클래스명 검색" : "요청자, 클래스명 검색"}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-inputHY"
            />
          </div>
          
          <div className="date-filter-groupHY">
            <label className="date-labelHY">
              {activeTab === 'unsettled' ? '정산 요청 기간' : '요청 날짜 기간'}
            </label>
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
            {(searchTerm !== (userInfo?.username || '') || startDate || endDate) && (
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
          총 <strong>{filteredItems.length}</strong>건
          {(startDate || endDate) && (
            <span className="filter-infoHY">
              {startDate && endDate ? ` (${startDate} ~ ${endDate})` :
               startDate ? ` (${startDate} 이후)` :
               ` (${endDate} 이전)`}
            </span>
          )}
        </div>

        {/* 테이블 */}
        <div className="table-containerHY">
          <table className="tableHY">
            <thead>
              <tr>
                <th>No</th>
                <th>{activeTab === 'unsettled' ? '정산 ID' : '요청자 ID'}</th>
                <th>클래스명</th>
                <th>{activeTab === 'unsettled' ? '정산 요청일' : '요청일'}</th>
                <th>{activeTab === 'unsettled' ? '정산 요청금액' : '요청금액'}</th>
                <th>클래스 일자</th>
                <th>클래스 금액</th>
                <th>수강생 인원</th>
                {activeTab === 'requests' && <th>상태</th>}
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="no-columnHY">{index + 1}</td>
                    <td className="settlement-idHY">{item.settlementId}</td>
                    <td className="class-nameHY">{item.className}</td>
                    <td>{activeTab === 'unsettled' ? item.settlementRequestDate : item.requestDate}</td>
                    <td className="amountHY">
                      {formatAmount(activeTab === 'unsettled' ? item.settlementRequestAmount : item.requestAmount)}원
                    </td>
                    <td>{item.classDate}</td>
                    <td className="amountHY">{formatAmount(item.classAmount)}원</td>
                    <td className="participantsHY">{item.participants}명</td>
                    {activeTab === 'requests' && (
                      <td>
                        <span className={`status-badgeHY ${getStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    )}
                    <td>
                      {activeTab === 'unsettled' ? (
                        <button 
                          className="btn-settlementHY"
                          onClick={() => handleSettlement(item.settlementId)}
                        >
                          정산하기
                        </button>
                      ) : (
                        <div className="action-buttonsHY">
                          {item.status === '승인대기' && (
                            <>
                              <button 
                                className="btn-approveHY"
                                onClick={() => handleRequestAction(item.settlementId, 'approve')}
                              >
                                승인
                              </button>
                              <button 
                                className="btn-rejectHY"
                                onClick={() => handleRequestAction(item.settlementId, 'reject')}
                              >
                                반려
                              </button>
                            </>
                          )}
                          {item.status !== '승인대기' && (
                            <span className="action-disabledHY">처리완료</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'requests' ? "10" : "9"} style={{ textAlign: 'center', padding: '20px' }}>
                    {userInfo ? 
                      `${userInfo.username}님의 ${activeTab === 'unsettled' ? '미정산' : '정산요청'} 내역이 없습니다.` : 
                      (startDate || endDate) ? 
                        `해당 기간에 ${activeTab === 'unsettled' ? '미정산' : '정산요청'} 내역이 없습니다.` : 
                        `${activeTab === 'unsettled' ? '미정산' : '정산요청'} 내역이 없습니다.`
                    }
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