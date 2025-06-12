// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 일단 간단하게 - 로그인 버튼 누르면 2차 인증으로 이동
    console.log('로그인 시도:', formData);
    navigate('/auth/verify');
  };

  return (
    <div className="login-containerHY">
      <div className="login-boxHY">
        {/* 로고 부분 - 이미지만 사용 */}
        <div className="logo-sectionHY">
          <div className="logoHY">
            <img src="/mng_moyering.png" alt="모여링 로고" className="logo-imageHY" />
          </div>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="login-formHY">
          <div className="input-groupHY">
            <label htmlFor="username" className="input-labelHY">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="관리자 아이디"
              className="input-fieldHY"
            />
          </div>

          <div className="input-groupHY">
            <label htmlFor="password" className="input-labelHY">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호"
              className="input-fieldHY"
            />
          </div>

          {/* 로그인 버튼 - 피그마 주황색 버튼과 동일 */}
          <button type="submit" className="login-buttonHY">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;