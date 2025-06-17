// src/components/pages/NoticeManagement.jsx

import React, { useState } from 'react';
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import './NoticeManagement.css';


const NoticeManagement = () => {
// + 새 공지사항 버튼 클릭 시 이동할 navigate 함수
    const navigate = useNavigate();

    // 공지사항 등록 클릭 시 모달 창 띄우기 
      const handleNewNotice = () => {
    navigate('/admin/notice/create');
  }

  // ===== 상태 관리 =====
  // 검색 상태. (초기값은 빈 문자열)
  const [searchTerm, setSearchTerm] = useState('');

  // 정렬 상태 (공지사항 올린 작성일 기준 내림차순)
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // 모달관리 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 선택된 공지사항 상태
  const [selectedNotice, setSelectedNotice] = useState(null);



  // ===== 공지사항 더미 데이터 =====
  const [notices, setNotices] = useState([
    {
      id: 1,
      number: 1,
      date: '2024-03-30', // 작성일 
      title: '새로운 클래스 등록 안내', // 제목 
      content: '새로운 클래스 등록 시스템이 업데이트되었습니다. 이제 더욱 간편하게 클래스를 등록하실 수 있으며, 실시간으로 수강생 현황을 확인하실 수 있습니다. 자세한 내용은 사용 가이드를 참고해 주세요.', // 내용 
      isPublished: true, // 게시 여부
      isPinned: true // 상단 고정 여부 
    },
    {
      id: 2,
      number: 2,
      date: '2024-03-29',
      title: '시스템 정기 점검 안내',
      content: '서비스 품질 향상을 위한 정기 점검이 예정되어 있습니다. 점검 시간: 2024년 4월 1일 오전 2시 ~ 6시 (4시간). 점검 중에는 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.',
      isPublished: true,
      isPinned: false
    },
    {
      id: 3,
      number: 3,
      date: '2024-03-28',
      title: '새로운 기능 업데이트',
      content: '사용자 편의성 증대를 위한 새로운 기능들이 추가되었습니다. 실시간 채팅, 화면 공유, 출석 체크 자동화 등의 기능을 새롭게 사용하실 수 있습니다.',
      isPublished: true,
      isPinned: true
    },
    {
      id: 4,
      number: 4,
      date: '2024-03-27',
      title: '수강료 정산 시스템 개선',
      content: '강사님들의 편의를 위해 수강료 정산 시스템이 개선되었습니다. 이제 실시간으로 수강료 현황을 확인하실 수 있으며, 정산 주기도 단축되었습니다.',
      isPublished: false,
      isPinned: false
    },
    {
      id: 5,
      number: 5,
      date: '2024-03-26',
      title: '모바일 앱 출시 예정',
      content: '곧 모바일 애플리케이션이 출시될 예정입니다. iOS 및 Android 지원 예정이며, 웹과 동일한 기능을 모바일에서도 편리하게 이용하실 수 있습니다.',
      isPublished: true,
      isPinned: false
    }
  ]);

  // ===== 헬퍼 함수들 =====
  // 내용 100자 제한 함수
  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // ===== 이벤트 핸들러들 =====
  // 정렬 함수
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 공지사항 상세 모달 열기
  const openNoticeModal = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  // 게시 상태 토글
  const togglePublishStatus = (id) => {
    setNotices(prevNotices =>
      prevNotices.map(notice =>
        notice.id === id
          ? { ...notice, isPublished: !notice.isPublished }
          : notice
      )
    );
  };

  // 핀 상태 토글
  const togglePinStatus = (id) => {
    setNotices(prevNotices =>
      prevNotices.map(notice =>
        notice.id === id
          ? { ...notice, isPinned: !notice.isPinned }
          : notice
      )
    );
  };

  // ===== 필터링 및 정렬 로직 =====
  
  const filteredAndSortedNotices = React.useMemo(() => {
    let filtered = notices.filter(notice => {
      // 검색어 필터링 (제목, 내용)
      const matchesSearch = 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // 핀 고정된 항목들을 먼저 분리
    const pinnedItems = filtered.filter(notice => notice.isPinned);
    const unpinnedItems = filtered.filter(notice => !notice.isPinned);

    // 각각 정렬 적용
    const sortItems = (items) => {
      return items.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // 날짜의 경우 Date 객체로 변환
        if (sortConfig.key === 'date') {
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
    };

    // 핀 고정 
    return [...sortItems(pinnedItems), ...sortItems(unpinnedItems)];
  }, [notices, searchTerm, sortConfig])

  // ===== 렌더링 =====
  return (
    <Layout>
        {/* 페이지 제목 */}
        <div className="page-titleHY">
          <h1>공지사항 관리</h1>
          </div>
          


        {/* 검색 영역 */}
          <div className="search-sectionHY">
            <div className="search-boxHY">
              <span className="search-iconHY">🔍</span>
              <input
                type="text"
                placeholder="제목, 내용으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-inputHY"
              />
            </div>
          </div>
              <div className="right-alignHY">
          <button className="btn-primary new-notice-btnHY" 
          onClick = {handleNewNotice}>
            + 새 공지사항
          </button>
          </div>
        
        
    
    <br />
        {/* 검색 결과 수 */}
          <span className="result-countHY">총 <strong>{filteredAndSortedNotices.length}</strong>건</span>

  

        {/* 공지사항 테이블 */}
        <div className="table-containerHY">
          <table className="tableHY">
            <thead>
              <tr>
                <th className="checkbox-colHY">
                  <input type="checkbox" />
                </th>
                <th>번호</th>
                <th 
                  className="sortableHY"
                  onClick={() => handleSort('date')}
                >
                  작성일
                  {sortConfig.key === 'date' && (
                    <span className="sort-indicatorHY">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>제목</th>
                <th>내용</th>
                <th>게시</th>
                <th>고정</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedNotices.map(notice => (
                <tr key={notice.id} className={notice.isPinned ? 'pinned-row' : ''}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    {notice.isPinned && <span className="pin-iconHY">📌</span>}
                    {notice.number}
                  </td>
                  <td>{formatDate(notice.date)}</td>
                  <td className="title-cellHY">
                    <button 
                      className="title-linkHY"
                      onClick={() => openNoticeModal(notice)}
                    >
                      {notice.title}
                    </button>
                  </td>
                  <td className="content-cellHY">
                    {truncateContent(notice.content)}
                  </td>
                  <td>
                    <button 
                      className={`publish-btnHY ${notice.isPublished ? 'published' : 'unpublished'}`}
                      onClick={() => togglePublishStatus(notice.id)}
                    >
                      {notice.isPublished ? '게시중' : '비게시'}
                    </button>
                  </td>
                  <td>
                    <button 
                      className={`pin-btnHY ${notice.isPinned ? 'pinned' : 'unpinned'}`}
                      onClick={() => togglePinStatus(notice.id)}
                      title={notice.isPinned ? '핀 해제' : '상단 고정'}
                    >
                      📌
                    </button>
                  </td>
                  <td>
                    <div className="action-buttonsHY">
                      <button className="btn-editHY">수정</button>
                      <button className="btn-deleteHY">삭제</button>
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

        {/* 공지사항 상세 모달 */}
        {isModalOpen && selectedNotice && (
          <div className="modal-overlayHY" onClick={closeModal}>
            <div className="modal-contentHY" onClick={(e) => e.stopPropagation()}>
              <div className="modal-headerHY">
                <h2>공지사항 상세</h2>
                <button className="modal-closeHY" onClick={closeModal}>×</button>
              </div>
              
              <div className="modal-bodyHY">
                <div className="notice-detailHY">
                  <div className="detail-itemHY">
                    <label>제목:</label>
                    <span>{selectedNotice.title}</span>
                  </div>
                  
                  <div className="detail-itemHY">
                    <label>작성일:</label>
                    <span>{formatDate(selectedNotice.date)}</span>
                  </div>
                  
                  <div className="detail-itemHY">
                    <label>게시 상태:</label>
                    <span className={`status-badgeHY ${selectedNotice.isPublished ? 'status-published' : 'status-unpublished'}`}>
                      {selectedNotice.isPublished ? '게시중' : '비게시'}
                    </span>
                  </div>
                  
                  <div className="detail-itemHY">
                    <label>상단 고정:</label>
                    <span className={`status-badge ${selectedNotice.isPinned ? 'status-pinned' : 'status-unpinned'}`}>
                      {selectedNotice.isPinned ? '고정됨' : '일반'}
                    </span>
                  </div>
                  
                  <div className="detail-item full-widthHY">
                    <label>내용:</label>
                    <div className="content-displayHY">
                      {selectedNotice.content}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footerHY">
                <button className="btn-secondaryHY" onClick={closeModal}>닫기</button>
                <button className="btn-primaryHY">수정</button>
                <button className="btn-dangerHY">삭제</button>
              </div>
            </div>
          </div>
        )}

    </Layout>
  );
};

export default NoticeManagement;