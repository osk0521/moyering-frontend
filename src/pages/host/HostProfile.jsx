import React, { useEffect, useRef, useState } from 'react';
import './HostProfile.css';
import ProfileFooter from './ProfileFooter';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import { myAxios } from '../../config';

export default function ProfileManagement() {
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const [host, setHost] = useState({});
  const [text, setText] = useState('');
  const [initialHost, setInitialHost] = useState({});
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
        profile: file.name
      }));

      setIsUpdate(true);
    }
  }

  useEffect(() => {
    myAxios(token).get(`/host/hostProfile`, {
      params: {
        hostId: user.hostId
      }
    })
      .then(res => {
        setHost(res.data);
        setInitialHost(res.data);
        setText(res.data.intro || '');
      })
      .catch(err => {
        console.log(err);
      })
  }, [token])

  useEffect(() => {
    const changed =
      idImage !== initialHost.profile ||
      host.name !== initialHost.name ||
      host.email !== initialHost.email ||
      host.publicTel !== initialHost.publicTel ||
      text !== (initialHost.intro || '');

    setIsUpdate(changed);
  }, [host, text, initialHost])

  const params = {}
  params.hostId = user.hostId;
  if (initialHost.profile != host.profile) {
    params.profile = host.profile;
  }
  if (initialHost.name != host.name) {
    params.name = host.name;
  }
  if (initialHost.publicTel != host.publicTel) {
    params.publicTel = host.publicTel;
  }
  if (initialHost.email != host.email) {
    params.email = host.email;
  }
  if (initialHost.intro != text) {
    params.intro = text;
  }

  const submit = () => {
    const formData = new FormData();
    formData.append("hostId", user.hostId);
    if (initialHost.profile != host.profile) {
      formData.append("profile", idImage)
    }
    if (initialHost.name != host.name) {
      formData.append("name", host.name)
    }
    if (initialHost.publicTel != host.publicTel) {
      formData.append("publicTel", host.publicTel)
    }
    if (initialHost.email != host.email) {
      formData.append("email", host.email)
    }
    if (initialHost.intro != text) {
      formData.append("intro", text)
    }
    myAxios(token).post("/host/hostProfileUpdate", formData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }


  return (
    <>
      <div className="KHJ-host-profile-container">
        <h2 className="KHJ-host-profile-title">프로필 관리</h2>
        <form className="KHJ-host-profile-form">
          <div className="KHJ-host-profile-group KHJ-host-image-upload">
            <label>프로필 사진</label>
            <img src={idImagePreview || host.profile || ''} alt="프로필" className="KHJ-host-profile-image" name="profile" />
            <div className="KHJ-host-file-box">
              <input type="file" placeholder="첨부파일" onChange={handleImageUpload} hidden name='profile' ref={fileInputRef}/>
              <button type="button" onClick={()=>fileInputRef.current.click()}>파일 선택</button>
            </div>
          </div>

          <div className="KHJ-host-profile-group">
            <label>휴대폰 인증</label>
            <div className="KHJ-host-inline-input">
              <input type="text" placeholder={host.tel} />
              <button type="button">인증</button>
            </div>
            <p className="KHJ-host-desc">
              실제 클래스를 운영하는 본인 연락처를 입력하세요.<br />
              해당 연락처로 알림이 발송됩니다.
            </p>
          </div>

          <div className="KHJ-host-profile-group">
            <label>호스트 명</label>
            <input type="text" placeholder={host.name} onChange={handleInputChange} name="name" value={host.name || ''} />
            <p className="KHJ-host-desc">클래스 이용자에게 보이는 이름입니다.</p>
          </div>

          <div className="KHJ-host-profile-group">
            <label>이메일</label>
            <input type="email" placeholder={host.email} onChange={handleInputChange} name="email" value={host.email || ''} />
            <p className="KHJ-host-desc">실제 사용하는 이메일을 입력하세요.</p>
          </div>

          <div className="KHJ-host-profile-group">
            <label>공개 연락처(선택)</label>
            <input type="text" placeholder={host.publicTel} onChange={handleInputChange} name="publicTel" value={host.publicTel || ''} />
            <p className="KHJ-host-desc">클래스 회원에게 공개되는 연락처입니다.</p>
          </div>

          <div className="KHJ-host-profile-group">
            <label>소개 (선택)</label>
            <div className="KHJ-host-textarea-wrapper">
              <textarea
                value={host.intro || ''}
                name='intro'
                onChange={(e) => {
                  setText(e.target.value);
                  handleInputChange(e);
                }}
                placeholder={host.intro}
                maxLength={500}
              />
              <p className="KHJ-host-char-count">{text.length}/500</p>
              <p className="KHJ-host-textarea-desc">클래스 회원에게 보여지는 소개입니다.</p>
            </div>
          </div>
        </form>
      </div>
      <ProfileFooter isUpdate={isUpdate} submit={submit} />
    </>
  );
}
