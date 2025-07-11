import React, { useState, useEffect } from 'react';
import { url } from "/src/config";
import { myAxios } from '../../config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Layout from './Layout';
import CouponCreateModal from './CouponCreateModal'; // 쿠폰 생성모달
import './CouponManagement.css';

// 수정 모달 컴포넌트
function CouponEditModal({ isOpen, coupon, onClose, onSubmit }) {
  const [formData, setFormData] = useState(coupon || {});
  useEffect(() => { setFormData(coupon || {}); }, [coupon]);
  if (!isOpen) return null;
  const isAdmin = formData.couponType === 'MG' || formData.couponType === '관리자';
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>쿠폰 수정</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">쿠폰 코드</label>
            <input className="form-input" value={formData.couponCode || ''} onChange={e => setFormData({ ...formData, couponCode: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">할인</label>
            <input className="form-input" type="number" value={formData.discount || ''} onChange={e => setFormData({ ...formData, discount: e.target.value })} />
          </div>
          {isAdmin && (
            <>
              <div className="form-group">
                <label className="form-label">발급 매수</label>
                <input className="form-input" type="number" value={formData.issueCount || ''} onChange={e => setFormData({ ...formData, issueCount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">시작일</label>
                <input className="form-input" type="date" value={formData.validFrom ? formData.validFrom.slice(0,10) : ''} onChange={e => setFormData({ ...formData, validFrom: e.target.value + (formData.validFrom && formData.validFrom.length > 10 ? formData.validFrom.slice(10) : 'T00:00:00') })} />
              </div>
              <div className="form-group">
                <label className="form-label">종료일</label>
                <input className="form-input" type="date" value={formData.validUntil ? formData.validUntil.slice(0,10) : ''} onChange={e => setFormData({ ...formData, validUntil: e.target.value + (formData.validUntil && formData.validUntil.length > 10 ? formData.validUntil.slice(10) : 'T23:59:59') })} />
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>취소</button>
          <button className="submit-btn" onClick={() => onSubmit(formData)}>저장</button>
        </div>
      </div>
    </div>
  );
}

const CouponManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [couponType, setCouponType] = useState('전체'); // 발급주체 필터
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState('전체'); // 상태 필터
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponList, setCouponList] = useState([]); // 백엔드 연동 데이터
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0 });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [loading, setLoading] = useState(false); // 누락된 loading state 추가

  // 쿠폰 목록 불러오기
  useEffect(() => {
    loadCouponList();
    // eslint-disable-next-line
  }, [searchTerm, couponType, statusFilter, startDate, endDate, currentPage]); // currentPage 의존성 추가

  const loadCouponList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.keyword = searchTerm;
      if (couponType !== '전체') params.couponType = couponType === '관리자' ? 'MG' : 'HT';
      if (statusFilter !== '전체') params.status = statusFilter; // 백엔드에서 status 필터 지원 시
      if (startDate) params.validFrom = startDate;
      if (endDate) params.validUntil = endDate;
      params.size = 20; // 백엔드에서 20개씩 처리한다고 하셨으니 20으로 변경
      params.page = currentPage;
      
      const response = await axios.get(`${url}/api/coupon`, { params });
      setCouponList(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      setPageInfo({ totalElements: response.data.totalElements || 0 });
    } catch (error) {
      console.error('쿠폰 목록 로드 실패:', error);
      setCouponList([]);
      setTotalPages(0);
      setTotalElements(0);
      setPageInfo({ totalElements: 0 });
    } finally {
      setLoading(false);
    }
  };

  // 새 쿠폰 버튼 생성 핸들러
  const handleNewCoupon = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 쿠폰 생성 제출 핸들러 (백엔드 연동)
  const handleCouponSubmit = async (formData) => {
    // 프론트 formData -> AdminCouponDto 변환
    const isAdmin = formData.couponType === '관리자';
    const dto = {
      couponType: isAdmin ? 'MG' : 'HT',
      couponCode: formData.couponCode,
      discountType: formData.discountType === '비율' ? 'RT' : 'AMT',
      discount: Number(formData.discountValue),
    };
    if (isAdmin) {
      dto.issueCount = Number(formData.issueCount);
      dto.validFrom = formData.startDate ? formData.startDate + 'T00:00:00' : null;
      dto.validUntil = formData.endDate ? formData.endDate + 'T23:59:59' : null;
    }
    try {
      await axios.post(`${url}/api/coupon`, dto);
      setIsModalOpen(false);
      alert('쿠폰이 성공적으로 생성되었습니다!');
      setCurrentPage(0); // 첫 페이지로 이동
      loadCouponList();
    } catch (error) {
      alert('쿠폰 생성에 실패했습니다.');
      console.error('쿠폰 생성 실패:', error);
    }
  };

  // 쿠폰 유형(발급주체) 변경 핸들러
  const handleCouponTypeChange = (type) => {
    setCouponType(type);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
  };

  // 상태 필터 변경 핸들러
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  // 날짜 필터 변경 핸들러
  const handleDateChange = (type, value) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setCurrentPage(0); // 날짜 변경 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 필터링(프론트에서 추가 필터 필요시)
  const filteredData = couponList.filter(coupon => {
    // 상태 필터(프론트에서 추가 필터링)
    let matchesStatus = true;
    if (statusFilter !== '전체') {
      if (statusFilter === '활성') matchesStatus = coupon.status === 'ACTIVE' || coupon.status === '활성';
      else if (statusFilter === '만료') matchesStatus = coupon.status === 'EXPIRED' || coupon.status === '만료';
      else if (statusFilter === '예정') matchesStatus = coupon.status === 'SCHEDULED' || coupon.status === '예정';
      else matchesStatus = true;
    }
    return matchesStatus;
  });

  // 쿠폰 수정 핸들러 (모달 오픈)
  const handleEditCoupon = (coupon) => {
    setEditCoupon(coupon);
    setEditModalOpen(true);
  };

  // 쿠폰 수정 저장 핸들러 (PUT)
  const handleEditCouponSubmit = async (formData) => {
    try {
      await axios.put(`${url}/api/coupon/${formData.couponId}`, formData);
      setEditModalOpen(false);
      setEditCoupon(null);
      alert('쿠폰이 수정되었습니다.');
      loadCouponList();
    } catch (error) {
      alert('쿠폰 수정에 실패했습니다.');
      console.error('쿠폰 수정 실패:', error);
    }
  };

  // 쿠폰 삭제 핸들러 (API 연동)
  const handleDeleteCoupon = async (coupon) => {
    if (!window.confirm(`정말 삭제하시겠습니까? (쿠폰코드: ${coupon.couponCode})`)) return;
    try {
      await axios.delete(`${url}/api/coupon/${coupon.couponId}`, { data: coupon });
      alert('쿠폰이 삭제되었습니다.');
      loadCouponList();
    } catch (error) {
      alert('쿠폰 삭제에 실패했습니다.');
      console.error('쿠폰 삭제 실패:', error);
    }
  };

  // 페이지네이션 컴포넌트
  const renderPagination = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;
    
    // 시작 페이지와 끝 페이지 계산
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // 끝 페이지 기준으로 시작 페이지 재조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // 이전 페이지 버튼
    if (currentPage > 0) {
      pageButtons.push(
        <button 
          key="prev" 
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn"
        >
          이전
        </button>
      );
    }

    // 페이지 번호 버튼들
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages - 1) {
      pageButtons.push(
        <button 
          key="next" 
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn"
        >
          다음
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <Layout>
      <div className="page-titleHY">
        <h1>쿠폰 관리</h1>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="search-sectionHY">
        <div className="search-boxHY">
          <input
            type="text"
            placeholder="쿠폰코드 검색"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-inputHY"
          />
        </div>
        <div className="date-filter-group">
          <label className="date-labelHY">쿠폰 유효 기간</label>
          <input
            type="date"
            className="date-inputHY"
            value={startDate}
            onChange={e => handleDateChange('start', e.target.value)}
          />
          <span className="date-separatorHY">~</span>
          <input
            type="date"
            className="date-inputHY"
            value={endDate}
            onChange={e => handleDateChange('end', e.target.value)}
          />
        </div>
      </div>

      {/* 필터 버튼들과 새 쿠폰 생성 버튼 */}
      <div className="filter-and-action-sectionHY">
        <div className="filter-sectionHY">
          {/* 상태 필터 */}
          <select
            className="status-filterHY"
            value={statusFilter}
            onChange={e => handleStatusFilterChange(e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="활성">활성</option>
            <option value="예정">예정</option>
            <option value="만료">만료</option>
          </select>

          {/* 발급주체 필터 */}
          {['전체', '관리자', '호스트'].map(type => (
            <button
              key={type}
              className={`filter-btnHY ${couponType === type ? 'active' : ''}`}
              onClick={() => handleCouponTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="right-alignHY">
          <button className="btn-primary new-notice-btnHY" onClick={handleNewCoupon}>
            + 새 쿠폰 생성
          </button>
        </div>
      </div>

      {/* 검색 결과 수 */}
      <div className="result-countHY">
        총 <strong>{pageInfo.totalElements}</strong>건
      </div>

      <div className="table-containerHY">
        <table className="tableHY">
          <thead>
            <tr>
              <th>No</th>
              <th>쿠폰 ID</th>
              <th>쿠폰 구분</th>
              <th>유형</th>
              <th>쿠폰코드</th>
              <th>할인</th>
              <th>사용/발급</th>
              <th>쿠폰 시작일</th>
              <th>쿠폰 종료일</th>
              <th>쿠폰 생성일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="11">로딩 중...</td></tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((coupon, idx) => (
                <tr key={coupon.couponId || idx}>
                  <td>{(currentPage * pageSize) + idx + 1}</td>
                  <td>{coupon.couponId}</td>
                  <td>
                    <span className={`type-badge ${coupon.couponType === 'MG' ? 'admin' : 'host'}`}>
                      {coupon.couponType === 'MG' ? '관리자' : '호스트'}
                    </span>
                  </td>
                  <td>{coupon.discountType === 'RT' ? '비율' : '금액'}</td>
                  <td>{coupon.couponCode}</td>
                  <td className="highlight-red">{coupon.discountType === 'RT' ? `${coupon.discount}%` : `${coupon.discount.toLocaleString()}원`}</td>
                  <td>
                    <span className={
                      coupon.issueCount > 0 && coupon.usedCount / coupon.issueCount >= 0.8
                        ? 'usage-badge danger'
                        : coupon.issueCount > 0 && coupon.usedCount / coupon.issueCount >= 0.5
                        ? 'usage-badge warning'
                        : 'usage-badge normal'
                    }>
                      {coupon.usedCount}/{coupon.issueCount}
                    </span>
                  </td>
                  <td>{formatDate(coupon.validFrom)}</td>
                  <td>{formatDate(coupon.validUntil)}</td>
                  <td>{formatDate(coupon.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${coupon.status === 'ACTIVE' ? 'active' : coupon.status === 'EXPIRED' ? 'expired' : 'pending'}`}>
                      {coupon.status === 'SCHEDULED' ? '예정' : coupon.status === 'ACTIVE' ? '활성' : coupon.status === 'EXPIRED' ? '만료' : coupon.status}
                    </span>
                  </td>
                  <td className="manage-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditCoupon(coupon)}
                    >수정</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCoupon(coupon)}
                    >삭제</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="no-data">검색 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination-containerHY">
          <div className="pagination">
            {renderPagination()}
          </div>
        </div>
      )}

      <CouponCreateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCouponSubmit}
      />
      <CouponEditModal
        isOpen={editModalOpen}
        coupon={editCoupon}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditCouponSubmit}
      />
    </Layout>
  );
};

export default CouponManagement;