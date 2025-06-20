// src/components/Login.jsx
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

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
     
     const response = await axios.post('/api/login', {
       username: formData.username,
       password: formData.password
     });
     
     // 토큰과 역할 정보 저장
     localStorage.setItem('token', response.data.token);
     localStorage.setItem('role', response.data.role);
     
     // axios 헤더에 토큰 자동 설정
     axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
     
     console.log('로그인 성공:', response.data.role);
     
     // 역할별 페이지 이동 - ROLE_MG일 경우에 /admin/verify로 넘어가야해
     if (response.data.role === 'ROLE_MG') {
       navigate('/admin/verify');
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