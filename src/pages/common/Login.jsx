import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('로그인 요청:', { userId, password });
    // 실제 로그인 처리 로직은 여기에 추가
  };

  const handleKakaoLogin = () => {
    alert('카카오 로그인 연동 예정');
  };

  return (
    <div className="KHJ-login-container">
      <div className="KHJ-login-box">
        <img src="/logo.png" alt="로고" className="KHJ-login-logo" />
        <h2>로그인</h2>
        <form onSubmit={handleLogin} className="KHJ-login-form">
          <label>아이디</label>
          <input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="KHJ-login-btn">로그인</button>
        </form>
        <button className="KHJ-kakao-btn" onClick={handleKakaoLogin}>
          <img src="/kakao.png" alt="카카오" className="KHJ-kakao-icon" />
          카카오로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Login;