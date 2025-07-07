import React, { useEffect, useRef, useState } from 'react';
import './SettlementInfo.css';
import ProfileFooter from './ProfileFooter';
import { myAxios, url } from '../../config';
import { tokenAtom, userAtom } from '../../atoms';
import { useAtomValue } from 'jotai';

const SettlementInfo = () => {
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const [host, setHost] = useState([]);
  const [initialHost, setInitialHost] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [idImagePreview, setIdImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHost((prev) => ({
      ...prev,
      [name]: value
    }));
    setIsUpdate(true);
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdImage(file);
      setIdImagePreview(URL.createObjectURL(file));
      setHost((prev) => ({
        ...prev,
        idCard: file.name
      }));

      setIsUpdate(true);
    }
  }

  const removeImage = () => {
    setIdImage(null);
    setIdImagePreview('');
    setHost((prev) => ({
      ...prev,
      idCard: '',
    }))
    setIsUpdate(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };


  useEffect(() => {
    myAxios(token).get("/host/hostProfile", {
      params: {
        hostId: user.hostId
      }
    })
      .then(res => {
        console.log(res);
        setHost(res.data);
        setInitialHost(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [token]);

  useEffect(() => {
    const changed =
      host.bankName !== initialHost.bankName ||
      host.accName !== initialHost.accName ||
      host.accNum !== initialHost.accNum ||
      (idImage !== null);
    setIsUpdate(changed);
  }, [host, initialHost])



  // if (host.bankName) formData.append("bankName", host.bankName);
  // if (host.accName) formData.append("accName", host.accName);
  // if (host.accNum) formData.append("accNum", host.accNum);
  // if (idImage) formData.append("idCard", idImage); // 파일 첨부

  const submit = () => {
    const formData = new FormData();
    formData.append("hostId", user.hostId);
    if (initialHost.bankName != host.bankName) {
      formData.append("bankName", host.bankName);
    }
    if (initialHost.accName != host.accName) {
      formData.append("accName", host.accName);
    }
    if (initialHost.accNum != host.accNum) {
      formData.append("accNum", host.accNum);
    }
    if (initialHost.idCard != idImage) {
      formData.append("idCard", idImage); // 파일
    }
    // if (host.bankName)
    //   if (host.accName)
    //     if (host.accNum)
    //       if (idImage)
    for (let [key, value] of formData.entries()) {
      console.log(key, value);  // 여기에 파일 객체도 나와야 정상!
    }
    myAxios(token).post("/host/settlementInfoUpdate", formData)
      .then(res => {
        console.log(res);
        alert("변경사항을 저장하였습니다!");
        setIsUpdate(false);
      })
      .catch(err => {
        console.log(err);
      })
  }


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
          <select name="bankName" value={host.bankName || ''} onChange={handleInputChange}>
            <option value="" disabled hidden>은행</option>
            <option value="kb">국민은행</option>
            <option value="shinhan">신한은행</option>
            <option value="hana">하나은행</option>
          </select>
          <input
            type="text"
            placeholder="예금주"
            name='accName'
            value={host.accName || ''}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="계좌 번호를 입력해주세요."
            name='accNum'
            value={host.accNum || ''}
            onChange={handleInputChange}
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
          {!idImagePreview ? (
            <>
              <label htmlFor="idUpload" className="KHJ-settlement__upload-label">
                + 이미지 추가하기
              </label>
              <input
                id="idUpload"
                type="file"
                accept="image/*"
                name='idCard'
                onChange={handleImageUpload}
                hidden
                ref={fileInputRef}
              />
            </>
          ) : (
            <div className="KHJ-settlement__image-preview-wrapper">
              <img src={`${url}/files?filename=${idImagePreview}`} alt="신분증 미리보기" className="KHJ-settlement__image-preview" />
              <button type="button" className="KHJ-remove-btn" onClick={removeImage}>×</button>
            </div>
          )}
          {host.idCard && <span>{host.idCard}</span>}
          <p className="KHJ-settlement__note KHJ-settlement__note--warning">
            용량 2MB 이하 JPG, PNG<br />
            주민등록번호 전체 확인 가능해야 함. 앞자리만 보이면 불가
          </p>
        </div>
      </div>
      <ProfileFooter isUpdate={isUpdate} submit={submit} />
    </div>
  );
};

export default SettlementInfo;