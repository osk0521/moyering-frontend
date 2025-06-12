import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: '📊', path: '/dashboard' },
    { id: 'member', label: '회원관리', icon: '👥', path: '/member' },
    { id: 'class', label: '클래스 관리', icon: '📚', path: '/class' },
    { id: 'payment', label: '결제 관리', icon: '💳', path: '/payment' },
    { id: 'settlement', label: '정산 관리', icon: '💳', path: '/settlement' },
    { id: 'coupon', label: '쿠폰 관리', icon: '💳', path: '/coupon' },
    { id: 'category', label: '카테고리 관리', icon: '💳', path: '/category' },
    { id: 'badge', label: '배지 관리', icon: '🏅', path: '/badge' },
    { id: 'banner', label: '배너 관리', icon: '🖼️', path: '/banner' },
    { id: 'statistics', label: '통계 리포트', icon: '📈', path: '/statistics' },
    { id: 'report', label: '신고 관리', icon: '🚨', path: '/report' },
    { id: 'notice', label: '공지사항 관리', icon: '📢', path: '/notice' },
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
  
        </div>
        <nav className="sidebar-navHY">
          <ul className="menu-listHY">
            {menuItems.map((item) => (
              <li key={item.id} className="menu-itemHY">
                <button
                  className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
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
      <div className="main-areaHY">
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
          <main className="page-contentHYHY">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
