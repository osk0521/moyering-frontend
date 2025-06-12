import { useEffect, useState } from 'react';
import './TabExtraInfo.css';

const TabExtraInfo = ({ registerValidator }) => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [coupon, setCoupon] = useState('');
  const [selectedCouponInfo, setSelectedCouponInfo] = useState([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTags(value.split(','));
  };

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  const validate = () => {
    if (!file) return false;
    if (tags.length === 0) return false;
    if (!keywords.trim()) return false;
    if (!coupon.trim()) return false;
    return true;
  };

  useEffect(() => {
    registerValidator(3, validate);
  }, [file, tags, keywords, coupon]);

  const dummyCoupons = [
    { code: 'FIRST100', name: '첫 수업 할인', discount: '10%', valid: '2025.6.1 ~ 2025.6.3' },
    { code: 'RETURN15', name: '재등록 할인', discount: '₩15,000', valid: '상시' },
  ];

  const toggleCouponSelection = (code) => {
    const existing = selectedCoupons.find(c => c.code === code);
    if (existing) {
      setSelectedCoupons(selectedCoupons.filter(c => c.code !== code));
    } else {
      const found = dummyCoupons.find(c => c.code === code);
      setSelectedCoupons([...selectedCoupons, { ...found, customName: '', count: 1 }]);
    }
  };

  const updateCouponField = (code, field, value) => {
    setSelectedCoupons(prev =>
      prev.map(c => c.code === code ? { ...c, [field]: value } : c)
    );
  };

  const handleCouponApply = () => {
    const validCoupons = selectedCoupons.filter(c => c.customName.trim() && c.count > 0);
    if (validCoupons.length > 0) {
      setCoupon(validCoupons.map(c => c.code).join(','));
      setSelectedCouponInfo(validCoupons);
      setIsCouponModalOpen(false);
    }
  };
return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">클래스 부가정보</h3>

      <div className="KHJ-form-section">
        <label className="KHJ-file-label"><span className="KHJ-required-text-dot">*</span>클래스 강의자료</label>
        <div className="KHJ-file-upload-container">
          {file ? (
            <span>{file.name}</span>
          ) : (
            <span className="KHJ-file-placeholder">강의 자료를 클릭하여 업로드하세요</span>
          )}
          <input type="file" className="KHJ-file-input" onChange={handleFileChange} id="file-upload-input" hidden />
          <label htmlFor="file-upload-input" className="KHJ-file-upload-button">파일 선택</label>
        </div>
      </div>

      <div className="KHJ-form-section">
        <label className="KHJ-tags-label"><span className="KHJ-required-text-dot">*</span>포함 사항(선택)</label>
        <div className="KHJ-tags-input-container">
          <input type="text" className="KHJ-tags-input" placeholder="태그를 입력해주세요. (쉼표로 구분)" value={tags.join(',')} onChange={handleTagsChange} />
        </div>
      </div>

      <div className="KHJ-form-section">
        <label className="KHJ-tags-label"><span className="KHJ-required-text-dot">*</span>클래스 준비물(선택)</label>
        <div className="KHJ-tags-input-container">
          <input type="text" className="KHJ-tags-input" placeholder="태그를 입력해주세요. (쉼표로 구분)" value={tags.join(',')} onChange={handleTagsChange} />
        </div>
      </div>

      <div className="KHJ-form-section">
        <label className="KHJ-keywords-label"><span className="KHJ-required-text-dot">*</span>검색 키워드(선택)</label>
        <div className="KHJ-keywords-input-container">
          <input type="text" className="KHJ-keywords-input" placeholder="검색 키워드를 입력해주세요." value={keywords} onChange={handleKeywordsChange} />
        </div>
      </div>

      <div className="KHJ-form-section">
        <label className="KHJ-coupon-label"><span className="KHJ-required-text-dot">*</span>쿠폰 등록(선택)</label>
        <div className="KHJ-coupon-input-container">
          <button className="KHJ-coupon-input-btn" onClick={() => setIsCouponModalOpen(true)}>쿠폰 선택</button>
          {selectedCouponInfo.length > 0 && (
            <div className="KHJ-selected-coupon-info">
              {selectedCouponInfo.map((c, i) => (
                <div key={i}>
                  <strong>{c.customName}</strong> ({c.name}, {c.discount}, {c.count}매)
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isCouponModalOpen && (
        <div className="KHJ-modal-backdrop">
          <div className="KHJ-coupon-modal">
            <h4>쿠폰 선택</h4>
            <div className="KHJ-coupon-list">
              {dummyCoupons.map((coupon) => {
                const selected = selectedCoupons.find(c => c.code === coupon.code);
                return (
                  <div key={coupon.code} className="KHJ-coupon-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => toggleCouponSelection(coupon.code)}
                      />
                      <strong>{coupon.name}</strong> ({coupon.discount}, {coupon.valid})
                    </label>

                    {selected && (
                      <div className="KHJ-coupon-inputs">
                        <input
                          type="text"
                          placeholder="쿠폰 이름 입력"
                          value={selected.customName}
                          onChange={(e) => updateCouponField(coupon.code, 'customName', e.target.value)}
                          className="KHJ-coupon-name-input"
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="발급 매수"
                          value={selected.count}
                          onChange={(e) => updateCouponField(coupon.code, 'count', parseInt(e.target.value))}
                          className="KHJ-coupon-name-input"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="KHJ-modal-buttons">
              <button className="KHJ-apply-btn" onClick={handleCouponApply}>적용</button>
              <button className="KHJ-cancel-btn" onClick={() => setIsCouponModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabExtraInfo;
