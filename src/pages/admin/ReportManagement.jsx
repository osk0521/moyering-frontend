import React, { useState } from 'react';
import Layout from "./Layout";
import './ReportManagement.css';

const ReportManagement = () => {
  
  // 검색어 상태 - 사용자가 입력한 검색어를 저장
  const [searchTerm, setSearchTerm] = useState('');
  
  // 선택된 필터 상태 - 어떤 카테고리가 선택되었는지 저장
  const [selectedFilter, setSelectedFilter] = useState('전체');
  
  // 정렬 설정 상태 - 테이블의 정렬 방식을 저장
  const [sortConfig, setSortConfig] = useState({ 
    key: 'reportDate', 
    direction: 'desc' 
  });

  // 더미 데이터 생성

  const [reports, setReports] = useState([
    {
      id: 1,
      number: 1,
      category: '게시글',
      title: '부적절한 글 게시',
      content: '게시글 내용에 욕설과 비방이 포함되어 있습니다',
      reporter: 'user2',
      handler: 'admin12',
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
      handler: 'admin12',
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
      handler: 'admin12',
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
      handler: 'admin12',
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
      handler: 'admin12',
      status: '처리됨',
      reportDate: '2023-05-12 16:40:12',
      isVisible: false
    },
    {
      id: 7,
      number: 7,
      category: '게시글',
      title: '스팸성 홍보 게시글',
      content: '상업적 목적의 광고성 게시글이 반복 게시되고 있습니다',
      reporter: 'user5',
      handler: 'admin12',
      status: '처리됨',
      reportDate: '2023-05-14 09:15:22',
      isVisible: true
     },
     {
      id: 8,
      number: 8,
      category: '댓글',
      title: '허위정보 유포',
      content: '잘못된 정보를 담은 댓글이 작성되었습니다',
      reporter: 'user7',
      handler: 'admin12',
      status: '대기중',
      reportDate: '2023-05-14 11:30:45',
      isVisible: true
     },
     {
      id: 9,
      number: 9,
      category: '사용자',
      title: '부적절한 프로필 이미지',
      content: '선정적인 프로필 사진을 사용하고 있습니다',
      reporter: 'user3',
      handler: 'admin2',
      status: '처리됨',
      reportDate: '2023-05-13 20:45:17',
      isVisible: false
     },
     {
      id: 10,
      number: 10,
      category: '게시글',
      title: '저작권 침해 의심',
      content: '타인의 저작물을 무단으로 사용한 게시글입니다',
      reporter: 'user8',
      handler: 'admin1',
      status: '처리됨',
      reportDate: '2023-05-14 13:22:08',
      isVisible: true
     },
     {
      id: 11,
      number: 11,
      category: '댓글',
      title: '개인정보 노출',
      content: '댓글에 전화번호와 주소가 공개되었습니다',
      reporter: 'user1',
      handler: 'admin3',
      status: '처리됨',
      reportDate: '2023-05-12 08:12:55',
      isVisible: true
     },
     {
      id: 12,
      number: 12,
      category: '기타',
      title: '서비스 이용 방해',
      content: '시스템을 악용하여 서비스 이용을 방해하고 있습니다',
      reporter: 'user6',
      handler: 'admin12',
      status: '처리됨',
      reportDate: '2023-05-14 15:10:33',
      isVisible: true
     },
     {
      id: 13,
      number: 13,
      category: '사용자',
      title: '닉네임 부적절',
      content: '혐오 표현이 포함된 닉네임을 사용하고 있습니다',
      reporter: 'user4',
      handler: 'admin2',
      status: '처리됨',
      reportDate: '2023-05-14 07:55:41',
      isVisible: false
     },
     {
      id: 14,
      number: 14,
      category: '게시글',
      title: '사기 의심 게시글',
      content: '허위 판매 게시글로 사용자들을 속이려 합니다',
      reporter: 'user9',
      handler: 'admin1',
      status: '처리됨',
      reportDate: '2023-05-13 12:35:19',
      isVisible: true
     },
     {
      id: 15,
      number: 15,
      category: '댓글',
      title: '반복적인 도배',
      content: '같은 내용의 댓글을 여러 게시글에 반복 작성',
      reporter: 'user10',
      handler: 'admin12',
      status: '처리됨',
      reportDate: '2023-05-14 16:20:07',
      isVisible: true
     },
     {
      id: 16,
      number: 16,
      category: '기타',
      title: '해킹 시도',
      content: '계정 해킹을 시도하는 의심스러운 활동 발견',
      reporter: 'user2',
      handler: 'admin3',
      status: '처리됨',
      reportDate: '2023-05-14 18:45:52',
      isVisible: false
     }
  ]);

  // 필터 옵션 정의
  // 필터 버튼에 표시될 카테고리들을 배열로 정의
  const filterOptions = ['전체', '게시글', '댓글', '사용자', '기타'];

  // 헬퍼 함수들 (Helper Functions)
  // 날짜 포맷팅 함수 - 날짜를 한국어 형식으로 변환
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  // 상태에 따른 CSS 클래스 반환 함수
  const getStatusClass = (status) => {
    const statusMap = {
      '대기중': 'status-receivedHY',
      '처리됨': 'status-completedHY',
    };
    return statusMap[status] || '';
  };

  // 벤트 핸들러 함수들
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

  // 데이터 필터링 및 정렬 로직
  const filteredAndSortedReports = React.useMemo(() => {
    // 필터링
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

    // 정렬 적용
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

  // JSX 렌더링
  return (
    <Layout>
      {/* 페이지 제목 */}
      <div className="page-titleHY">
        <h1>신고 관리</h1>
      </div>

      {/* 검색 및 필터 영역 */}
        {/* 검색 박스 */}
        <div className="search-sectionHY">
          <div className="search-boxHY">
            <input
              type="text"
              placeholder="신고 제목, 내용, 신고자, 처리자로 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-inputHY"
            />
          </div>
        </div>
   

        {/* 필터 버튼들 */}
        <div className="filter-sectionHY">
          {filterOptions.map(filter => (
            <button
              key={filter}
              className={`filter-btnHY ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
  
      {/* 검색 결과 수 표시 */}
          총 <strong>{filteredAndSortedReports.length}</strong>건
        
   

      {/* 신고 테이블 */}
      <div className="table-containerHY">
        <table className="tableHY">
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
                  <span className={`status-badgeHY ${getStatusClass(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td>{formatDate(report.reportDate)}</td>
                <td>
                  <div className="action-buttonsHY">
                    <button 
                      className={`btn-visibilityHY ${report.isVisible ? 'visible' : 'hidden'}`}
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


 
    </Layout>
  );
};

export default ReportManagement;