import React, { useState } from 'react';
import './CouponCreateModal.css';

const CouponCreateModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    couponCode: '',
    couponType: '강사', // 관리자, 강사
    discountType: '비율', // 금액, 비율
    discountValue: '',
    issueCount: '',
    startDate: '',
    endDate: ''
  });

  // 자동 생성 쿠폰 코드 생성
  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, couponCode: result });
  };

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    // 유효성 검사
    if (!formData.couponCode || !formData.discountValue || !formData.issueCount || !formData.startDate || !formData.endDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 부모 컴포넌트에 데이터 전달
    onSubmit(formData);
    
    // 폼 초기화
    setFormData({
      couponCode: '',
      couponType: '강사',
      discountType: '비율',
      discountValue: '',
      issueCount: '',
      startDate: '',
      endDate: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>쿠폰 생성</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* 쿠폰 코드 */}
          <div className="form-group">
            <label className="form-label">쿠폰 코드</label>
            <div className="input-with-button">
              <input
                type="text"
                className="form-input"
                value={formData.couponCode}
                onChange={(e) => handleInputChange('couponCode', e.target.value)}
                placeholder="YRJS9J15"
              />
              <button className="generate-btn" onClick={generateCouponCode}>
                🔄 자동 생성
              </button>
            </div>
            <small className="form-hint">영문 대문자와 숫자만 사용 가능합니다</small>
          </div>

          {/* 쿠폰 구분 */}
          <div className="form-group">
            <label className="form-label">쿠폰 구분</label>
            <div className="coupon-type-toggle">
              <span className="toggle-label">H</span>
              <span className="toggle-label">S</span>
            </div>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  name="couponType"
                  value="관리자"
                  checked={formData.couponType === '관리자'}
                  onChange={(e) => handleInputChange('couponType', e.target.value)}
                />
                관리자
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="couponType"
                  value="강사"
                  checked={formData.couponType === '강사'}
                  onChange={(e) => handleInputChange('couponType', e.target.value)}
                />
                강사
              </label>
            </div>
          </div>

          {/* 할인 유형 */}
          <div className="form-group">
            <label className="form-label">할인 유형</label>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  name="discountType"
                  value="금액"
                  checked={formData.discountType === '금액'}
                  onChange={(e) => handleInputChange('discountType', e.target.value)}
                />
                금액
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="discountType"
                  value="비율"
                  checked={formData.discountType === '비율'}
                  onChange={(e) => handleInputChange('discountType', e.target.value)}
                />
                비율
              </label>
            </div>
            <small className="form-hint">할인 유형 &gt; 금액 클릭하면 '금액'으로 변경</small>
          </div>

          {/* 할인율 */}
          <div className="form-group">
            <label className="form-label">할인율</label>
            <div className="input-with-icon">
              <span className="input-icon">김</span>
              <input
                type="number"
                className="form-input"
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', e.target.value)}
                placeholder="020"
              />
              <span className="input-suffix">%</span>
            </div>
          </div>

          {/* 발급 수량 */}
          <div className="form-group">
            <label className="form-label">발급 수량</label>
            <div className="input-with-icon">
              <span className="input-icon">김</span>
              <input
                type="number"
                className="form-input"
                value={formData.issueCount}
                onChange={(e) => handleInputChange('issueCount', e.target.value)}
                placeholder="80"
              />
            </div>
          </div>

          {/* 시작일 / 종료일 */}
          <div className="form-group">
            <div className="date-row">
              <div className="date-field">
                <label className="form-label">시작일</label>
                <input
                  type="date"
                  className="form-input date-input"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div className="date-field">
                <label className="form-label">종료일</label>
                <input
                  type="date"
                  className="form-input date-input"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
            <div className="date-center-icon">
              <span className="input-icon">김</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCreateModal;