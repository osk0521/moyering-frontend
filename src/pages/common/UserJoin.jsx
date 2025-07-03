import React, { useState } from 'react';
import './UserJoin.css';
import { useNavigate } from 'react-router';
import DaumPostcode from 'react-daum-postcode';
import { myAxios } from '../../config';
import LoginHeader from './LoginHeaders';

const UserJoin = () => {
  const [user, setUser] = useState({
    userName: '', password: '', name: '', username: '', tel: '', email: '', birthday: '', addr: '', detailAddr: '',
    category1: '', category2: '', category3: '', category4: '', category5: '', intro: '', userType: 'ROLE_MB'
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isPasswordConfirmFocus, setIsPasswordConfirmFocus] = useState(false);
  const navigate = useNavigate();
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const checkFormValidity = () => {
    if (
      user.username && user.password && user.name && user.email && user.nickName && user.tel && user.birthday && user.addr && isVerified
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await myAxios().post("/api/auth/register", user);
      setMessage('이메일 인증을 확인하세요!');
      alert('작성하신 이메일로 코드를 발송했습니다! 확인해주세요!');
    } catch (error) {
      setMessage('회원가입 실패!');
      alert('작성하신 메일은 없는 메일입니다!');
    }
  };

  const handleVerify = async () => {
    try {
      const res = await myAxios().get(`/api/auth/verify?token=${verificationCode}`);
      if (res.data === "이메일 인증 완료!") {
        setMessage(res.data);
        setIsVerified(true);
      }
    } catch (error) {
      setMessage('인증 실패!');
      setIsVerified(false);
    }
  };

  const handleComplete = (data) => {
    const fullAddress = data.address;
    setUser({ ...user, addr: fullAddress });
    setIsPostcodeOpen(false);
  };

  const edit = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    checkFormValidity();
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setUser({ ...user, password });
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (passwordRegex.test(password)) {
      setIsPasswordValid(true);
      setPasswordMessage('비밀번호가 유효합니다.');
    } else {
      setIsPasswordValid(false);
      setPasswordMessage('영문, 숫자, 특수문자 조합으로 8자 이상이어야 합니다.');
    }
  };

  const handlePasswordConfirmChange = (e) => {
    const confirmPassword = e.target.value;
    setIsPasswordMatch(confirmPassword === user.password);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocus(true);
  };

  const handlePasswordConfirmFocus = () => {
    setIsPasswordConfirmFocus(true);
  };

  return (<>
    <LoginHeader />
    <div className="join-wrapper">

      <h2 className="join-title">회원가입</h2>
      <form className="join-form"
        onSubmit={(e) => {
          e.preventDefault(); // 기본 제출 막기
          console.log("폼 제출됨"); // 이게 반드시 떠야 함
          console.log(user); // 이 값도 확인해보자
          navigate('/joinCategory', { state: user });
        }}>
        <label>아이디</label>
        <input type="text" placeholder="아이디" value={user.username} name="username" onChange={edit} />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          value={user.password}
          name='password'
          onChange={handlePasswordChange}
          onFocus={handlePasswordFocus}
          style={{ borderColor: isPasswordValid ? 'blue' : (isPasswordFocus ? 'red' : '') }}
        />
        <p className="join-sub-text">{passwordMessage}</p>

        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={user.passwordConfirm}
          onChange={handlePasswordConfirmChange}
          onFocus={handlePasswordConfirmFocus}
          style={{ borderColor: isPasswordMatch ? 'blue' : (isPasswordConfirmFocus ? 'red' : '') }}
        />
        <p className="join-sub-text">
          {isPasswordMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
        </p>

        <label>이름</label>
        <input type="text" placeholder="이름" value={user.name} name='name' onChange={edit} />

        <label>닉네임</label>
        <input type="text" placeholder="닉네임" value={user.nickName} name='nickName' onChange={edit} />

        <label>핸드폰</label>
        <div className="phone-row">
          <input type="text" placeholder="핸드폰" value={user.tel} name='tel' onChange={edit} />
        </div>

        <label>이메일</label>
        <div className="email-row">
          <input type="email" placeholder="이메일" value={user.email} name='email' onChange={edit} />
          <button type="button" className="verify-btn" onClick={handleSubmit}>인증</button>
        </div>
        <input type="text" placeholder="인증 코드" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />

        {/* 인증확인 버튼 */}
        <button type="button" onClick={handleVerify} className="verify-btn">인증 확인</button>

        <p className="error-msg">{message}</p>

        <label>생년월일</label>
        <input
          type="date"
          name="birthday"
          value={user.birthday}
          onChange={edit}
        />

        <label>주소</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="주소 검색"
            value={user.addr}
            readOnly
            onClick={() => setIsPostcodeOpen(true)}
            style={{ flex: 1, cursor: 'pointer' }}
          />
          <button
            type="button"
            onClick={() => setIsPostcodeOpen(true)}
            className="verify-btn"
          >
            검색
          </button>
        </div>
        <input
          type="text"
          name='detailAddr'
          value={user.detailAddr}
          placeholder="상세 주소를 입력해주세요."
          onChange={edit}
        />

        {isPostcodeOpen && (
          <div className="modal-overlay" onClick={() => setIsPostcodeOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <DaumPostcode onComplete={handleComplete} autoClose />
              <button className="close-btn" onClick={() => setIsPostcodeOpen(false)}>닫기</button>
            </div>
          </div>
        )}
        <div
          className="tooltip-wrapper"
          onMouseEnter={() => !isFormValid && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid}
          >
            다음
          </button>
          {showTooltip && (
            <div className="tooltip-msg">{!isVerified ? '이메일 인증이 필요합니다!' : '아직 모든 항목을 입력하지 않았습니다!'}</div>
          )}
        </div>
      </form>
    </div>
  </>
  );
};

export default UserJoin;
