import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  // 이전 페이지에서 전달받은 이메일 정보
  useEffect(() => {
    const state = location.state;
    if (state && state.email) {
      setEmail(state.email);
    } else {
      // 이메일 정보가 없으면 로그인 페이지로 리다이렉트
      alert('잘못된 접근입니다. 다시 로그인해주세요.');
      navigate('/admin');
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    
    if (value.length <= 6) {
      setAuthCode(value);
      setError(''); // 입력시 에러 메시지 초기화
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authCode.length !== 6) {
      setError('인증번호 6자리를 입력해주세요.');
      return;
    }

    if (!email) {
      setError('이메일 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          code: authCode 
        })
      });

      const data = await response.json();

      if (data.success) {
        // 인증 성공 시 새로운 토큰 저장
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // 대시보드로 이동
        navigate('/admin/dashboard');
      } else {
        setError(data.message || '인증번호가 올바르지 않습니다.');
        setAuthCode(''); // 실패시 입력값 초기화
      }
    } catch (error) {
      console.error('인증 오류:', error);
      setError('인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-containerHY">
      <div className="login-boxHY">
        {/* 로고 */}
        <div className="logo-sectionHY">
          <div className="logoHY">
            <img src="/logo_managerLogin.png" alt="모여링 로고" className="logo-imageHY" />
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="auth-infoHY">
          <p className="auth-messageHY">
            등록된 이메일로 인증번호가 발송되었습니다. 인증번호를 입력해주세요.
          </p>
        </div>

        {/* 인증번호 입력 폼 */}
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
              className={`input-fieldHY ${error ? 'error' : ''}`}
              maxLength={6}
              autoFocus
              disabled={loading}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="error-messageHY" style={{color: 'red', fontSize: '14px', marginTop: '5px'}}>
              {error}
            </div>
          )}

          {/* 인증하기 버튼 */}
          <button 
            type="submit" 
            className="login-buttonHY"
            disabled={loading || authCode.length !== 6}
          >
            {loading ? '인증 중...' : '인증하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;