import React, { useState } from 'react';
import './SettlementInfo.css';
import ProfileFooter from './ProfileFooter';

const SettlementInfo = () => {
  const [bank, setBank] = useState('');
  const [holder, setHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [taxType, setTaxType] = useState('personal');
  const [taxRecipient, setTaxRecipient] = useState('');
  const [idImage, setIdImage] = useState(null);

  const handleImageUpload = (e) => {
    setIdImage(e.target.files[0]);
  };

   return (
    <div className="KHJ-settlement">
      <h3 className="KHJ-settlement__title">정산 정보</h3>

      <div className="KHJ-settlement__row">
        <label className="KHJ-settlement__label">수수료</label>
        <span className="KHJ-settlement__text">10%</span>
      </div>

      <div className="KHJ-settlement__row">
        <label className="KHJ-settlement__label">입금 계좌</label>
        <div className="KHJ-settlement__bank-info">
          <select value={bank} onChange={(e) => setBank(e.target.value)}>
            <option value="">은행</option>
            <option value="kb">국민은행</option>
            <option value="shinhan">신한은행</option>
            <option value="hana">하나은행</option>
          </select>
          <input
            type="text"
            placeholder="예금주"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
          />
          <input
            type="text"
            placeholder="계좌 번호를 입력해주세요."
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <p className="KHJ-settlement__note">
            - 사업자 계좌의 경우 대표자명과 일치해야 합니다.<br />
            - 정확한 10자리 입력<br />
            - 변경 시 다음 정산부터 적용
          </p>
        </div>
      </div>

      <div className="KHJ-settlement__row">
        <label className="KHJ-settlement__label">신분증</label>
        <div className="KHJ-settlement__upload-box">
          <label htmlFor="idUpload" className="KHJ-settlement__upload-label">
            + 이미지 추가하기
          </label>
          <input
            id="idUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
          {idImage && <span>{idImage.name}</span>}
          <p className="KHJ-settlement__note KHJ-settlement__note--warning">
            용량 2MB 이하 JPG, PNG<br />
            주민등록번호 전체 확인 가능해야 함. 앞자리만 보이면 불가
          </p>
        </div>
      </div>
      <ProfileFooter />
    </div>
  );
};

export default SettlementInfo;