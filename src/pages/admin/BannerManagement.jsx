import React, { useState, useEffect } from 'react';
import { url } from "/src/config";
import axios from "axios";
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import './BannerManagement.css';

const BannerManagement = () => {
  const navigate = useNavigate();
  const [bannerList, setBannerList] = useState([]); // 배너 목록
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    totalPages: 1,
    totalElements: 0,
    size: 10,
    first: true,
    last: true
  }); // Spring Boot Pageable 형식
  const [search, setSearch] = useState({
    page: 0,
    keyword: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedBanners, setSelectedBanners] = useState([]); // 체크박스 선택된 배너들

  // 컴포넌트 마운트시 배너 목록 로드
  useEffect(() => {
    loadBannerList();
  }, [search.page, search.keyword]);

  // 배너 목록 API 호출
  const loadBannerList = async () => {
    setLoading(true);
    try {
      const params = {
        page: search.page,
        size: 10,
        sort: 'createdAt,desc'
      };
      
      // 검색어가 있을 때만 keyword 파라미터 추가
      if (search.keyword && search.keyword.trim()) {
        params.keyword = search.keyword.trim();
      }

      const response = await axios.get(`${url}/api/banner`, { params });
      
      setBannerList(response.data.content || []);
      setPageInfo({
        number: response.data.number || 0,
        totalPages: response.data.totalPages || 1,
        totalElements: response.data.totalElements || 0,
        size: response.data.size || 10,
        first: response.data.first || true,
        last: response.data.last || true
      });
    } catch (error) {
      console.error('배너 목록 로드 실패:', error);
      // API가 없을 때 더미 데이터 사용
      setBannerList([
        {
          bannerId: 1,
          bannerCode: 'BN1',
          imageUrl: 'banner1.jpg',
          title: '신규 요리 클래스 오픈',
          content: '배너 내용입니다',
          isHidden: false,
          registerId: 'admin1',
          createdAt: '2024-02-15T10:00:00'
        },
        {
          bannerId: 2,
          bannerCode: 'PU2',
          imageUrl: 'popup2.jpg',
          title: '겨울 특별 할인 이벤트',
          content: '배너 내용입니다',
          isHidden: true,
          registerId: 'admin1',
          createdAt: '2024-02-15T11:00:00'
        },
        {
          bannerId: 3,
          bannerCode: 'BN3',
          imageUrl: 'banner3.jpg',
          title: '도예 클래스 인기 급상승',
          content: '배너 내용입니다',
          isHidden: false,
          registerId: 'admin1',
          createdAt: '2024-02-15T12:00:00'
        },
        {
          bannerId: 4,
          bannerCode: 'BN4',
          imageUrl: 'banner4.jpg',
          title: '봄맞이 새학기 특별 이벤트',
          content: '배너 내용입니다',
          isHidden: false,
          registerId: 'admin2',
          createdAt: '2024-02-28T09:00:00'
        },
        {
          bannerId: 5,
          bannerCode: 'PU5',
          imageUrl: 'popup5.jpg',
          title: '모바일 앱 출시 기념 이벤트',
          content: '배너 내용입니다',
          isHidden: true,
          registerId: 'admin1',
          createdAt: '2024-02-19T14:00:00'
        }
      ]);
      setPageInfo({
        number: 0,
        totalPages: 1,
        totalElements: 5,
        size: 10,
        first: true,
        last: true
      });
    } finally {
      setLoading(false);
    }
  };

  // 검색어 변경
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch({...search, keyword: value, page: 0});
  };

  // 페이지 변경
  const changePage = (newPage) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      setSearch({...search, page: newPage});
    }
  };

  // 배너 등록 페이지로 이동
  const handleRegister = () => {
    navigate('/admin/banner/create');
  };

  // 배너 수정
  const handleEdit = (bannerId) => {
    navigate(`/admin/banner/edit/${bannerId}`);
  };

  // 배너 삭제
  const handleDelete = async (bannerId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    
    try {
      const response = await axios.delete(`${url}/api/banner/${bannerId}`);
      
      if (response.status === 204 || response.status === 200) {
        alert('배너가 삭제되었습니다.');
        loadBannerList();
      }
    } catch (error) {
      console.error('배너 삭제 실패:', error);
      alert('배너 삭제에 실패했습니다.');
    }
  };

  // 배너 숨기기
  const hideBanner = async (bannerId) => {
    try {
      const response = await axios.patch(`${url}/api/banner/${bannerId}/hide`);
      
      if (response.status === 200) {
        alert("배너가 숨겨졌습니다.");
        
        if (response.data) {
          setBannerList(prevList => 
            prevList.map(banner => 
              banner.bannerId === bannerId ? response.data : banner
            )
          );
        } else {
          loadBannerList();
        }
      }
    } catch (error) {
      console.error("배너 숨기기 실패:", error);
      alert("배너 숨기기에 실패했습니다.");
    }
  };

  // 배너 보이기
  const showBanner = async (bannerId) => {
    try {
      const response = await axios.patch(`${url}/api/banner/${bannerId}/show`);
      
      if (response.status === 200) {
        alert("배너가 게시되었습니다.");
        
        if (response.data) {
          setBannerList(prevList => 
            prevList.map(banner => 
              banner.bannerId === bannerId ? response.data : banner
            )
          );
        } else {
          loadBannerList();
        }
      }
    } catch (error) {
      console.error("배너 보이기 실패:", error);
      alert("배너 보이기에 실패했습니다.");
    }
  };

  // 전체 선택/해제
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBanners(bannerList.map(banner => banner.bannerId));
    } else {
      setSelectedBanners([]);
    }
  };

  // 개별 체크박스 선택
  const handleSelectBanner = (bannerId, checked) => {
    if (checked) {
      setSelectedBanners([...selectedBanners, bannerId]);
    } else {
      setSelectedBanners(selectedBanners.filter(id => id !== bannerId));
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 필터링된 데이터
  const filteredData = bannerList.filter(banner => {
    if (!search.keyword) return true;
    const keyword = search.keyword.toLowerCase();
    return banner.title.toLowerCase().includes(keyword) ||
           banner.bannerCode.toLowerCase().includes(keyword);
  });

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const currentPage = pageInfo.number;
    const totalPages = pageInfo.totalPages;
    const maxVisible = 5;
    
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Layout>
      <div className="page-titleHY">
        <h1>배너 관리</h1>
      </div>

      {/* 검색 영역 */}
      <div className="search-sectionHY">
        <div className="search-boxHY">
          <span className="search-iconHY">🔍</span>
          <input
            type="text"
            placeholder="배너/팝업 제목, 등록 ID 검색"
            value={search.keyword}
            onChange={handleSearchChange}
            className="search-inputHY"
          />
        </div>
        <div className="right-alignHY">
          <button className="btn-primary register-btnHY" onClick={handleRegister}>
            + 등록
          </button>
        </div>
      </div>

      <br />

      {/* 검색 결과 수 */}
      <span className="result-countHY">
        총 <strong>{pageInfo.totalElements}</strong>건
      </span>

      {/* 배너 테이블 */}
      <div className="table-containerHY">
        <table className="tableHY banner-table">
          <thead>
            <tr>
              <th className="checkbox-colHY">
                <input 
                  type="checkbox" 
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={selectedBanners.length === bannerList.length && bannerList.length > 0}
                />
              </th>
              <th>ID</th>
              <th>배너 이미지</th>
              <th>제목</th>
              <th>내용</th>
              <th>상태</th>
              <th>등록 ID</th>
              <th>등록일자</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {loading ? '로딩 중...' : '등록된 배너가 없습니다.'}
                </td>
              </tr>
            ) : (
              filteredData.map((banner) => (
                <tr key={banner.bannerId}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedBanners.includes(banner.bannerId)}
                      onChange={(e) => handleSelectBanner(banner.bannerId, e.target.checked)}
                    />
                  </td>
                  <td className="banner-id">{banner.bannerCode}</td>
                  <td className="banner-image">
                    <div className="image-placeholder">
                      <span>이미지</span>
                    </div>
                  </td>
                  <td className="banner-title">{banner.title}</td>
                  <td className="banner-content">{banner.content}</td>
                  <td>
                    {banner.isHidden ? (
                      <button 
                        className="status-toggle status-hidden"
                        onClick={() => showBanner(banner.bannerId)}
                      >
                        숨기기
                      </button>
                    ) : (
                      <button 
                        className="status-toggle status-visible"
                        onClick={() => hideBanner(banner.bannerId)}
                      >
                        보이기
                      </button>
                    )}
                  </td>
                  <td>{banner.registerId}</td>
                  <td>{formatDate(banner.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(banner.bannerId)}
                      >
                        수정
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(banner.bannerId)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {pageInfo.totalPages > 1 && (
        <div className="paginationHY">
          <button 
            className="page-btnHY prev"
            onClick={() => changePage(pageInfo.number - 1)}
            disabled={pageInfo.first}
          >
            이전
          </button>
          <span className="page-numbersHY">
            {getPageNumbers().map(num => (
              <button 
                key={num}
                className={`page-btnHY ${num === pageInfo.number ? 'activeHY' : ''}`}
                onClick={() => changePage(num)}
              >
                {num + 1}
              </button>
            ))}
          </span>
          <button 
            className="page-btnHY next"
            onClick={() => changePage(pageInfo.number + 1)}
            disabled={pageInfo.last}
          >
            다음
          </button>
        </div>
      )}
    </Layout>
  );
};

export default BannerManagement;