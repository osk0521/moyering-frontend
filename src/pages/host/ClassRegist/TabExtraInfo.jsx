import { useEffect, useState } from 'react';
import './TabExtraInfo.css';

const TabExtraInfo = ({ registerValidator, classData, setClassData }) => {
  const { extraInfo } = classData;

  // 파일 변경
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setClassData(prev => ({
        ...prev,
        extraInfo: {
          ...prev.extraInfo,
          material: uploadedFile,
        }
      }));
    }
  };

  // 태그 추가/제거 (콤마로 관리)
  const addTag = (key, input) => {
    const tags = (extraInfo[key] || '').split(',').filter(Boolean);
    if (input && !tags.includes(input) && tags.length < 20) {
      const updated = [...tags, input].join(',');
      setClassData(prev => ({
        ...prev,
        extraInfo: {
          ...prev.extraInfo,
          [key]: updated,
        }
      }));
    }
  };

  const removeTag = (key, tagToRemove) => {
    const tags = (extraInfo[key] || '').split(',').filter(Boolean);
    const updated = tags.filter(tag => tag !== tagToRemove).join(',');
    setClassData(prev => ({
      ...prev,
      extraInfo: {
        ...prev.extraInfo,
        [key]: updated,
      }
    }));
  };

  // 검증 함수
  const validate = () => {
    const hasMaterial = extraInfo.material != null;
    const hasIncluision = extraInfo.incluision?.split(',').filter(Boolean).length > 0;
    const hasPreparation = extraInfo.preparation?.split(',').filter(Boolean).length > 0;
    const hasKeywords = extraInfo.keywords?.split(',').filter(Boolean).length > 0;
    return hasMaterial && hasIncluision && hasPreparation && hasKeywords;
  };

  useEffect(() => {
    registerValidator(3, validate);
  }, [extraInfo]);

  // 태그 입력용 컴포넌트
  const TagInput = ({ label, keyName, placeholder }) => {
    const [input, setInput] = useState('');
    const tags = (extraInfo[keyName] || '').split(',').filter(Boolean);

  return (
      <div className="KHJ-form-section">
        <label className="KHJ-tags-label">{label}</label>
        <div className="KHJ-tags-input-container">
          <input
            type="text"
            className="KHJ-tags-input"
            value={input}
            placeholder={placeholder}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (addTag(keyName, input), setInput(''))}
          />
          <button type="button" className="KHJ-add-tag-btn" onClick={() => { addTag(keyName, input); setInput(''); }}>등록</button>
        </div>
        <div className="KHJ-tag-list">
          {tags.map((tag, index) => (
            <span key={index} className="KHJ-tag">
              {tag}
              <button
                type="button"
                className="KHJ-tag-remove"
                onClick={() => removeTag(keyName, tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">클래스 부가정보</h3>

      <div className="KHJ-form-section">
        <label className="KHJ-file-label"><span className="KHJ-required-text-dot">*</span>클래스 강의자료</label>
        <div className="KHJ-file-upload-container">
          {extraInfo.material ? (
            <span>{extraInfo.material.name}</span>
          ) : (
            <span className="KHJ-file-placeholder">강의 자료를 클릭하여 업로드하세요</span>
          )}
          <input type="file" className="KHJ-file-input" onChange={handleFileChange} id="file-upload-input" hidden />
          <label htmlFor="file-upload-input" className="KHJ-file-upload-button">파일 선택</label>
        </div>
      </div>

      <TagInput
        label="포함 사항"
        keyName="incluision"
        placeholder="예: 재료비 포함, 음료 제공"
      />

      <TagInput
        label="클래스 준비물"
        keyName="preparation"
        placeholder="예: 필기도구, 앞치마"
      />

      <TagInput
        label="검색 키워드"
        keyName="keywords"
        placeholder="예: 베이킹, 원데이클래스"
      />

      {/* <div className="KHJ-form-section">
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
      )} */}
    </div>
  );
};

export default TabExtraInfo;
