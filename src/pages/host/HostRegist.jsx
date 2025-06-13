import React, { useState } from 'react';
import './HostRegist.css';
import { useNavigate } from 'react-router';

const HostRegist = () => {
  const [intro, setIntro] = useState('');
  const [tag, setTag] = useState('');
  const navigate = useNavigate();
  const handleNavigation = (path)=>{
    navigate(path);
  }

  return (
    <div className="host-regist-wrapper">
      <form className="host-form">
        <label className="form-label">프로필 사진</label>
        <div className="profile-image-box">
          <div className="profile-image" />
          <button type="button" className="img-upload-btn">파일 선택</button>
        </div>

        <label className="form-label">호스트 명</label>
        <input type="text" placeholder="호스트명을 입력" className="form-input" />
        <p className="form-subtext">수강생에게 보여지는 호스트 이름입니다.</p>

        <label className="form-label">휴대전화</label>
        <div className="input-row">
          <input type="text" placeholder="전화번호 입력" className="form-input" />
          <button type="button" className="verify-btn">인증번호 보내기</button>
        </div>
        <input type="text" placeholder="인증번호 입력" className="form-input" />
        <p className="error-msg">인증번호가 틀립니다! 인증에 실패하였습니다!</p>

        <label className="form-label">공개전화번호</label>
        <input type="text" placeholder="전화번호 입력" className="form-input" />
        <p className="form-subtext">수강생에게 보여지는 연락처입니다.</p>

        <label className="form-label">이메일</label>
        <input type="email" placeholder="이메일을 입력해주세요." className="form-input" />
        <p className="form-subtext">상세 사항안내 시 이 주소로 연락드립니다.</p>

        <label className="form-label">강사 소개</label>
        <textarea
          className="form-textarea"
          placeholder="강사소개를 입력해주세요."
          rows="5"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />

        <label className="form-label">강사 소개 태그</label>
        <div className="input-row">
          <input
            type="text"
            placeholder="태그를 통해 본인을 소개해주세요!"
            className="form-input"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <button type="button" className="add-tag-btn">등록</button>
        </div>
        <p className="form-subtext">예시) 요리, 코딩</p>

        <button type="submit" className="submit-btn" onClick={()=>handleNavigation('/host/hostMyPage')}>프로필 등록</button>
      </form>
    </div>
  );
};

export default HostRegist;
