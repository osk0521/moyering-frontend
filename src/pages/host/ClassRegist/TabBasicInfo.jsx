import { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import './TabBasicInfo.css';
import React from 'react';
import getLatLngFromAddress from '../../../hooks/common/getLatLngFromAddress';
import { myAxios } from '../../../config';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../../atoms';

const TabBasicInfo = ({ registerValidator, classData, setClassData }) => {
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

  const [categories, setCategories] = useState([]); // 1차 카테고리 저장
  const [subCategories, setSubCategories] = useState([]); // 서브카테고리 저장
  const [category1, setCategory1] = useState(''); // 1차 카테고리
  const [category2, setCategory2] = useState(null); // 2차 카테고리
  const [category1Name, setCategory1Name] = useState(''); // 선택된 1차 카테고리 이름
  const [category2Name, setCategory2Name] = useState(''); // 선택된 2차 카테고리 이름
  const [subCategoryId, setSbuCategoryId] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [tempLocName, setTempLocName] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [detailAddr, setDetailAddr] = useState('');
  const [coordLat, setCoordLat] = useState('');
  const [coordLng, setCoordLng] = useState('');
  const [token, setToken] = useAtom(tokenAtom);


  const { basicInfo } = classData;

  useEffect(() => {
    // 카테고리와 서브카테고리 데이터를 API로 불러오기
    token && myAxios(token, setToken).get('/host/classRegistCategory')
      .then(res => {
        setCategories(res.data.category);
        setSubCategories(res.data.subCategory);
      })
      .catch(err => {
        console.error(err);
      });
  }, [token]);

  useEffect(() => {
    if (!basicInfo.addr) return;

    getLatLngFromAddress(basicInfo.addr)
      .then(coords => {
        if (!coords?.lat || !coords?.lng) {
          console.warn('좌표값이 유효하지 않음', coords);
          return;
        }

        setCoordLat(coords.lat);
        setCoordLng(coords.lng);
        setClassData(prev => ({
          ...prev,
          basicInfo: {
            ...prev.basicInfo,
            latitude: coords.lat,
            longitude: coords.lng,
          }
        }));
      })
      .catch(err => {
        console.error('좌표변환 실패', err);
      });
  }, [basicInfo.addr, setClassData]);

  const handlePrimaryChange = (e) => {
    const selectedCategory1 = e.target.value;
    const selectedCategory1Name = categories.find(cat => cat.categoryId === parseInt(selectedCategory1))?.categoryName || '';
    setCategory1(selectedCategory1);
    setCategory1Name(selectedCategory1Name);
    setCategory2(''); // 1차 카테고리 변경 시 2차 카테고리 초기화
    setSbuCategoryId(null);
  };

  const handleSecondaryChange = (e) => {
    const selectedSubId = parseInt(e.target.value);
    const selectedSub = subCategories.find(subCat => subCat.subCategoryId === selectedSubId);

    if (selectedSub) {
      setCategory2(selectedSubId);
      setCategory2Name(selectedSub.subCategoryName);
      setSbuCategoryId(selectedSub.subCategoryId);

      // 👉 여기서 바로 basicInfo에도 반영해줄 수 있어!
      setClassData(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          category2: selectedSub.subCategoryName,
          subCategoryId: selectedSub.subCategoryId,
        }
      }));
    }
  };

  const handleClassNameChange = (e) => {
    setClassData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        name: e.target.value,
      }
    }));
  };

  const handleAddressSelect = (data) => {
    console.log(detailAddr);
    const fullAddress = data.address;
    const city = fullAddress.split(' ')[0] + fullAddress.split(' ')[1]; // 주소의 첫 번째 부분이 시 정보일 가능성이 높음
    setSelectedAddress(city);
  };

  const handleAddressConfirm = () => {
    if (!tempLocName.trim()) {
      alert('장소명을 입력해주세요.');
      return;
    }
    if (!selectedAddress) {
      alert('주소를 선택해주세요.');
      return;
    }

    setClassData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        locName: tempLocName,
        addr: selectedAddress,
        detailAddr: detailAddr,
        longitude: coordLng,
        latitude: coordLat,
        category1: category1Name, // 선택된 카테고리 이름도 저장
        category2: category2Name, // 선택된 서브카테고리 이름도 저장
      }
    }));
    // 초기화
    setTempLocName('');
    setSelectedAddress('');
    setShowLocation(false);
  };

  const handleAddressClear = () => {
    setClassData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        locName: '',
        addr: '',
        detailAddr: '',
        longitude: '',
        latitude: ''
      }
    }));
  };

  const validate = () => {
    const { category1, category2, name, addr } = classData.basicInfo;
    return category1 && category2 && name.trim() && addr;
  };

  useEffect(() => {
    const { category1, category2, name, addr, detailAddr } = classData.basicInfo;
    const isValid = category1 && category2 && name.trim() && addr && detailAddr;
    registerValidator(0, () => isValid);
  }, [classData.basicInfo, registerValidator]);

  // 선택된 1차 카테고리에 맞는 2차 카테고리들 필터링
  const secondaryOptions = subCategories.filter(subCategory => subCategory.categoryId === parseInt(category1));

  return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">기본정보</h3>

      <div className="KHJ-form-section">
        <div className="KHJ-inline-form-row">
          <label className="KHJ-category-label"><span className="KHJ-required-text-dot">*</span>카테고리</label>
          <div className="KHJ-category-row">
            <div className="KHJ-form-group">
              <label className="KHJ-sub-label">1차카테고리</label>
              <select value={category1 || ''} onChange={handlePrimaryChange}>
                <option value="" disabled hidden>1차 카테고리 선택</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="KHJ-form-group">
              <label className="KHJ-sub-label">2차카테고리</label>
              <select
                value={category2 || ''}
                onChange={handleSecondaryChange}
                disabled={!category1}
              >
                <option value="" disabled hidden>2차 카테고리 선택</option>
                {secondaryOptions.map(subCategory => (
                  <option key={subCategory.subCategoryId} value={subCategory.subCategoryId}>
                    {subCategory.subCategoryName}
                  </option>
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
          value={basicInfo.name}
          onChange={handleClassNameChange}
        />
      </div>

      <hr />

      <div className="KHJ-form-section">
        <label className="KHJ-label">장소 <span className="KHJ-required-text"><span className="KHJ-required-text-dot">*</span> 진행장소</span></label>

        {!basicInfo.addr ? (
          <div className="KHJ-location-add-wrapper">
            <div className="KHJ-location-relative">
              <button className="KHJ-location-add-btn" onClick={() => setShowLocation(true)}>장소 등록</button>

              {showLocation && (
                <div className="KHJ-postcode-popup">
                  <div className="KHJ-postcode-form-side">
                    <label className="KHJ-sub-label">장소명</label>
                    <input
                      type="text"
                      className="KHJ-locname-input"
                      placeholder="예: 강남 소셜 라운지"
                      value={tempLocName}
                      onChange={(e) => setTempLocName(e.target.value)}
                    />
                    <label className="KHJ-sub-label">상세주소</label>
                    <input
                      type="text"
                      className="KHJ-detailaddr-input"
                      placeholder="예: 3층 301호"
                      name='detailAddr'
                      // value={basicInfo.detailAddr || ''}
                      value={detailAddr}
                      onChange={(e) => setDetailAddr(e.target.value)}
                    // onChange={(e) =>
                    //   setClassData(prev => ({
                    //     ...prev,
                    //     basicInfo: {
                    //       ...prev.basicInfo,
                    //       detailAddr: e.target.value
                    //     }
                    //   }))
                    // }
                    />
                    <div className="KHJ-location-btn-row">
                      <button className="KHJ-location-confirm-btn" onClick={handleAddressConfirm}>장소 등록</button>
                      <button className="KHJ-postcode-close-btn" onClick={() => setShowLocation(false)}>닫기</button>
                    </div>
                  </div>
                  <div className="KHJ-postcode-search-side">
                    <DaumPostcode onComplete={handleAddressSelect} />
                    {selectedAddress && (
                      <div className="KHJ-selected-addr">선택된 주소: {selectedAddress}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="KHJ-location-wrapper">
            <div className="KHJ-location-close-absolute">
              <button className="KHJ-location-remove-btn" onClick={handleAddressClear}>×</button>
            </div>
            <div className="KHJ-location-box">
              <table className="KHJ-location-table">
                <tbody>
                  <tr>
                    <td className="KHJ-location-label">장소명</td>
                    <td>{basicInfo.locName}</td>
                  </tr>
                  <tr>
                    <td className="KHJ-location-label">주소</td>
                    <td>{basicInfo.addr} {basicInfo.detailAddr}</td>
                  </tr>
                  <tr>
                    <td className="KHJ-location-label">좌표</td>
                    <td>위도 : {basicInfo.latitude} &nbsp;&nbsp;&nbsp; 경도 : {basicInfo.longitude}</td>
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
