import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from "/src/config"; 
import Layout from "./Layout";
import './MemberManagement.css';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [memberType, setMemberType] = useState('전체'); // 일반/강사 필터
  const [startDate, setStartDate] = useState(''); // 가입기간 - START 상태
  const [endDate, setEndDate] = useState(''); // 가입기간 - END 상태 

  // 백엔드 연동 데이터
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20); // 한 페이지 당 20개씩 

  // 디바운스를 위한 타이머
  const [searchTimer, setSearchTimer] = useState(null);

  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);

  // 컴포넌트 마운트 시 회원 목록 조회
  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    
    const timer = setTimeout(() => {
      setCurrentPage(0); // 검색 시 첫 페이지로 이동
      fetchMembers();
    }, 500); // 500ms 지연

    setSearchTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchTerm]);

  // 필터 변경 시 회원 목록 다시 조회
  useEffect(() => {
    setCurrentPage(0);
    fetchMembers();
  }, [memberType, startDate, endDate]);

  // 회원 목록 조회 API 호출
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sort: 'regDate,desc'
      };

      // 검색어가 있으면 keyword 파라미터 추가
      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }

      // 회원 유형 필터링 (백엔드에서 처리)
      if (memberType !== '전체') {
        // DTO의 userTypeCode를 사용해서 필터링
        const typeCode = memberType === '일반' ? 'ROLE_MB' : memberType === '강사' ? 'ROLE_HT' : null;
        if (typeCode) {
          params.userType = typeCode;
        }
      }

      // 날짜 필터링 (백엔드에서 처리)
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const response = await myAxios(token).get('/api/member', { params });
      
      if (response.data) {
        const { content, totalPages, totalElements, number } = response.data;
        setMemberData(content || []);
        setTotalPages(totalPages || 0);
        setTotalElements(totalElements || 0);
        setCurrentPage(number || 0);
      }
    } catch (err) {
      console.error('회원 목록 조회 실패:', err);
      // alert('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 검색어 입력 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 회원 유형 필터 변경
  const handleMemberTypeChange = (type) => {
    setMemberType(type);
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 날짜 초기화
  const handleDateReset = () => {
    setStartDate('');
    setEndDate('');
  };

  // 날짜 포맷팅 함수 (Date 객체를 YYYY-MM-DD 형식으로 변환)
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // 결제내역 페이지로 이동
  const handlePaymentHistory = (member) => {
    navigate('/admin/payment', { 
      state: { 
        userId: member.userId,
        username: member.username,
        userType: member.userType 
      } 
    });
  };

  // 정산내역 페이지로 이동
  const handleSettlementHistory = (member) => {
    navigate('/admin/settlement', { 
      state: { 
        userId: member.userId,
        username: member.username,
        userType: member.userType 
      } 
    });
  };

  return (
    <Layout>
      {/* 페이지 제목 */}
      <div className="page-titleHY">
        <h1>회원 관리</h1>
      </div>


      {/* 검색 및 필터 영역 */}
      <div className="search-sectionHY">
        <div className="search-boxHY">
          <span className="search-iconHY">🔍</span>
          <input
            type="text"
            placeholder="회원 아이디, 이메일 검색"
            value={searchTerm}
            onChange={handleSearch}
            className="search-inputHY"
          />
        </div>
        <div className="date-filter-group">
          <label className="date-labelHY">가입기간</label>
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
          <button 
            onClick={handleDateReset}
            className="date-reset-btn"
            type="button"
          >
            초기화
          </button>
        </div>
      </div>
      
      {/* 회원 유형 필터 */}
      <div className="filter-sectionHY">
        {['전체', '일반', '강사'].map(type => (
          <button 
            key={type}
            className={`filter-btnHY ${memberType === type ? 'active' : ''}`}
            onClick={() => handleMemberTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="error-messageHY">
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="loading-messageHY">
          데이터를 불러오는 중...
        </div>
      )}

      {/* 필터된 결과 수 */}
      <div className="result-countHY">
        총 <strong>{memberData.length}</strong>건
      </div>

      {/* 회원 테이블 */}
      <div className="table-containerHY">
        <table className="tableHY">
          <thead>
            <tr>
              <th>No</th>
              <th>회원 구분</th>
              <th>아이디</th>
              <th>회원명</th>
              <th>이메일</th>
              <th>연락처</th>
              <th>가입일</th>
              <th>결제내역</th>
              <th>정산내역</th>
            </tr>
          </thead>
          <tbody>
            {memberData.length > 0 ? (
              memberData.map((member, index) => (
                <tr key={member.userId}>
                  <td>{(currentPage * pageSize) + index + 1}</td>
                  <td>
                    <span className={`member-typeHY ${member.userType === '강사' ? 'instructor' : 'general'}`}>
                      {member.userType}
                    </span>
                  </td>
                  <td>{member.username}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.tel}</td>
                  <td>{formatDate(member.regDate)}</td>
                  <td>
                    <button
                      className="action-btnHY payment-btnHY"
                      onClick={() => handlePaymentHistory(member)}
                      title="결제내역 보기"
                    >
                      결제내역
                    </button>
                  </td>
                  <td>
                    {/* 강사인 경우에만 정산내역 버튼 표시 */}
                    {member.userType === '강사' ? (
                      <button 
                        className="action-btnHY settlement-btnHY"
                        onClick={() => handleSettlementHistory(member)}
                        title="정산내역 보기"
                      >
                        정산내역
                      </button>
                    ) : (
                      <span className="no-settlement">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-dataHY">
                  {loading ? '데이터를 불러오는 중...' : '검색 결과가 없습니다.'}
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

export default MemberManagement;