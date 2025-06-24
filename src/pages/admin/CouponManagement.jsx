import React, { useState, useEffect } from 'react';
import { url } from "/src/config";
import axios from "axios";
import Layout from './Layout';
import CouponCreateModal from './CouponCreateModal'; // 쿠폰 생성모달
import './CouponManagement.css';

const CouponManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [couponType, setCouponType] = useState('전체'); // 발급주체 필터
  const [statusFilter, setStatusFilter] = useState('전체'); // 상태 필터
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponList, setCouponList] = useState([]); // 백엔드 연동 데이터
  const [pageInfo, setPageInfo] = useState({ totalElements: 0 });
  const [loading, setLoading] = useState(false);

  // 쿠폰 목록 불러오기
  useEffect(() => {
    loadCouponList();
    // eslint-disable-next-line
  }, [searchTerm, couponType, statusFilter, startDate, endDate]);

  const loadCouponList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.keyword = searchTerm;
      if (couponType !== '전체') params.couponType = couponType === '관리자' ? 'MG' : 'HT';
      if (statusFilter !== '전체') params.status = statusFilter; // 백엔드에서 status 필터 지원 시
      if (startDate) params.validFrom = startDate;
      if (endDate) params.validUntil = endDate;
      params.size = 50;
      params.page = 0;
      const response = await axios.get(`${url}/api/coupon`, { params });
      setCouponList(response.data.content || []);
      setPageInfo({ totalElements: response.data.totalElements || 0 });
    } catch (error) {
      console.error('쿠폰 목록 로드 실패:', error);
      setCouponList([]);
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
    const dto = {
      couponType: formData.couponType === '관리자' ? 'MG' : 'HT',
      couponCode: formData.couponCode,
      discountType: formData.discountType === '비율' ? 'RT' : 'AMT',
      discount: Number(formData.discountValue),
      issueCount: Number(formData.issueCount),
      validFrom: formData.startDate ? formData.startDate + 'T00:00:00' : null,
      validUntil: formData.endDate ? formData.endDate + 'T23:59:59' : null,
      couponName: '', // 필요시 추가 입력란 구현
      // calendar: null, // 필요시 추가 구현
    };
    try {
      await axios.post(`${url}/api/coupon`, dto);
      setIsModalOpen(false);
      alert('쿠폰이 성공적으로 생성되었습니다!');
      loadCouponList();
    } catch (error) {
      alert('쿠폰 생성에 실패했습니다.');
      console.error('쿠폰 생성 실패:', error);
    }
  };

  // 쿠폰 유형(발급주체) 변경 핸들러
  const handleCouponTypeChange = (type) => {
    setCouponType(type);
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
      else matchesStatus = true;
    }
    return matchesStatus;
  });

  return (
    <Layout>
      <div className="page-titleHY">
        <h1>쿠폰 관리</h1>
        <br />
        <div className="search-sectionHY">
          {/* 검색 박스 */}
          <div className="search-boxHY">
            <span className="search-iconHY">🔍</span>
            <input
              type="text"
              placeholder="쿠폰코드 검색"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-inputHY"
            />
          </div>

          {/* 쿠폰 유효기간 필터 */}
          <label className="date-labelHY">쿠폰 유효 기간</label>
          <input
            type="date"
            className="date-inputHY"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <span className="date-separatorHY">~</span>
          <input
            type="date"
            className="date-inputHY"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />

          {/* 상태 필터 */}
          <div className="status-filter-sectionHY">
            <label className="data-labelHY">상태</label>
            <select
              className="status-filterHY"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="활성">활성</option>
              <option value="만료">만료</option>
            </select>
          </div>
        </div>
        <br />

        {/* 발급주체 필터 버튼과 새 쿠폰 생성 버튼을 같은 줄에 배치 */}
        <div className="filter-and-action-sectionHY">
          <div className="filter-sectionHY">
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
        <span className="result-countHY">
          총 <strong>{pageInfo.totalElements}</strong>건
        </span>

        <div className="table-containerHY">
          <table className="tableHY">
            <thead>
              <tr>
                <th>쿠폰 구분</th>
                <th>유형</th>
                <th>쿠폰코드</th>
                <th>할인</th>
                <th>사용/발급</th>
                <th>쿠폰 시작일</th>
                <th>쿠폰 종료일</th>
                <th>쿠폰 생성일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9">로딩 중...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((coupon, idx) => (
                  <tr key={coupon.couponId || idx}>
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
                        {coupon.status === 'ACTIVE' ? '활성' : coupon.status === 'EXPIRED' ? '만료' : coupon.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">검색 결과가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <CouponCreateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCouponSubmit}
        />
      </div>
    </Layout>
  );
};

export default CouponManagement;