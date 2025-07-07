import React, { useState } from 'react';
import { myAxios } from '../../config';
import { useNavigate } from 'react-router';
import Header from './Header';
import LoginHeader from './LoginHeaders';
import './ResetPassword.css'

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            alert("비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        const params = {
            username: username,
                password: newPassword
        }
        myAxios().post('/changePassword',params)
            .then(res => {
                alert("비밀번호가 성공적으로 변경되었습니다!");
                navigate('/userlogin');
            })
            .catch(err => {
                alert("비밀번호 변경 실패");
                console.log(err);
            });
    };

    return (
        <>
            <LoginHeader />
            <div className="KHJ-reset-container">
                <h2>비밀번호 재설정</h2>
                <form onSubmit={handleResetPassword}>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" >재설정</button>
                </form>
            </div>
        </>
    );
};

export default ResetPassword;