import React, { useState } from 'react';
import './HostProfile.css';
import ProfileFooter from './ProfileFooter';

export default function ProfileManagement() {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    if (e.target.value.length <= 500) {
      setText(e.target.value);
    }
  };

  return (
    <>
      <div className="KHJ-host-profile-container">
        <h2 className="KHJ-host-profile-title">프로필 관리</h2>
        <form className="KHJ-host-profile-form">
          <div className="KHJ-host-profile-group KHJ-host-image-upload">
            <label>프로필 사진</label>
            <img src="/profile.png" alt="프로필" className="KHJ-host-profile-image" />
            <div className="KHJ-host-file-box">
              <input type="text" placeholder="첨부파일" readOnly />
              <button type="button">파일 선택</button>
            </div>
          </div>

          <div className="KHJ-host-profile-group">
            <label>휴대폰 인증</label>
            <div className="KHJ-host-inline-input">
              <input type="text" placeholder="01012345678" />
              <button type="button">인증</button>
            </div>
            <p className="KHJ-host-desc">
              실제 클래스를 운영하는 본인 연락처를 입력하세요.<br />
              해당 연락처로 알림이 발송됩니다.
            </p>
          </div>

          <div className="KHJ-host-profile-group">
            <label>호스트 명</label>
            <input type="text" placeholder="홍길동" />
            <p className="KHJ-host-desc">클래스 이용자에게 보이는 이름입니다.</p>
          </div>

          <div className="KHJ-host-profile-group">
            <label>이메일</label>
            <input type="email" placeholder="abc123@naver.com" />
            <p className="KHJ-host-desc">실제 사용하는 이메일을 입력하세요.</p>
          </div>

          <div className="KHJ-host-profile-group">
            <label>공개 연락처(선택)</label>
            <input type="text" placeholder="01012345678" />
            <p className="KHJ-host-desc">클래스 회원에게 공개되는 연락처입니다.</p>
          </div>

          <div className="KHJ-host-profile-group">
            <label>소개 (선택)</label>
            <div className="KHJ-host-textarea-wrapper">
              <textarea
                value={text}
                onChange={handleChange}
                placeholder="간단한 소개와 약력을 입력하세요."
                maxLength={500}
              />
              <p className="KHJ-host-char-count">{text.length}/500</p>
              <p className="KHJ-host-textarea-desc">클래스 회원에게 보여지는 소개입니다.</p>
            </div>
          </div>
        </form>
      </div>
      <ProfileFooter />
    </>
  );
}
