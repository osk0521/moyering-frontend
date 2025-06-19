import { Outlet } from 'react-router-dom';
import React from 'react'; // 이 한 줄만 추가!
import './DashboardLayout.css'; // KHJ 스타일 적용됨
import Sidebar from './Sidebar';
import Header from './Headers';

export default function DashboardLayout() {
  return (
    <div className="KHJ-app-wrapper">
      <Sidebar />
      <div className="KHJ-main-area">
        <Header />
        <div className="KHJ-main-content">
          <Outlet /> {/* 여기에 각 페이지 컴포넌트가 렌더링됨 */}
        </div>
      </div>
    </div>
  );
}
