// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import axios from 'axios';
import { myAxios, url } from '../../config';
import { useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';

const Login = () => {
  const [login,setLogin] = useState({username:'',password:''})
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);
  const navigate = useNavigate();

  const edit = (e) => {
    setLogin({...login,[e.target.name]:e.target.value});
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("username",login.username);
    formData.append("password",login.password);
    myAxios().post("login", formData)
      .then(res => {
        console.log(res);
        setToken(res.headers.authorization);
        const user = res.data;
        setUser({...user});
        navigate("/admin/dashboard");
      })
      .catch(err=>{
        console.log(err);
      })
    // 일단 간단하게 - 로그인 버튼 누르면 2차 인증으로 이동
  };
 
 

 

 return (
   <div className="login-containerHY">
     <div className="login-boxHY">
       <div className="logo-sectionHY">
         <div className="logoHY">
           <img src="/logo_managerLogin.png" alt="모여링 로고" className="logo-imageHY" />
         </div>
       </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="login-formHY">
          <div className="input-groupHY">
            <label htmlFor="username" className="input-labelHY">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={login.username}
              onChange={edit}
              placeholder="관리자 아이디"
              className="input-fieldHY"
            />
          </div>

          <div className="input-groupHY">
            <label htmlFor="password" className="input-labelHY">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={login.password}
              onChange={edit}
              placeholder="비밀번호"
              className="input-fieldHY"
            />
          </div>
       {/* 로그인 폼 */}
       

         <button 
           type="submit" 
           className="login-buttonHY"
           disabled={loading}
         >
           {loading ? '로그인 중...' : '로그인'}
         </button>
       </form>
     </div>
   </div>
 );
};

export default Login;