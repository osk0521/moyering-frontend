import React, { useState } from 'react';
// import {url} from "/src/config";
// import axios from "axios"; 
import Layout from './Layout';
// import { useNavigate } from 'react-router-dom';
import CouponCreateModal from './CouponCreateModal'; // 쿠폰 생성모달
import './CouponManagement.css';

const CouponManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [couponType, setCouponType] = useState('전체'); // 발급주체 필터
  const [statusFilter, setStatusFilter] = useState('전체'); // 상태 필터
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // 예시 데이터 (호스트 데이터 추가)
  const couponData = [
    {
      type: '관리자',
      discountType: '비율',
      code: 'WELCOME10',
      discount: '10%',
      usage: '45/400',
      couponStart: '2024-05-01',
      couponEnd: '2024-12-31',
      createdDate: '2024-04-20',
      status: '활성',
    },
    {
      type: '관리자',
      discountType: '비율',
      code: 'SUMMER2023',
      discount: '30%',
      usage: '45/100',
      couponStart: '2023-06-01',
      couponEnd: '2023-08-31',
      createdDate: '2023-05-20',
      status: '만료',
    },
    {
      type: '호스트',
      discountType: '금액',
      code: 'NEWBIE5000',
      discount: '5,000원',
      usage: '123/500',
      couponStart: '2024-01-01',
      couponEnd: '2024-12-31',
      createdDate: '2023-12-15',
      status: '활성',
    },
    {
      type: '관리자',
      discountType: '비율',
      code: 'BLACKFRIDAY',
      discount: '50%',
      usage: '78/200',
      couponStart: '2024-11-25',
      couponEnd: '2024-11-30',
      createdDate: '2024-11-01',
      status: '활성',
    },
    {
      type: '관리자',
      discountType: '금액',
      code: 'FREESHIP',
      discount: '3,000원',
      usage: '200/200',
      couponStart: '2024-03-01',
      couponEnd: '2024-03-31',
      createdDate: '2024-02-25',
      status: '만료',
    },
    {
      type: '호스트',
      discountType: '비율',
      code: 'BIRTHDAY20',
      discount: '20%',
      usage: '12/50',
      couponStart: '2024-07-01',
      couponEnd: '2024-07-31',
      createdDate: '2024-06-15',
      status: '만료',
    },
    {
      type: '관리자',
      discountType: '금액',
      code: 'WELCOME2024',
      discount: '10,000원',
      usage: '67/1000',
      couponStart: '2024-01-01',
      couponEnd: '2024-12-31',
      createdDate: '2023-12-20',
      status: '활성',
    },
    {
      type: '호스트',
      discountType: '비율',
      code: 'STUDENT15',
      discount: '15%',
      usage: '89/300',
      couponStart: '2024-03-01',
      couponEnd: '2024-12-31',
      createdDate: '2024-02-28',
      status: '활성',
    },
    {
      type: '호스트',
      discountType: '금액',
      code: 'TEACHER10K',
      discount: '10,000원',
      usage: '25/100',
      couponStart: '2024-06-01',
      couponEnd: '2024-12-31',
      createdDate: '2024-05-25',
      status: '활성',
    }
  ];

  // 검색 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 새 쿠폰 버튼 생성 핸들러
  const handleNewCoupon = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false); 
  }; 

  // 쿠폰 생성 제출 핸들러
  const handleCouponSubmit = (newCouponData) => {
    console.log('새 쿠폰 데이터:', newCouponData);
    setIsModalOpen(false);
    alert('쿠폰이 성공적으로 생성되었습니다!');
  };

  // 쿠폰 유형(발급주체) 변경 핸들러
  const handleCouponTypeChange = (type) => {
    setCouponType(type);
  };

  // 필터링된 데이터
  const filteredData = couponData.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = couponType === '전체' || coupon.type === couponType; // 발급주체 필터
    const matchesStatus = statusFilter === '전체' || coupon.status === statusFilter; // 상태 필터
    
    // 날짜 필터링 로직
    let matchesDate = true;
    if (startDate && endDate) {
      const couponStartDate = new Date(coupon.couponStart);
      const couponEndDate = new Date(coupon.couponEnd);
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);
      
      matchesDate = (couponStartDate <= filterEndDate) && (couponEndDate >= filterStartDate);
    } else if (startDate) {
      const couponEndDate = new Date(coupon.couponEnd);
      const filterStartDate = new Date(startDate);
      matchesDate = couponEndDate >= filterStartDate;
    } else if (endDate) {
      const couponStartDate = new Date(coupon.couponStart);
      const filterEndDate = new Date(endDate);
      matchesDate = couponStartDate <= filterEndDate;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // 페이지 정보
  const pageInfo = {
    totalElements: filteredData.length
  };

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
              onChange={handleSearch}
              className="search-inputHY"
            />
          </div>

          {/* 쿠폰 유효기간 필터 */}
          <label className="date-labelHY">쿠폰 유효 기간</label>
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

          {/* 상태 필터 */}
          <div className="status-filter-sectionHY">
            <label className="data-labelHY">상태</label>
            <select 
              className="status-filterHY"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              {filteredData.length > 0 ? (
                filteredData.map((coupon, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={`type-badge ${coupon.type === '관리자' ? 'admin' : 'host'}`}>
                        {coupon.type}
                      </span>
                    </td>
                    <td>{coupon.discountType}</td>
                    <td>{coupon.code}</td>
                    <td className="highlight-red">{coupon.discount}</td>
                    <td>{coupon.usage}</td>
                    <td>{coupon.couponStart}</td>
                    <td>{coupon.couponEnd}</td>
                    <td>{coupon.createdDate}</td>
                    <td>
                      <span className={`status-badge ${
                        coupon.status === '활성' ? 'active' : 
                        coupon.status === '만료' ? 'expired' : 'pending'
                      }`}>
                        {coupon.status}
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