import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { myAxios } from "/src/config";
import Layout from "./Layout";
import './UnsettlementManagement.css';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const SettlementManagement = () => {
  const location = useLocation();
  const userInfo = location.state; // MemberManagement에서 전달받은 사용자 정보
  const token = useAtomValue(tokenAtom);
  
  // ===== 상태 관리 =====
  const [activeTab, setActiveTab] = useState('unsettled');
  
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 백엔드 연동 데이터
  const [settlementData, setSettlementData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // 사용자 정보가 있으면 검색어를 자동으로 설정
  useEffect(() => {
    if (userInfo && userInfo.username) {
      setSearchTerm(userInfo.username);
    }
  }, [userInfo]);

  // ===== API 호출 함수 =====
  const fetchSettlementData = useCallback(async () => {
    if (loading) return; // 중복 호출 방지
    
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = '';
      const params = {
        page: currentPage,
        size: pageSize,
        sort: 'settlementDate,desc'
      };

      // 검색어 처리
      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }

      // 날짜 필터링
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      

      console.log('API 호출 - endpoint:', endpoint, 'params:', params);

      const response = await myAxios(token).get(endpoint, { params });
      
      if (response.data) {
        const { content, totalPages, totalElements, number } = response.data;
        setSettlementData(content || []);
        setTotalPages(totalPages || 0);
        setTotalElements(totalElements || 0);
        setCurrentPage(number || 0);
      }
    } catch (err) {
      console.error('미정산 목록 조회 실패:', err);
      setError('미정산 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, startDate, endDate, token, loading]);

  // 정산 처리 API
  const handleSettlement = async (settlementId) => {
    if (!window.confirm('정산을 진행하시겠습니까?')) return;
    
    try {
      const response = await myAxios(token).put(`/api/settlement/${settlementId}/complete`);
      
      if (response.status === 200) {
        alert('정산이 완료되었습니다.');
        fetchSettlementData(); // 목록 새로고침
      }
    } catch (err) {
      console.error('정산 처리 실패:', err);
      alert('정산 처리에 실패했습니다.');
    }
  };

  // ===== useEffect 훅들 =====
  // 초기 로딩
  useEffect(() => {
    fetchSettlementData();
  }, []);

  // 페이지 변경 시
  useEffect(() => {
    fetchSettlementData();
  }, [currentPage]);

  // 검색어 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 필터 변경 시
  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab, startDate, endDate]);

  // ===== 헬퍼 함수들 =====
  // 금액 포맷팅
  const formatAmount = (amount) => {
    if (!amount) return '0';
    return amount.toLocaleString('ko-KR');
  };

  // 날짜 포맷팅
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ko-KR');
  };

  // 상태별 스타일 클래스
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'status-pendingHY';
      case 'COMPLETED':
        return 'status-completedHY';
      case 'CANCELLED':
        return 'status-cancelledHY';
      default:
        return '';
    }
  };

  // 상태 텍스트 변환
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return '정산대기';
      case 'COMPLETED':
        return '정산완료';
      case 'CANCELLED':
        return '정산취소';
      default:
        return status;
    }
  };

  // ===== 이벤트 핸들러들 =====
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
    setSearchTerm(userInfo?.username || '');
    setStartDate('');
    setEndDate('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm(userInfo?.username || '');
    setStartDate('');
    setEndDate('');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage && !loading) {
      setCurrentPage(newPage);
    }
  };

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


      {/* 검색 영역 */}
      <div className="search-sectionHY">
        <div className="search-boxHY">
          <span className="search-iconHY">🔍</span>
          <input
            type="text"
            placeholder="강사 ID, 클래스명 검색"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-inputHY"
          />
        </div>
        
        <div className="date-filter-groupHY">
          <label className="date-labelHY">정산 예정일 기간</label>
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
        총 <strong>{totalElements}</strong>건
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
              <th>정산 ID</th>
              <th>강사 ID</th>
              <th>클래스 일정 ID</th>
              <th>정산 예정일</th>
              <th>정산 예정금액</th>
              <th>은행</th>
              <th>계좌번호</th>
              <th>상태</th>
              {activeTab === 'unsettled' && <th>액션</th>}
              {activeTab === 'settled' && <th>지급일</th>}
            </tr>
          </thead>
          <tbody>
            {settlementData.length > 0 ? (
              settlementData.map((item, index) => (
                <tr key={item.settlementId}>
                  <td className="no-columnHY">
                    {(currentPage * pageSize) + index + 1}
                  </td>
                  <td className="settlement-idHY">{item.settlementId}</td>
                  <td className="host-idHY">{item.hostId}</td>
                  <td className="calendar-idHY">{item.calendarId}</td>
                  <td>{formatDate(item.settlementDate)}</td>
                  <td className="amountHY">
                    {formatAmount(item.settleAmountToDo)}원
                  </td>
                  <td>{item.bankName || '-'}</td>
                  <td>{item.accNum || '-'}</td>
                  <td>
                    <span className={`status-badgeHY ${getStatusClass(item.settlementStatus)}`}>
                      {getStatusText(item.settlementStatus)}
                    </span>
                  </td>
                  {activeTab === 'unsettled' && (
                    <td>
                      {item.settlementStatus === 'PENDING' ? (
                        <button 
                          className="btn-settlementHY"
                          onClick={() => handleSettlement(item.settlementId)}
                          disabled={loading}
                        >
                          정산하기
                        </button>
                      ) : (
                        <span className="action-disabledHY">처리완료</span>
                      )}
                    </td>
                  )}
                  {activeTab === 'settled' && (
                    <td>{formatDate(item.settledAt)}</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === 'unsettled' ? "10" : "10"} style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? '데이터를 불러오는 중...' : 
                   error ? '데이터를 불러올 수 없습니다.' :
                   userInfo ? 
                    `${userInfo.username}님의 ${activeTab === 'unsettled' ? '미정산' : '정산완료'} 내역이 없습니다.` : 
                    `${activeTab === 'unsettled' ? '미정산' : '정산완료'} 내역이 없습니다.`
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="paginationHY">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || loading}
            className="page-btnHY"
          >
            이전
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const startPage = Math.max(0, currentPage - 2);
            const pageNumber = startPage + i;
            
            if (pageNumber >= totalPages) return null;
            
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={loading}
                className={`page-btnHY ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber + 1}
              </button>
            );
          })}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="page-btnHY"
          >
            다음
          </button>
        </div>
      )}
    </Layout>
  );
};

export default SettlementManagement;