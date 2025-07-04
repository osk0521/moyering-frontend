import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { myAxios } from "/src/config";
import Layout from "./Layout";
import './SettlementManagement.css';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
// React Icons import
import { 
  FaDollarSign, 
  FaChalkboardTeacher, 
  FaCheckCircle, 
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';

const SettlementManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAtomValue(tokenAtom);

  // URL에서 전달받은 강사 정보
  const memberInfo = location.state;

  // 상태 관리
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 필터 상태
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [statusFilter, setStatusFilter] = useState('전체'); // 전체, 완료, 대기, 실패
  
  // 페이징
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // 통계 데이터 (가짜 데이터)
  const [monthlyStats, setMonthlyStats] = useState({
    totalRevenue: 15420000,        // 총 결제 금액
    instructorRevenue: 12336000,   // 강사 정산 예정 금액  
    completedCount: 45,            // 정산 완료 건수
    pendingCount: 19               // 정산 대기 건수
  });

  // 현재 월 가져오기 (YYYY-MM 형식)
  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchSettlements();
    // fetchMonthlyStats(); // 가짜 데이터 사용하므로 주석 처리
  }, [currentPage, selectedMonth, statusFilter]);

  // 정산 내역 조회
  const fetchSettlements = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: 실제 API 연동 시 활성화
      /*
      const params = {
        page: currentPage,
        size: pageSize,
        sort: 'settlementDate,desc'
      };

      // 특정 강사 정산 내역 조회 (회원 관리에서 온 경우)
      if (memberInfo?.userId) {
        params.instructorId = memberInfo.userId;
      }

      // 월별 필터
      if (selectedMonth) {
        params.month = selectedMonth;
      }

      // 상태 필터
      if (statusFilter !== '전체') {
        const statusMap = {
          '완료': 'COMPLETED',
          '대기': 'PENDING', 
          '실패': 'FAILED'
        };
        params.status = statusMap[statusFilter];
      }

      const response = await myAxios(token).get('/api/settlement', { params });
      
      if (response.data) {
        const { content, totalPages, totalElements, number } = response.data;
        setSettlements(content || []);
        setTotalPages(totalPages || 0);
        setTotalElements(totalElements || 0);
        setCurrentPage(number || 0);
      }
      */
      
      // 가짜 데이터 생성
      const generateFakeData = () => {
        const statuses = ['완료', '대기', '실패'];
        const classNames = ['김치제기 만들기', 'DIY 공예', '스포츠', '운동', '요리 클래스', '음악 레슨'];
        const instructorIds = ['user12', 'teacher01', 'instructor03'];
        
        const fakeData = [];
        const itemCount = statusFilter === '전체' ? 15 : 5;
        
        for (let i = 0; i < itemCount; i++) {
          const baseAmount = Math.floor(Math.random() * 3000000) + 1000000;
          const commission = Math.floor(baseAmount * 0.1);
          const settlementAmount = baseAmount - commission;
          
          let status;
          if (statusFilter === '전체') {
            status = statuses[Math.floor(Math.random() * statuses.length)];
          } else {
            status = statusFilter;
          }
          
          fakeData.push({
            settlementId: i + 1,
            className: classNames[Math.floor(Math.random() * classNames.length)],
            instructorId: instructorIds[Math.floor(Math.random() * instructorIds.length)],
            studentCount: Math.floor(Math.random() * 30) + 10,
            totalAmount: baseAmount,
            commissionAmount: commission,
            settlementAmount: settlementAmount,
            status: status,
            settlementDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
          });
        }
        
        return fakeData;
      };
      
      const fakeData = generateFakeData();
      setSettlements(fakeData);
      setTotalPages(Math.ceil(fakeData.length / pageSize));
      setTotalElements(fakeData.length);
      
    } catch (err) {
      console.error('정산 내역 조회 실패:', err);
      setError('정산 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 월별 통계 조회 (현재는 가짜 데이터 사용)
  const fetchMonthlyStats = async () => {
    // TODO: 나중에 실제 API 연동 시 활성화
    /*
    try {
      const params = { month: selectedMonth };
      
      if (memberInfo?.userId) {
        params.instructorId = memberInfo.userId;
      }

      const response = await myAxios(token).get('/api/settlement/stats', { params });
      
      if (response.data) {
        setMonthlyStats(response.data);
      }
    } catch (err) {
      console.error('월별 통계 조회 실패:', err);
    }
    */
    
    // 가짜 데이터로 월별 변화 시뮬레이션
    const baseStats = {
      totalRevenue: 15420000,
      instructorRevenue: 12336000,
      completedCount: 45,
      pendingCount: 19
    };
    
    // 월에 따라 약간의 변화 추가
    const monthVariation = selectedMonth.split('-')[1];
    const variation = parseInt(monthVariation) * 0.1;
    
    setMonthlyStats({
      totalRevenue: Math.floor(baseStats.totalRevenue * (1 + variation)),
      instructorRevenue: Math.floor(baseStats.instructorRevenue * (1 + variation)),
      completedCount: Math.floor(baseStats.completedCount * (1 + variation)),
      pendingCount: Math.floor(baseStats.pendingCount * (1 + variation * 0.5))
    });
  };

  // 정산 처리 (완료/대기 상태 변경)
  const handleSettlementAction = async (settlementId, action) => {
    try {
      const confirmMessage = action === 'COMPLETED' 
        ? '정산을 완료 처리하시겠습니까?' 
        : '정산을 대기 상태로 변경하시겠습니까?';
        
      if (!window.confirm(confirmMessage)) return;

      await myAxios(token).patch(`/api/settlement/${settlementId}/status`, {
        status: action
      });

      alert('정산 상태가 변경되었습니다.');
      fetchSettlements();
      // fetchMonthlyStats(); // 가짜 데이터 사용하므로 주석 처리
    } catch (err) {
      console.error('정산 상태 변경 실패:', err);
      alert('정산 상태 변경에 실패했습니다.');
    }
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 금액 포맷팅
  const formatAmount = (amount) => {
    if (!amount) return '0원';
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // 상태 배지 렌더링
  const renderStatusBadge = (status) => {
    const statusConfig = {
      '완료': { class: 'completed', text: '완료' },
      '대기': { class: 'pending', text: '대기' },
      '실패': { class: 'failed', text: '실패' }
    };
    
    const config = statusConfig[status] || { class: 'pending', text: status };
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  return (
    <Layout>
      {/* 페이지 헤더 */}
      <div className="page-header-settlement">
        <div className="header-left">
          <h1>정산 관리</h1>
          {memberInfo && (
            <div className="instructor-info">
              <span className="instructor-name">{memberInfo.username}</span>
              <span className="instructor-type">({memberInfo.userType})</span>
            </div>
          )}
        </div>
        
        {/* 월 선택 드롭다운 */}
        <div className="month-selector">
          <FaCalendarAlt className="calendar-icon" />
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-select"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              const monthLabel = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
              return (
                <option key={monthValue} value={monthValue}>
                  {monthLabel}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-container">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <div className="stat-label">총 결제 금액</div>
            <div className="stat-value">{formatAmount(monthlyStats.totalRevenue)}</div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">
            <FaChalkboardTeacher />
          </div>
          <div className="stat-content">
            <div className="stat-label">강사 정산 예정 금액</div>
            <div className="stat-value">{formatAmount(monthlyStats.instructorRevenue)}</div>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-label">정산 완료 건수</div>
            <div className="stat-value">{monthlyStats.completedCount} 건</div>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <div className="stat-label">정산 대기 건수</div>
            <div className="stat-value">{monthlyStats.pendingCount} 건</div>
          </div>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="filter-section">
        <div className="status-filters">
          {['전체', '완료', '대기', '실패'].map(status => (
            <button 
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="summary-text">
          강사별, 클래스별 정산 내역 관리
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* 결과 카운트 */}
      <div className="result-count">
        총 <strong>{totalElements}</strong>건
      </div>

      {/* 정산 테이블 */}
      <div className="table-containerHY">
        <table className="tableHY">
          <thead>
            <tr>
              <th>No</th>
              <th>클래스명</th>
              <th>강사 ID</th>
              <th>수강생 수</th>
              <th>총 결제 금액</th>
              <th>수수료</th>
              <th>정산 예정 금액</th>
              <th>정산 상태</th>
              <th>정산일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="loading-cell">
                  데이터를 불러오는 중...
                </td>
              </tr>
            ) : settlements.length > 0 ? (
              settlements.map((settlement, index) => (
                <tr key={settlement.settlementId}>
                  <td>{(currentPage * pageSize) + index + 1}</td>
                  <td className="class-name">{settlement.className}</td>
                  <td>{settlement.instructorId}</td>
                  <td>{settlement.studentCount}명</td>
                  <td className="amount">{formatAmount(settlement.totalAmount)}</td>
                  <td className="amount">{formatAmount(settlement.commissionAmount)}</td>
                  <td className="amount settlement-amount">
                    {formatAmount(settlement.settlementAmount)}
                  </td>
                  <td>{renderStatusBadge(settlement.status)}</td>
                  <td>{formatDate(settlement.settlementDate)}</td>
                  <td>
                    <div className="action-buttons">
                      {settlement.status === '대기' && (
                        <button 
                          className="action-btn complete-btn"
                          onClick={() => handleSettlementAction(settlement.settlementId, 'COMPLETED')}
                          title="정산 완료"
                        >
                          완료
                        </button>
                      )}
                      {settlement.status === '완료' && (
                        <button 
                          className="action-btn pending-btn"
                          onClick={() => handleSettlementAction(settlement.settlementId, 'PENDING')}
                          title="대기로 변경"
                        >
                          대기
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-data">
                  정산 내역이 없습니다.
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
            disabled={currentPage === 0}
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
                className={`page-btnHY ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber + 1}
              </button>
            );
          })}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
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