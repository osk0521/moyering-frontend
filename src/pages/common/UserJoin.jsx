import React, { useState } from 'react';
import './UserJoin.css';
import { useNavigate } from 'react-router';

const UserJoin = () => {
  const [intro, setIntro] = useState('');
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  }

  return (
    <div className="join-wrapper">
      <h2 className="join-title">회원가입</h2>
      <form className="join-form">
        <label>아이디</label>
        <input type="email" placeholder="아이디(이메일)" />

        <label>비밀번호</label>
        <input type="password" placeholder="비밀번호" />
        <p className="join-sub-text">대/소문자, 숫자, 특수문자 2가지 이상의 조합으로 10자 이상</p>

        <input type="password" placeholder="비밀번호 확인" />

        <label>이름</label>
        <input type="text" placeholder="이름" />

        <label>핸드폰</label>
        <div className="phone-row">
          <input type="text" placeholder="핸드폰" />
        </div>

        <label>이메일</label>
        <div className="email-row">
          <input type="email" placeholder="이메일" />
          <button type="button" className="verify-btn">인증</button>
        </div>
        <input type="text" placeholder="인증" />
        <p className="error-msg">인증번호가 틀립니다!</p>

        <label>생년월일</label>
        <input type="text" placeholder="생년월일" />
        <input type="text" placeholder="생년월일" />

        <label>주소</label>
        <input type="text" placeholder="주소 검색" />
        <input type="text" placeholder="상세 주소를 입력해주세요." />

        <button type="submit" className="submit-btn" onClick={()=>handleNavigation('/joinCategory')}>다음</button>
      </form>
    </div>
  );
};

export default UserJoin;