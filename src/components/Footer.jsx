import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-soy">
      <div className='logo'>
        <img src="../../public/logo.png" alt="" />
      </div>
      <div className="footer-inner">
        <p>© 모여링 | 고객센터 </p>
        <p>주소: 서울시 모여구 클래스동 123</p>
      </div>
    </footer>
  );
}

export default Footer;
