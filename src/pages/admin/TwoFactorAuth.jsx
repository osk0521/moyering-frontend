import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // 1차 로그인과 동일한 CSS 사용

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const [authCode, setAuthCode] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용

    // 6자리 숫자까지만 가능 
    if (value.length <= 6) {
      setAuthCode(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('2차 인증 시도:', authCode);
    navigate('/member');
  };

  return (
    <div className="login-containerHY">
      <div className="login-boxHY">
        {/* 로고  */}
        <div className="logo-sectionHY">
          <div className="logoHY">
            <img src="/mng_moyering.png" alt="모여링 로고" className="logo-imageHY" />
          </div>
        </div>

        {/* 안내 메시지 - 피그마와 정확히 동일한 문구 */}
        <div className="auth-infoHY">
          <p className="auth-messageHY">
            등록된 이메일로 인증번호가 발송되었습니다. 인증번호를 입력해주세요.
          </p>
        </div>

        {/* 인증번호 입력 폼  */}
        <form onSubmit={handleSubmit} className="login-formHY">
          <div className="input-groupHY">
            <label htmlFor="authCode" className="input-labelHY">인증번호</label>
            <input
              type="text"
              id="authCode"
              name="authCode"
              value={authCode}
              onChange={handleInputChange}
              placeholder="6자리 숫자를 입력하세요"
              className="input-field auth-code-inputHY"
              maxLength={6}
              autoFocus
            />
          </div>

          {/* 인증하기 버튼  */}
          <button type="submit" className="login-buttonHY">
            인증하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;