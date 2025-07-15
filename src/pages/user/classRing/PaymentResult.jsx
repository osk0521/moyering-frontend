import React from 'react';
import './PaymentResult.css';
import { useNavigate } from 'react-router';
import Header from "../../../pages/common/Header";
import Footer from "../../../pages/common/Footer";

const PaymentResult = () => {

    const navigate = useNavigate();

    return (
    <>
        <div className="success-wrapper">
        <h2 className="success-title">클래스링 결제</h2>

        <div className="success-box">
            <div className="success-icon">🎉</div>
            <div className="success-message">
            <p className="highlight">결제가 완료되었습니다!!</p>
            <p>클래스 신청이 성공적으로 처리되었습니다!</p>
            </div>

            <div className="success-buttons">
            <button className="success-btn" onClick={() => navigate('/user/mypage/myClassRegistList')}>나의 수강 목록가기</button>
            <button className="success-btn" onClick={() => navigate('/')}>메인으로 가기</button>
            </div>
        </div>
        </div>
    </>
    );
};

export default PaymentResult;
