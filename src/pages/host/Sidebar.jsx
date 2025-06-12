import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="KHJ-sidebar">
      <div className="KHJ-sidebar__logo" onClick={() => navigate('/hostMyPage')}>
        <img src="/hostlogo.png" alt="로고" className="KHJ-sidebar__logo-img" />
      </div>

      <div className="KHJ-sidebar__button-row">
        <button className="KHJ-sidebar__btn" onClick={() => handleNavigation('/register')}>클래스등록</button>
        <button className="KHJ-sidebar__btn" onClick={() => handleNavigation('/HostclassList')}>클래스목록</button>
      </div>

      <nav>
        <ul className="KHJ-sidebar__menu">
          <li className="KHJ-sidebar__menu-title" onClick={() => toggleSection('info')}>
            내 정보
            <svg className={`KHJ-sidebar__arrow-icon ${openSection === 'info' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24">
              <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </li>
          <ul className={`KHJ-sidebar__submenu ${openSection === 'info' ? 'open' : ''}`}>
            <li onClick={() => handleNavigation('/profile')}>프로필 관리</li>
            <li onClick={() => handleNavigation('/settlementInfo')}>정산정보관리</li>
          </ul>

          <li className="KHJ-sidebar__menu-title" onClick={() => toggleSection('class')}>
            클래스 관리
            <svg className={`KHJ-sidebar__arrow-icon ${openSection === 'class' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24">
              <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </li>
          <ul className={`KHJ-sidebar__submenu ${openSection === 'class' ? 'open' : ''}`}>
            <li onClick={() => handleNavigation('/classList')}>클래스목록</li>
            <li onClick={() => handleNavigation('/students')}>수강생관리</li>
            <li onClick={() => handleNavigation('/inquiry')}>문의관리</li>
            <li onClick={() => handleNavigation('/classReview')}>리뷰관리</li>
            <li onClick={() => handleNavigation('/calendar')}>일정캘린더</li>
          </ul>

          <li className="KHJ-sidebar__menu-title" onClick={() => toggleSection('settlement')}>
            정산관리
            <svg className={`KHJ-sidebar__arrow-icon ${openSection === 'settlement' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24">
              <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </li>
          <ul className={`KHJ-sidebar__submenu ${openSection === 'settlement' ? 'open' : ''}`}>
            <li onClick={() => handleNavigation('/classSettlement')}>정산계좌</li>
          </ul>
        </ul>
      </nav>
    </aside>
  );
}
