import React, { useState } from 'react';
import './UserJoin.css';
import { useNavigate } from 'react-router';
import DaumPostcode from 'react-daum-postcode';

const UserJoin = () => {
  const [user, setUser] = useState({
    userName: '', password: '', name: '', username: '', tel: '', email: '', birthday: '', addr: '', detailAddr: ''
    , category1: '', category2: '', category3: '', category4: '', category5: '', intro: '', userType: 'ROLE_MB'
  });
  const navigate = useNavigate();
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handleComplete = (data) => {
    const fullAddress = data.address;
    setUser({ ...user, addr: fullAddress });
    setIsPostcodeOpen(false);
  };

  const edit = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }


  return (
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
        <input type="password" placeholder="비밀번호" value={user.password} name='password' onChange={edit} />
        <p className="join-sub-text">대/소문자, 숫자, 특수문자 2가지 이상의 조합으로 10자 이상</p>

        <input type="password" placeholder="비밀번호 확인" />

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
          <button type="button" className="verify-btn">인증</button>
        </div>
        <input type="text" placeholder="인증" />
        <p className="error-msg">인증번호가 틀립니다!</p>

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

        <button type="submit" className="submit-btn" >다음</button>
      </form>
    </div>
  );
};

export default UserJoin;