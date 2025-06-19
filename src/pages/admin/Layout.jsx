import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: '📊', path: '/admin/dashboard' },
    { id: 'member', label: '회원관리', icon: '👥', path: '/admin/member' },
    { id: 'class', label: '클래스 관리', icon: '📚', path: '/admin/class' },
    { id: 'payment', label: '결제 관리', icon: '💳', path: '/admin/payment' },
    { id: 'settlement', label: '정산 관리', icon: '💳', path: '/admin/settlement' },
    { id: 'coupon', label: '쿠폰 관리', icon: '💳', path: '/admin/coupon' },
    // { id: 'category', label: '카테고리 관리', icon: '💳', path: '/admin/category' },
    { id: 'badge', label: '배지 관리', icon: '🏅', path: '/admin/badge' },
    { id: 'banner', label: '배너 관리', icon: '🖼️', path: '/admin/banner' },
    { id: 'statistics', label: '통계 리포트', icon: '📈', path: '/admin/statistics' },
    { id: 'report', label: '신고 관리', icon: '🚨', path: '/admin/report' },
    { id: 'notice', label: '공지사항 관리', icon: '📢', path: '/admin/notice' },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="admin-layoutHY">
      {/* 사이드바 */}
      <aside className="sidebarHY">
        <div className="sidebar-headerHY">
          {/* 로고나 제목 추가 가능 */}
        </div>
        <nav className="sidebar-navHY">
          <ul className="menu-listHY">
            {menuItems.map((item) => (
              <li key={item.id} className="menu-itemHY">
                <button
                  className={`menu-linkHY ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <span className="menu-iconHY">{item.icon}</span>
                  <span className="menu-labelHY">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

    
      
        {/* 헤더 */}
        <header className="headerHY">
          <div className="header-leftHY">
            <div className="header-logoHY">
              <img src="/logo_managerHeader.png" alt="모여링 로고" className="header-logo-iconHY" />
            </div>
          </div>
          <div className="header-rightHY">
            <span className="admin-nameHY">관리자123</span>
            <button className="logout-btnHY" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="main-contentHY">
          <main className="page-contentHY">{children}</main>
        </div>
      </div>
  
  );
};

export default Layout;