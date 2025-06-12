import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 관리자 페이지
import Login from './pages/admin/Login';
import TwoFactorAuth from './pages/admin/TwoFactorAuth';
import MemberManagement from './pages/admin/MemberManagement';
import ClassManagement from './pages/admin/ClassManagement';
import NoticeManagement from './pages/admin/NoticeManagement';
import NoticeCreate from './pages/admin/NoticeCreate';
import ReportManagement from './pages/admin/ReportManagement';
import BannerManagement from './pages/admin/BannerManagement';
import BannerCreateModal from './pages/admin/BannerCreateModal';
import PaymentManagement from './pages/admin/PaymentManagement';
import SettlementManagement from './pages/admin/SettlementManagement';
import Dashboard from './pages/admin/Dashboard';
import CategoryManagement from './pages/admin/CategoryManagement';

import './App.css'

function App() {

  return (
    <Router>
      {/* 공통 /~~~으로 시작 */}

      {/* 로그인한 유저 /user/~~~ */}

      {/* 유저의 마이페이지 /user/mypage/~~~~ */}

      {/* 강사 /host/~~~~~ */}
      
      {/* 관리자 /admin/~~~~ */}
                {/* 1차 로그인 화면  */}
                <Route path="/admin" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          {/* 2차 로그인 화면 (인증번호 입력) */}
          <Route path="/admin/auth/verify" element={<TwoFactorAuth />} />

        {/* 대시보드 페이지 */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          
          {/* 회원 관리 페이지 */}
          <Route path="/admin/member" element={<MemberManagement/>} />

           {/* 클래스 관리 페이지 */}
          <Route path="/admin/class" element={<ClassManagement />} />

          {/* 공지사항 관리 페이지  */}
        <Route path="/admin/notice" element={<NoticeManagement />} />

          {/* 공지사항 생성 페이지  */}
        <Route path="/admin/notice/create" element={<NoticeCreate />} />

            {/* 신고관리 페이지  */}
        <Route path="/admin/report" element={<ReportManagement />} />

          {/* 배너관리 페이지  */}
        <Route path="/admin/banner" element={<BannerManagement />} />

          {/* 배너등록 페이지  */}
        <Route path="/admin/banner/create" element={<BannerCreateModal />} />

          {/* 결제관리 페이지  */}
        <Route path="/admin/payment" element={<PaymentManagement />} />

          {/* 정산관리 페이지  */}
        <Route path="/admin/settlement" element={<SettlementManagement />} />


          {/* 카테고리 관리 페이지  */}
        <Route path="/admin/category" element={<CategoryManagement />} />

    </Router>
  )
}

export default App
