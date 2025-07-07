// FindId.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { myAxios } from '../../config';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from './../../atoms';
import LoginHeader from './LoginHeaders';
import './FIndId.css'
import { Navigate, useNavigate } from 'react-router';



const FindId = () => {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [foundId, setFoundId] = useState('');
  const [token, setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  const handleFindId = () => {
    if (!name.trim() || !tel.trim()) {
      alert("이름과 전화번호를 모두 입력해주세요!");
      return;
    }
    const params = {
      name: name,
      tel: tel
    }
    myAxios().post("/api/auth/findId", params)
      .then(res => {
        console.log(res);
        setFoundId(res.data);
      })
      .catch(err => {
        console.log(err);
        alert('입력하신 정보에 맞는 아이디가 없습니다!')
      })
  };

  const maskId = (id) => {
    if (!id) return '';

    const length = id.length;
    const visibleLength = Math.floor(length / 2);
    const maskedLength = length - visibleLength;

    const visible = id.slice(0, visibleLength);
    const masked = '*'.repeat(maskedLength);

    return visible + masked;
  };

  return (
    <>
      <LoginHeader />
      <div className="KHJ-findid-container">
        <div className="KHJ-findid-box">
          <h2 className="KHJ-findid-title">아이디 찾기</h2>
          <input
            className="KHJ-findid-input"
            placeholder="이름"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="KHJ-findid-input"
            placeholder="전화번호"
            onChange={(e) => setTel(e.target.value)}
          />
          <div>
            <a className='KHJ-join-btn' onClick={() => navigate('/userlogin')}>로그인하러 가기</a>&nbsp;
            <span className='KHJ-join-btn'>/</span>&nbsp;
            <a className='KHJ-join-btn' onClick={() => navigate('/findPassword')}>비밀번호 찾기</a>
          </div>
          <br />
          <button className="KHJ-findid-btn" onClick={handleFindId}>
            찾기
          </button>
          {foundId && (
            <div className="KHJ-findid-result">찾은 아이디: {maskId(foundId)}</div>
          )}
        </div>
      </div>
    </>
  );
};


export default FindId;