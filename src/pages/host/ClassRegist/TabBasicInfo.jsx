import { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import './TabBasicInfo.css';

const TabBasicInfo = ({ registerValidator }) => {
  const categoryMap = {
    '스포츠': ['실내 & 수상 스포츠', '실외 스포츠', '기타'],
    '음식': ['베이킹', '음료', '요리', '기타'],
    '공예/DIY': ['가죽', '도자기', '플라워', '비누/향수/캔들', '악세사리', '기타'],
    '뷰티': ['네일/패디', '마사지/스파', '헤어/메이크업', '기타'],
    '문화예술': ['미술', '연기', '노래/악기/작곡', '사진/영상', '기타'],
    '심리/상담': ['사주/타로', '심리검사', '명상', '기타'],
    '자유모임': ['여행', '게임', '파티', '기타']
  };

  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [className, setClassName] = useState('');

  const handlePrimaryChange = (e) => {
    const selected = e.target.value;
    setPrimary(selected);
    setSecondary('');
  };

  const handleAddressSelect = (data) => {
    setAddress(data.address);
    setCoordinates({ lat: '12.3456', lng: '12.3456' }); // 임시 좌표
    setShowLocation(false);
  };

  // 유효성 검사 함수 (필수 항목: 1차카테고리, 2차카테고리, 클래스 명, 주소)
  const validate = () => {
    if (!primary) return false;
    if (!secondary) return false;
    if (!className.trim()) return false;
    if (!address) return false;
    return true;
  };

  // 부모 컴포넌트에 유효성 검사 함수 등록
  useEffect(() => {
    registerValidator(0, validate);
  }, [primary, secondary, className, address]);

  const secondaryOptions = categoryMap[primary] || [];

    return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">기본정보</h3>
      <div className="KHJ-form-section">
        <div className="KHJ-inline-form-row">
          <label className="KHJ-category-label"><span className="KHJ-required-text-dot">*</span>카테고리</label>
          <div className="KHJ-category-row">
            <div className="KHJ-form-group">
              <label className="KHJ-sub-label">1차카테고리</label>
              <select value={primary} onChange={handlePrimaryChange}>
                <option value="" disabled hidden>1차 카테고리 선택</option>
                {Object.keys(categoryMap).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className="KHJ-form-group">
              <label className="KHJ-sub-label">2차카테고리</label>
              <select value={secondary} onChange={(e) => setSecondary(e.target.value)} disabled={!primary}>
                <option value="" disabled hidden>2차카테고리 선택</option>
                {secondaryOptions.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="KHJ-form-section">
        <label className="KHJ-class-label"><span className="KHJ-required-text-dot">*</span>클래스 명</label>
        <input
          type="text"
          placeholder="클래스명을 입력해주세요."
          className="KHJ-class-input"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>
      <hr />

      <div className="KHJ-form-section">
        <label className="KHJ-label">
          장소 <span className="KHJ-required-text"><span className="KHJ-required-text-dot">*</span> 진행장소</span>
        </label>

        {!address ? (
          <div className="KHJ-location-add-wrapper">
            <div className="KHJ-location-relative">
              <button className="KHJ-location-add-btn" onClick={() => setShowLocation(true)}>
                장소 등록
              </button>

              {showLocation && (
                <div className="KHJ-postcode-popup">
                  <DaumPostcode onComplete={handleAddressSelect} />
                  <button className="KHJ-postcode-close-btn" onClick={() => setShowLocation(false)}>닫기</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="KHJ-location-wrapper">
            <div className="KHJ-location-close-absolute">
              <button
                className="KHJ-location-remove-btn"
                onClick={() => {
                  setAddress('');
                  setCoordinates({ lat: '', lng: '' });
                }}
              >
                ×
              </button>
            </div>
            <div className="KHJ-location-box">
              <table className="KHJ-location-table">
                <tbody>
                  <tr>
                    <td className="KHJ-location-label">주소</td>
                    <td>{address}</td>
                  </tr>
                  <tr>
                    <td className="KHJ-location-label">좌표</td>
                    <td>위도 : {coordinates.lat} &nbsp;&nbsp;&nbsp; 경도 : {coordinates.lng}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default TabBasicInfo;
