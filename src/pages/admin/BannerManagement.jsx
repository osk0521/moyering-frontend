import React, { useState, useEffect } from 'react';
import { url } from "/src/config";
import axios from "axios";
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import './BannerManagement.css';
import BannerCreateModal from './BannerCreateModal';

const BannerManagement = () => {
  const navigate = useNavigate();
  const [bannerList, setBannerList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    totalPages: 1,
    totalElements: 0,
    size: 20,
    first: true,
    last: true
  });
  const [search, setSearch] = useState({
    page: 0,
    keyword: ''
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    loadBannerList();
  }, [search.page, search.keyword]);

  const loadBannerList = async () => {
    setLoading(true);
    try {
      const params = {
        page: search.page,
        size: 20,
        sort: 'createdAt,desc'
      };
      
      if (search.keyword && search.keyword.trim()) {
        params.keyword = search.keyword.trim();
      }

      console.log('배너 목록 로드 요청:', params);
      const response = await axios.get(`${url}/api/banner`, { params });
      console.log('배너 목록 응답:', response.data);
      
      let banners = [];
      if (response.data.content) {
        banners = response.data.content;
      } else if (Array.isArray(response.data)) {
        banners = response.data;
      }
      
      setBannerList(banners);
      setPageInfo({
        number: response.data.number || 0,
        totalPages: response.data.totalPages || 1,
        totalElements: response.data.totalElements || banners.length,
        size: response.data.size || 20,
        first: response.data.first || true,
        last: response.data.last || true
      });
      
    } catch (error) {
      console.error('배너 목록 로드 실패:', error);
      alert('배너 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch({...search, keyword: value, page: 0});
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      setSearch({...search, page: 0});
      loadBannerList();
    }
  };

  const changePage = (newPage) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      setSearch({...search, page: newPage});
    }
  };

  // 배너 등록 모달 열기
  const handleRegister = () => {
    console.log('배너 등록 모달 열기');
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  // 배너 수정 모달 열기
  const handleEdit = (bannerId) => {
    console.log('배너 수정 모달 열기:', bannerId);
    
    const bannerToEdit = bannerList.find(banner => 
      (banner.bannerId || banner.id) === bannerId
    );
    
    if (bannerToEdit) {
      console.log('수정할 배너 정보:', bannerToEdit);
      setEditingBanner(bannerToEdit);
      setIsModalOpen(true);
    } else {
      alert('수정할 배너를 찾을 수 없습니다.');
    }
  };

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

  const toggleBannerStatus = async (bannerId, currentStatus) => {
    try {
      let endpoint = '';
      let statusText = '';
      
      if (currentStatus === 1) {
        endpoint = `${url}/api/banner/${bannerId}/hide`;
        statusText = '숨김';
      } else {
        // 보이기 전에 현재 보이는 배너 개수 확인
        const visibleBanners = bannerList.filter(banner => 
          banner.status === 1 || banner.status === null
        );
        
        if (visibleBanners.length >= 10) {
          alert('보이는 배너는 최대 10개까지만 가능합니다.\n다른 배너를 먼저 숨긴 후 시도해주세요.');
          return;
        }
        
        endpoint = `${url}/api/banner/${bannerId}/show`;
        statusText = '보임';
      }
      
      const response = await axios.patch(endpoint);
      if (response.status === 200) {
        alert(`배너가 ${statusText} 처리되었습니다.`);
        await loadBannerList();
      }
    } catch (error) {
      console.error('배너 상태 변경 실패:', error);
      alert('배너 상태 변경에 실패했습니다.');
    }
  };

  // 모달에서 배너 저장 처리
  const handleSave = async (saveData) => {
    console.log('handleSave 호출됨:', saveData);
    console.log('수정 모드:', !!editingBanner);
    
    try {
      // 등록 모드에서만 10개 제한 체크
      if (!editingBanner) {
        const visibleBanners = bannerList.filter(banner => 
          banner.status === 1 || banner.status === null
        );
        
        console.log('현재 보이는 배너 개수:', visibleBanners.length);
        
        if (visibleBanners.length >= 10) {
          alert('보이는 배너는 최대 10개까지만 가능합니다.\n기존 배너를 먼저 숨긴 후 새 배너를 등록해주세요.');
          return;
        }
      }
      
      const formData = new FormData();
      formData.append('title', saveData.title);
      formData.append('content', saveData.content);
      
      if (editingBanner) {
        // 수정 모드
        const response = await axios.put(`${url}/api/banner/${editingBanner.bannerId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        console.log('배너 수정 성공:', response.data);
        alert('배너가 수정되었습니다.');
      } else {
        // 등록 모드: 기본적으로 숨김 상태로 등록 (나중에 선택적으로 보이기)
        formData.append('status', '0'); // 0 = 숨김 상태
        
        if (saveData.image) {
          formData.append('ifile', saveData.image);
        } else {
          alert('이미지를 선택해주세요.');
          return;
        }
        
        const response = await axios.post(`${url}/api/banner/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        console.log('배너 등록 성공:', response.data);
        alert('배너가 등록되었습니다.');
      }
      
      setIsModalOpen(false);
      setEditingBanner(null);
      await loadBannerList();

    } catch (error) {
      console.error('배너 저장 실패:', error);
      
      let errorMessage = editingBanner ? '수정 실패!' : '등록 실패!';
      if (error.response?.status === 400) {
        const backendMessage = error.response.data?.message;
        if (backendMessage) {
          errorMessage = backendMessage;
        } else {
          errorMessage = '요청이 올바르지 않습니다.';
        }
      }
      alert(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const getBannerImageUrl = (filename) => {
    if (!filename) return null;
    // 컨트롤러의 이미지 서빙 경로로 요청
    const imageUrl = `${url}/api/banner/uploads/${filename}`;
    console.log('이미지 URL:', imageUrl); // 디버깅용
    return imageUrl;
  };
  

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
      <br />

      <div className="search-sectionHY">
        <div className="search-boxHY">
          <span className="search-iconHY">🔍</span>
          <input
            type="text"
            placeholder="배너 제목, 내용 검색"
            value={search.keyword}
            onChange={handleSearchChange}
            onKeyPress={handleSearchSubmit}
            className="search-inputHY"
          />
        </div>
        <div className="right-alignHY">
          <button className="btn-primary register-btnHY" onClick={handleRegister}>
            + 배너 등록
          </button>
        </div>
      </div>

      <br />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span className="result-countHY">
          총 <strong>{pageInfo.totalElements}</strong>건
        </span>
        <span style={{ 
          color: bannerList.filter(banner => 
            banner.status === 1 || banner.status === null
          ).length >= 10 ? '#e74c3c' : '#27ae60',
          fontWeight: 'bold'
        }}>
          보이는 배너: <strong>
            {bannerList.filter(banner => 
              banner.status === 1 || banner.status === null
            ).length}
          </strong>/10개
        </span>
      </div>

      <div className="table-containerHY">
        <table className="tableHY banner-table">
          <thead>
            <tr>
              <th>배너 ID</th>
              <th>배너 이미지</th>
              <th>제목</th>
              <th>내용</th>
              <th>상태</th>
              <th>등록일자</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {bannerList.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {loading ? '로딩 중...' : '등록된 배너가 없습니다.'}
                </td>
              </tr>
            ) : (
              bannerList.map((banner, index) => {
                const visibleCount = bannerList.filter(b => b.status === 1 || b.status === null).length;
                const isCurrentVisible = banner.status === 1 || banner.status === null;
                const canShow = isCurrentVisible || visibleCount < 10;
                
                return (
                <tr key={banner.bannerId || banner.id || index}>
                  <td className="banner-id">{banner.bannerId || banner.id}</td>
    
            <td className="banner-image">
              {banner.bannerImg ? (
                <img 
                  src={getBannerImageUrl(banner.bannerImg)} 
                  alt={banner.title}
                  style={{width: '60px', height: '40px', objectFit: 'cover'}}
                  onError={(e) => {
                    console.error('이미지 로드 실패:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  <span>이미지 없음</span>
                </div>
              )}
            </td>
                  <td className="banner-title">{banner.title}</td>
                  <td className="banner-content">{banner.content}</td>
                  <td>
                    <button 
                      className={`status-toggle ${isCurrentVisible ? 'status-visible' : 'status-hidden'}`}
                      onClick={() => toggleBannerStatus(banner.bannerId || banner.id, banner.status)}
                      disabled={!canShow && !isCurrentVisible}
                      style={{
                        opacity: (!canShow && !isCurrentVisible) ? 0.5 : 1,
                        cursor: (!canShow && !isCurrentVisible) ? 'not-allowed' : 'pointer'
                      }}
                      title={(!canShow && !isCurrentVisible) ? '보이는 배너가 10개를 초과하여 비활성화됨' : ''}
                    >
                      {isCurrentVisible ? '숨기기' : '보이기'}
                    </button>
                  </td>
                  <td>{formatDate(banner.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(banner.bannerId || banner.id)}
                      >
                        수정
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(banner.bannerId || banner.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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

      {isModalOpen && (
        <BannerCreateModal
          banner={editingBanner}
          isEditMode={!!editingBanner}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBanner(null);
          }}
        />
      )}
    </Layout>
  );
};

export default BannerManagement;