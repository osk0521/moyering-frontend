// TabExtraInfo.jsx
import { useEffect, useState } from 'react';
import './TabExtraInfo.css';
import React from 'react';
import { myAxios } from '../../../config';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom } from '../../../atoms';

const TabExtraInfo = ({ registerValidator, classData, setClassData }) => {
  const { extraInfo } = classData;
  const [token, setToken] = useAtom(tokenAtom);
  const [couponList, setCouponList] = useState([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  useEffect(() => {
    token && myAxios(token, setToken).get("/host/couponList")
      .then(res => setCouponList(res.data))
      .catch(err => console.log("쿠폰 불러오기 실패", err));
  }, [token]);

  useEffect(() => {
    console.log('선택된 쿠폰 목록:', selectedCoupons);
  }, [selectedCoupons]);

  const toggleCouponSelection = (couponCode) => {
    setSelectedCoupons((prev) => {
      const isSelected = prev.some(c => c.couponCode === couponCode);
      if (isSelected) return prev.filter(c => c.couponCode !== couponCode);

      const coupon = couponList.find(c => c.couponCode === couponCode);
      if (!coupon) return prev;

      return [...prev, {
        couponCode: coupon.couponCode,
        couponName: coupon.couponName || '',
        discount: coupon.discount,
        discountType: coupon.discountType,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        amount: 1
      }];
    });
  };

  const updateCouponField = (couponCode, key, value) => {
    setSelectedCoupons(prev =>
      prev.map(c =>
        c.couponCode === couponCode ? { ...c, [key]: value } : c
      )
    );
  };

  const handleCouponApply = () => {
    setClassData(prev => ({
      ...prev,
      extraInfo: {
        ...prev.extraInfo,
        coupons: selectedCoupons
      }
    }));
    setIsCouponModalOpen(false);
  };

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

  useEffect(() => {
    const { immaterialg1, incluision,preparation,keywords,coupons } = classData.extraInfo;
    const isValid = immaterialg1 && incluision&&preparation&&keywords&&coupons.lnegth;
    registerValidator(3, () => isValid);
  }, [classData.extraInfo, registerValidator]);

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
              <button type="button" className="KHJ-tag-remove" onClick={() => removeTag(keyName, tag)}>×</button>
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

      <TagInput label="포함 사항" keyName="incluision" placeholder="예: 재료비 포함, 음료 제공" />
      <TagInput label="클래스 준비물" keyName="preparation" placeholder="예: 필기도구, 앞치마" />
      <TagInput label="검색 키워드" keyName="keywords" placeholder="예: 베이킹, 원데이클래스" />

      <div className="KHJ-form-section">
        <label className="KHJ-coupon-label"><span className="KHJ-required-text-dot">*</span>쿠폰 등록(선택)</label>
        <div className="KHJ-coupon-input-container">
          <button className="KHJ-coupon-input-btn" onClick={() => setIsCouponModalOpen(true)}>쿠폰 선택</button>
        </div>
      </div>

      {extraInfo.coupons && extraInfo.coupons.length > 0 && (
        <div className="KHJ-coupon-table-container">
          <h4>📋 적용된 쿠폰 목록</h4>
          <table className="KHJ-coupon-table">
            <thead>
              <tr>
                <th>코드</th>
                <th>쿠폰 이름</th>
                <th>할인</th>
                <th>매수</th>
              </tr>
            </thead>
            <tbody>
              {extraInfo.coupons.map((c, i) => (
                <tr key={i}>
                  <td>{c.couponCode}</td>
                  <td>{c.couponName || '(미지정)'}</td>
                  <td>{c.discount}{c.discountType === 'RT' ? '%' : '원'}</td>
                  <td>{c.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCouponModalOpen && (
        <div className="KHJ-modal-backdrop">
          <div className="KHJ-coupon-modal">
            <h4>쿠폰 선택</h4>
            <div className="KHJ-coupon-list">
              {couponList.map((coupon) => {
                const selected = selectedCoupons.find(c => c.couponCode === coupon.couponCode);
                const discountUnit = coupon.discountType === 'RT' ? '%' : '원';

                return (
                  <div key={coupon.couponCode} className="KHJ-coupon-option">
                    <div className="KHJ-coupon-details">
                      <label>
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => toggleCouponSelection(coupon.couponCode)}
                        />
                        {coupon.couponName || '(이름없음)'}
                      </label>
                      <div>코드: {coupon.couponCode}</div>
                      <div>할인: {coupon.discount}{discountUnit}</div>
                    </div>
                    {selected && (
                      <div className="KHJ-coupon-inputs">
                        <input
                          type="text"
                          placeholder="쿠폰 이름"
                          value={selected.couponName}
                          onChange={(e) => updateCouponField(coupon.couponCode, 'couponName', e.target.value)}
                          className="KHJ-coupon-name-input"
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="매수"
                          value={selected.amount}
                          onChange={(e) => updateCouponField(coupon.couponCode, 'amount', parseInt(e.target.value))}
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
