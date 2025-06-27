// src/components/Login.jsx
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import React from 'react'; 

const Login = () => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState({
   username: '',
   password: ''
 });
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   setError('');
   
   try {
     // 실제 로그인 API 호출
     console.log('로그인 시도:', formData);
     
     // 1. 백엔드가 인식할 수 있도록 Form-Data 형식으로 요청을 보냄
     const params = new URLSearchParams();
     params.append('username', formData.username);
     params.append('password', formData.password);

     const response = await axios.post('/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('전체 응답:', response);
      console.log('응답 헤더:', response.headers);
      console.log('Authorization 헤더:', response.headers['authorization']);
     
     // 2. 백엔드 응답(헤더: 토큰, 바디: 사용자정보)에 맞춰 파싱
     const rawTokenHeader = response.headers['authorization'];
     if (!rawTokenHeader) {
        throw new Error("Authorization 헤더가 응답에 없습니다.");
     }

     const tokenInfo = JSON.parse(rawTokenHeader);
     const accessToken = tokenInfo.access_token;
     const userType = response.data.userType;
     console.log('파싱된 accessToken:', accessToken);

     // 토큰과 역할 정보 저장
     localStorage.setItem('token', accessToken);
     localStorage.setItem('role', userType);
     
     // axios 헤더에 토큰 자동 설정
     axios.defaults.headers.common['Authorization'] = accessToken;
     
     console.log('로그인 성공, userType:', userType);
     
     // 역할별 페이지 이동
     if (userType === 'ROLE_MG') {
       navigate('/admin/dashboard');
     } else {
       navigate('/'); // 일반 사용자는 메인 페이지로
     }
     
   } catch (error) {
     console.error('로그인 실패:', error);
     setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
   } finally {
     setLoading(false);
   }
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
         {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
         
         <div className="input-groupHY">
           <label htmlFor="username" className="input-labelHY">아이디</label>
           <input
             type="text"
             id="username"
             name="username"
             value={formData.username}
             onChange={handleInputChange}
             placeholder="관리자 아이디"
             className="input-fieldHY"
             required
           />
         </div>

         <div className="input-groupHY">
           <label htmlFor="password" className="input-labelHY">비밀번호</label>
           <input
             type="password"
             id="password"
             name="password"
             value={formData.password}
             onChange={handleInputChange}
             placeholder="비밀번호"
             className="input-fieldHY"
             required
           />
         </div>

         <button 
           type="submit" 
           className="login-buttonHY"
          //  disabled={loading}
         >
           {/* {loading ? '로그인 중...' : '로그인'} */}
           로그인
         </button>
       </form>
     </div>
   </div>
 );
};

export default Login;