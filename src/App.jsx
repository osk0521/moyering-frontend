import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLogin from './pages/common/UserLogin';
import HostIntroPage from './pages/host/HostIntroPage';
import DashboardLayout from './pages/host/DashboardLayout';
import MainContent from './pages/host/MainContent';
import HostProfile from './pages/host/HostProfile';
import ClassRegisterPage from './pages/host/ClassRegist/ClassRegisterPage';
import HostClassList from './pages/host/HostClassList';
import StudentSearch from './pages/host/StudentSearch';
import SettlementInfo from './pages/host/SettlementInfo';
import Inquiry from './pages/host/Inquiry';
import ClassCalendar from './pages/host/ClassCalendar';
import ClassDetail from './pages/host/ClassDetail/ClassDetail';
import ClassReview from './pages/host/ClassReview';
import ClassSettlement from './pages/host/ClassSettlement';
import React from 'react';

// 관리자 페이지
import Login from './pages/admin/Login';
import TwoFactorAuth from './pages/admin/TwoFactorAuth';
import Dashboard from './pages/admin/Dashboard';
import MemberManagement from './pages/admin/MemberManagement';
import ClassManagement from './pages/admin/ClassManagement';
import NoticeManagement from './pages/admin/NoticeManagement';
import ReportManagement from './pages/admin/ReportManagement';
import BannerManagement from './pages/admin/BannerManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import SettlementManagement from './pages/admin/SettlementManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import NoticeCreate from "./pages/admin/NoticeCreate";
import BannerCreateModal from "./pages/admin/BannerCreateModal";

import Main from './pages/common/Main.jsx';
import ClassList from './pages/common/ClassList.jsx';
import Footer from './components/Footer.jsx';
import MySchedule from './pages/user/0myPage/common/MySchedule.jsx';
import ReviewList from './pages/user/0myPage/classRing/ReviewList.jsx';
import ClassInquiry from './pages/user/0myPage/classRing/ClassInquiry.jsx';
import MyCouponList from './pages/user/0myPage/common/MyCouponList.jsx';
import MyClassList from './pages/user/0myPage/classRing/MyClassList.jsx';
import ClassPayment from './pages/user/classRing/ClassPayment.jsx';
import ClassRingDetail from './pages/common/classRingDetail.jsx';
import MyWishlist from './pages/user/0myPage/common/MyWishlist.jsx';
function App() {

  return (
    <Router>
      <Routes>
      {/* 공통 /~~~으로 시작 */}
      <Route path="/" element={<Main />} />
      <Route path="/classList" element={<ClassList />} />
      <Route path="/classRingDetail" element={<ClassRingDetail />} />
      {/* 로그인한 유저 /user/~~~ */}
      <Route path="/user/ClassPayment" element={<ClassPayment />} />
      {/* 유저의 마이페이지 /user/mypage/~~~~ */}
      <Route path="/user/mypage/mySchedule" element={<MySchedule />} />
      <Route path="/user/mypage/reviewList" element={<ReviewList />} />
      <Route path="/user/mypage/classInquiry" element={<ClassInquiry />} />
      <Route path="/user/mypage/myCouponList" element={<MyCouponList />} />
      <Route path="/user/mypage/myClassList" element={<MyClassList />} />
      <Route path="/user/mypage/myWishlist" element={<MyWishlist />} />
      {/* 강사 /host/~~~~~ */}
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/intro" element={<HostIntroPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/hostMyPage" element={<MainContent />} />
            <Route path="/profile" element={<HostProfile />} />
            <Route path="/register" element={<ClassRegisterPage />} />
            <Route path="/HostclassList" element={<HostClassList />} />
            <Route path="/students" element={<StudentSearch />} />
            <Route path="/settlementInfo" element={<SettlementInfo />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/calendar" element={<ClassCalendar />} />
            <Route path="/detail" element={<ClassDetail />} />
            <Route path="/classReview" element={<ClassReview />} />
            <Route path="/classSettlement" element={<ClassSettlement />} />
          </Route>
      {/* 관리자 /admin/~~~~ */}
          {/* 1차 로그인 화면  */}
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          {/* 2차 로그인 화면 (인증번호 입력) */}
          <Route path="/verify" element={<TwoFactorAuth />} />

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
        </Routes>
    </Router>
  )
}

export default App
