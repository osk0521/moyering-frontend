// FindPassword.jsx
import React, { useState } from 'react';
import { myAxios } from '../../config';
import LoginHeader from './LoginHeaders';
import './FindPassword.css';
import { useNavigate } from 'react-router';

const FindPassword = () => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyStatus, setVerifyStatus] = useState(false);
    const[foundPass, setFoundPass] = useState('');
    const navigate = useNavigate();

    const handleEmailVerify = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("이름을 입력해주세요!");
            return;
        }
        if (!userId.trim()) {
            alert("아이디를 입력해주세요!");
            return;
        }
        if (!email.trim()) {
            alert("이메일을 입력해주세요!");
            return;
        }

        myAxios().post(`/api/auth/sendEmail`, null, {
            params: {
                username: userId,
                name: name,
                email: email
            }
        })
            .then((res) => {
                console.log(res);
                alert('인증코드를 전송했습니다.');
                setIsEmailSent(true);
            })
            .catch(err => {
                console.log(err);
                alert('인증코드 전송 실패');
            });
    };

    const handleCodeVerify = () => {
        if (!verifyCode.trim()) {
            alert("인증번호를 입력해주세요!");
            return;
        }
        myAxios().get('/api/auth/verify', {
            params: {
                token: verifyCode
            }
        })
            .then(res => {
                alert("인증 성공!");
                setVerifyStatus(true);
            })
            .catch(err => {
                alert("인증 실패: 코드가 올바르지 않습니다.");
            });
    };

    const handleFindPassword = () => {
        const params = {
            name: name,
            username: userId,
            email: email,
        }
        myAxios().post("/api/auth/findPassword", params)
            .then(res => {
                console.log(res.data);
                setFoundPass(res.data);
                navigate('/resetPassword')
            })
            .catch(err => {
                console.log(err);
                alert("입력하신 정보에 맞는 비밀번호가 없습니다.")
            })
    }

    // 필요하면 패스워드 블러처리 가능
    // const maskPass = (pass) => {
    //     if (!pass) return '';

    //     const length = pass.length;
    //     const visibleLength = Math.floor(length / 2);
    //     const maskedLength = length - visibleLength;

    //     const visible = pass.slice(0, visibleLength);
    //     const masked = '*'.repeat(maskedLength);

    //     return visible + masked;
    // };

    return (
        <>
            <LoginHeader />
            <div className="KHJ-findpw-container">
                <div className="KHJ-findpw-box">
                    <h2 className="KHJ-findpw-title">비밀번호 찾기</h2>
                    <input
                        className="KHJ-findpw-input"
                        placeholder="이름"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="KHJ-findpw-input"
                        placeholder="아이디"
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <div className="KHJ-auth-row">
                        <input
                            className="KHJ-auth-input"
                            value={email}
                            placeholder="이메일"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="KHJ-auth-btn" onClick={handleEmailVerify}>인증</button>
                    </div>
                    <div className="KHJ-auth-row">
                        <input
                            className="KHJ-auth-input"
                            placeholder="인증번호"
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value)}
                        />

                        {isEmailSent && (
                            <button className="KHJ-auth-btn" onClick={() => handleCodeVerify()}>
                                인증확인
                            </button>
                        )}
                    </div>
                    <div>
                        <a className='KHJ-join-btn' onClick={() => navigate('/userlogin')}>로그인하러 가기</a>&nbsp;
                        <span className='KHJ-join-btn'>/</span>&nbsp;
                        <a className='KHJ-join-btn' onClick={() => navigate('/findId')}>아이디 찾기</a>
                    </div>
                    <br />
                    <button
                        className="KHJ-findpw-btn"
                        disabled={!(
                            name.trim() &&
                            userId.trim() &&
                            email.trim() &&
                            verifyCode.trim() &&
                            verifyStatus
                        )}
                        onClick={handleFindPassword}
                    >
                        찾기
                    </button>
                    {foundPass && (
                        <div className="KHJ-findid-result">찾은 비밀번호: {foundPass}</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FindPassword;
