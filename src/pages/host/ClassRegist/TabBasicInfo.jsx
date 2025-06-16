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

  const [hostClass, setHostClass] = useState({
    category1: '',
    category2: '',
    name: '',
    locName: '',
    addr: '',
    longitude: '',
    latitude: ''
  });

  const [tempLocName, setTempLocName] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  const handlePrimaryChange = (e) => {
    setHostClass((prev) => ({
      ...prev,
      category1: e.target.value,
      category2: ''
    }));
  };

  const handleSecondaryChange = (e) => {
    setHostClass((prev) => ({
      ...prev,
      category2: e.target.value
    }));
  };

  const handleClassNameChange = (e) => {
    setHostClass((prev) => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleAddressSelect = (data) => {
    setSelectedAddress(data.address);
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

    setHostClass((prev) => ({
      ...prev,
      locName: tempLocName,
      addr: selectedAddress,
      longitude: '12.3456',
      latitude: '12.3456'
    }));

    // 초기화
    setTempLocName('');
    setSelectedAddress('');
    setShowLocation(false);
  };

  const handleAddressClear = () => {
    setHostClass((prev) => ({
      ...prev,
      locName: '',
      addr: '',
      longitude: '',
      latitude: ''
    }));
  };

  const validate = () => {
    const { category1, category2, name, addr } = hostClass;
    return category1 && category2 && name.trim() && addr;
  };

  useEffect(() => {
    registerValidator(0, validate);
  }, [hostClass]);

  const secondaryOptions = categoryMap[hostClass.category1] || [];

  const submit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category1",hostClass.category1);
    formData.append("category2",hostClass.category2);
    formData.append("name",hostClass.name);
    formData.append("locName",hostClass.locName);
    formData.append("addr",hostClass.addr);
    formData.append("longitude",hostClass);
    formData.append("latitude",hostClass.latitude);

    axios.post(`${url}/host/classRegist`,formData)
    .then(res=>{
      console.log(res);
    })
    .catch(err=>{
      console.log(err);
    })
  }


  return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">기본정보</h3>

      <div className="KHJ-form-section">
        <div className="KHJ-inline-form-row">
          <label className="KHJ-category-label"><span className="KHJ-required-text-dot">*</span>카테고리</label>
          <div className="KHJ-category-row">
            <div className="KHJ-form-group">
              <label className="KHJ-sub-label">1차카테고리</label>
              <select value={hostClass.category1} onChange={handlePrimaryChange}>
                <option value="" disabled hidden>1차 카테고리 선택</option>
                {Object.keys(categoryMap).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className="KHJ-form-group">
              <label className="KHJ-sub-label">2차카테고리</label>
              <select
                value={hostClass.category2}
                onChange={handleSecondaryChange}
                disabled={!hostClass.category1}
              >
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
          value={hostClass.name}
          onChange={handleClassNameChange}
        />
      </div>

      <hr />

      <div className="KHJ-form-section">
        <label className="KHJ-label">
          장소 <span className="KHJ-required-text"><span className="KHJ-required-text-dot">*</span> 진행장소</span>
        </label>

        {!hostClass.addr ? (
          <div className="KHJ-location-add-wrapper">
            <div className="KHJ-location-relative">
              <button className="KHJ-location-add-btn" onClick={() => setShowLocation(true)}>
                장소 등록
              </button>

              {showLocation && (
                <div className="KHJ-postcode-popup">
                  <div className="KHJ-locname-input-wrapper">
                    <label className="KHJ-sub-label">장소명</label>
                    <input
                      type="text"
                      className="KHJ-locname-input"
                      placeholder="예: 강남 소셜 라운지"
                      value={tempLocName}
                      onChange={(e) => setTempLocName(e.target.value)}
                    />
                  </div>

                  <DaumPostcode onComplete={handleAddressSelect} />

                  {selectedAddress && (
                    <div className="KHJ-selected-addr">선택된 주소: {selectedAddress}</div>
                  )}

                  <div className="KHJ-location-btn-row">
                    <button className="KHJ-location-confirm-btn" onClick={handleAddressConfirm}>장소 등록</button>
                    <button className="KHJ-postcode-close-btn" onClick={() => setShowLocation(false)}>닫기</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="KHJ-location-wrapper">
            <div className="KHJ-location-close-absolute">
              <button className="KHJ-location-remove-btn" onClick={handleAddressClear}>
                ×
              </button>
            </div>
            <div className="KHJ-location-box">
              <table className="KHJ-location-table">
                <tbody>
                  <tr>
                    <td className="KHJ-location-label">장소명</td>
                    <td>{hostClass.locName}</td>
                  </tr>
                  <tr>
                    <td className="KHJ-location-label">주소</td>
                    <td>{hostClass.addr}</td>
                  </tr>
                  <tr>
                    <td className="KHJ-location-label">좌표</td>
                    <td>위도 : {hostClass.latitude} &nbsp;&nbsp;&nbsp; 경도 : {hostClass.longitude}</td>
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
