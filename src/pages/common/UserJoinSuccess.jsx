import React from 'react';
import './UserJoinSuccess.css';
import { useNavigate } from 'react-router';

const UserJoinSuccess = () => {

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    }
  return (
    <div className="success-wrapper">
      <h2 className="success-title">회원가입</h2>

      <div className="success-box">
        <div className="success-icon">🎉</div>
        <div className="success-message">
          <p className="highlight">회원가입을 축하합니다!!</p>
          <p>다양한 원데이 클래스와 모임을 모여링에서 즐겨보세요!</p>
        </div>

        <div className="success-buttons">
          <button className="success-btn" onClick={()=>handleNavigation('')}>클래스링 즐기러 가기</button>
          <button className="success-btn" onClick={()=>handleNavigation('')}>게더링 즐기러 가기</button>
        </div>
      </div>
    </div>
  );
};

export default UserJoinSuccess;