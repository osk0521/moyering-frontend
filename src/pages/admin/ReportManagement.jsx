// src/components/pages/ReportManagement.jsx


import React, { useState } from 'react';
import Layout from '../common/Layout';
import './ReportManagement.css';

const ReportManagement = () => {
  // 2단계: 상태 관리 (State Management)
  // React의 useState 훅을 사용해서 컴포넌트의 상태를 관리합니다
  
  // 검색어 상태 - 사용자가 입력한 검색어를 저장
  const [searchTerm, setSearchTerm] = useState('');
  
  // 선택된 필터 상태 - 어떤 카테고리가 선택되었는지 저장
  const [selectedFilter, setSelectedFilter] = useState('전체');
  
  // 정렬 설정 상태 - 테이블의 정렬 방식을 저장
  const [sortConfig, setSortConfig] = useState({ 
    key: 'reportDate', 
    direction: 'desc' 
  });

  // 3단계: 더미 데이터 생성
  // 실제 개발에서는 API에서 데이터를 받아오지만, 
  // 지금은 테스트용 더미 데이터를 만듭니다
  const [reports, setReports] = useState([
    {
      id: 1,
      number: 1,
      category: '게시글',
      title: '부적절한 글 게시',
      content: '게시글 내용에 욕설과 비방이 포함되어 있습니다',
      reporter: 'user2',
      handler: 'user3',
      status: '대기중',
      reportDate: '2023-05-14 11:30:45',
      isVisible: true
    },
    {
      id: 2,
      number: 2,
      category: '댓글',
      title: '욕설이 포함된 댓글',
      content: '댓글에 심한 욕설이 사용되었습니다',
      reporter: 'user2',
      handler: 'user3',
      status: '대기중',
      reportDate: '2023-05-13 14:20:33',
      isVisible: true
    },
    {
      id: 3,
      number: 3,
      category: '사용자',
      title: '불건전한 프로필 사진',
      content: '프로필 사진이 부적절합니다',
      reporter: 'user2',
      handler: 'user3',
      status: '처리됨',
      reportDate: '2023-05-12 16:40:12',
      isVisible: false
    },
    {
      id: 4,
      number: 4,
      category: '게시글',
      title: '부적절한 글 게시',
      content: '게시글 내용이 선정적입니다',
      reporter: 'user2',
      handler: 'user3',
      status: '처리됨',
      reportDate: '2023-05-14 11:30:45',
      isVisible: true
    },
    {
      id: 5,
      number: 5,
      category: '댓글',
      title: '욕설이 포함된 댓글',
      content: '댓글에 개인정보가 노출되었습니다',
      reporter: 'user2',
      handler: 'user3',
      status: '처리됨',
      reportDate: '2023-05-13 14:20:33',
      isVisible: true
    },
    {
      id: 6,
      number: 6,
      category: '기타',
      title: '앱 버그 신고',
      content: '시스템 오류로 인한 문제입니다',
      reporter: 'user2',
      handler: 'user3',
      status: '처리됨',
      reportDate: '2023-05-12 16:40:12',
      isVisible: false
    }
  ]);

  // 4단계: 필터 옵션 정의
  // 필터 버튼에 표시될 카테고리들을 배열로 정의
  const filterOptions = ['전체', '게시글', '댓글', '사용자', '기타'];

  // 5단계: 헬퍼 함수들 (Helper Functions)
  // 재사용 가능한 작은 함수들을 만듭니다
  
  // 날짜 포맷팅 함수 - 날짜를 한국어 형식으로 변환
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  // 상태에 따른 CSS 클래스 반환 함수
  const getStatusClass = (status) => {
    const statusMap = {
      '대기중': 'status-received',
      '처리됨': 'status-completed',
      // '반려': 'status-rejected'
    };
    return statusMap[status] || '';
  };

  // 6단계: 이벤트 핸들러 함수들
  // 사용자의 액션(클릭, 입력 등)을 처리하는 함수들
  
  // 검색어 변경 처리
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 필터 버튼 클릭 처리
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  // 테이블 정렬 처리
  const handleSort = (key) => {
    let direction = 'asc';
    // 같은 컬럼을 클릭하면 정렬 방향을 바꿉니다
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 상태 변경 처리 (관리 버튼 클릭 시)
  const handleStatusChange = (id, newStatus) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === id 
          ? { ...report, status: newStatus }
          : report
      )
    );
  };

  // 숨기기/보이기 토글 처리
  const toggleVisibility = (id) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === id 
          ? { ...report, isVisible: !report.isVisible }
          : report
      )
    );
  };

  // 7단계: 데이터 필터링 및 정렬 로직
  // useMemo를 사용해서 성능을 최적화합니다
  const filteredAndSortedReports = React.useMemo(() => {
    // 1) 먼저 필터링
    let filtered = reports.filter(report => {
      // 카테고리 필터 적용
      const matchesFilter = selectedFilter === '전체' || report.category === selectedFilter;
      
      // 검색어 필터 적용 (신고 제목, 신고 내용, 신고자, 처리자에서 검색)
      const matchesSearch = 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.handler.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    // 2) 정렬 적용
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // 날짜의 경우 Date 객체로 변환해서 비교
      if (sortConfig.key === 'reportDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [reports, selectedFilter, searchTerm, sortConfig]);

  // 8단계: JSX 렌더링
  // 실제 화면에 보여질 HTML 구조를 반환합니다
  return (
    <Layout>
    
    <div className="report-managementHY">
      {/* 페이지 제목 */}
      <div className="page-headerHY">
        <h1>신고 관리</h1>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="controls-sectionHY">
        {/* 검색 박스 */}
        <div className="search-sectionHY">
          <div className="search-boxHY">
            <span className="search-iconHY">🔍</span>
            <input
              type="text"
              placeholder="신고 제목, 내용, 신고자, 처리자로 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-inputHY"
            />
          </div>
        </div>
        <br></br>

        {/* 필터 버튼들 */}
        <div className="filter-sectionHY">
          {filterOptions.map(filter => (
            <button
              key={filter}
              className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 결과 수 표시 */}
      <div className="result-infoHY">
        <span className="result-countHY">
          총 <strong>{filteredAndSortedReports.length}</strong>건
        </span>
      </div>

      {/* 신고 테이블 */}
      <div className="table-containerHY">
        <table className="report-tableHY">
          <thead>
            <tr>
              <th>번호</th>
              <th>
                분류
              </th>
              <th>신고 제목</th>
              <th>신고 내용</th>
              <th>신고자</th>
              <th>처리자</th>
              <th>상태</th>
              <th 
                className="sortableHY"
                onClick={() => handleSort('reportDate')}
              >
                신고일시
                {sortConfig.key === 'reportDate' && (
                  <span className="sort-indicatorHY">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedReports.map(report => (
              <tr key={report.id}>
                <td>{report.number}</td>
                <td>
                  <span className={`category-badge category-${report.category}`}>
                    {report.category}
                  </span>
                </td>
                <td className="title-cellHY">{report.title}</td>
                <td className="content-cellHY">{report.content}</td>
                <td>{report.reporter}</td>
                <td>{report.handler}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td>{formatDate(report.reportDate)}</td>
                <td>
                  <div className="action-buttonsHY">
                    <button 
                      className={`btn-visibility ${report.isVisible ? 'visible' : 'hidden'}`}
                      onClick={() => toggleVisibility(report.id)}
                    >
                      {report.isVisible ? '숨기기' : '보이기'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="paginationHY">
        <button className="page-btn prevHY">이전</button>
        <span className="page-numbersHY">
          <button className="page-btn activeHY">1</button>
          <button className="page-btnHY">2</button>
          <button className="page-btnHY">3</button>
        </span>
        <button className="page-btn nextHY">다음</button>
      </div>
    </div>
    </Layout>
  );
};

export default ReportManagement;