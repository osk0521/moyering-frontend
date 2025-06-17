import React from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserLogin from './pages/common/UserLogin';
import UserJoin from './pages/common/UserJoin';
import UserJoinCategory from './pages/common/UserJoinCategory';
import UserJoinSuccess from './pages/common/UserJoinSuccess';
import ClassCalendar from './pages/host/ClassCalendar';
import ClassDetail from './pages/host/ClassDetail/ClassDetail';
import ClassRegisterPage from './pages/host/ClassRegist/ClassRegisterPage';
import ClassReview from './pages/host/ClassReview';
import ClassSettlement from './pages/host/ClassSettlement';
import DashboardLayout from './pages/host/DashboardLayout';
import HostClassList from './pages/host/HostClassList';
import HostIntroPage from './pages/host/HostIntroPage';
import HostProfile from './pages/host/HostProfile';
import Inquiry from './pages/host/Inquiry';
import HostRegist from './pages/host/HostRegist.jsx';
import MainContent from './pages/host/MainContent';
import SettlementInfo from './pages/host/SettlementInfo';
import StudentSearch from './pages/host/StudentSearch';
import './App.css';
import FeedDetail from './pages/user/socialRing/FeedDetail';
import FeedPage from './pages/user/socialRing/FeedPage';
import Sidebar from './pages/user/socialRing/Sidebar';
import UserFeed from './pages/user/socialRing/UserFeed';
// 관리자 페이지
import BannerCreateModal from "./pages/admin/BannerCreateModal";
import BannerManagement from "./pages/admin/BannerManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ClassManagement from "./pages/admin/ClassManagement";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import MemberManagement from "./pages/admin/MemberManagement";
import NoticeCreate from "./pages/admin/NoticeCreate";

import FeedCreate from './pages/user/socialRing/FeedCreate.jsx';
import FeedEdit from './pages/user/socialRing/FeedEdit.jsx';
import MyFeed from './pages/user/socialRing/MyFeed.jsx';
import ScrapList from './pages/user/socialRing/ScrapList.jsx';
import FollowList from './pages/user/socialRing/Followlist.jsx';
import NoticeManagement from "./pages/admin/NoticeManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import ReportManagement from "./pages/admin/ReportManagement";
import SettlementManagement from "./pages/admin/SettlementManagement";
import TwoFactorAuth from "./pages/admin/TwoFactorAuth";
import ClassList from "./pages/common/ClassList.jsx";
import ClassRingDetail from "./pages/common/classRingDetail.jsx";
import HostRegist from './pages/host/HostRegist.jsx';
import Main from "./pages/common/Main.jsx";
import ClassInquiry from "./pages/user/0myPage/classRing/ClassInquiry.jsx";
import MyClassList from "./pages/user/0myPage/classRing/MyClassList.jsx";
import ReviewList from "./pages/user/0myPage/classRing/ReviewList.jsx";
import MyCouponList from "./pages/user/0myPage/common/MyCouponList.jsx";
import MySchedule from "./pages/user/0myPage/common/MySchedule.jsx";
import MyWishlist from "./pages/user/0myPage/common/MyWishlist.jsx";
import Header from "./pages/common/Header.jsx";
import ClassPayment from "./pages/user/classRing/ClassPayment.jsx";
//게더링
import GatheringDetail from "./pages/common/GatheringDetail";
import GatheringWrite from "./pages/user/gathering/GatheringWrite";
import GatheringModify from "./pages/user/gathering/GatheringModify";
import GatheringDetail from "./pages/common/GatheringDetail.jsx";
import GatheringWrite from "./pages/user/gathering/GatheringWrite.jsx";
import MyGatheringList from "./pages/user/0myPage/gathering/MyGatheringList";
import MyGatheringApplyList from "./pages/user/0myPage/gathering/MyGatheringApplyList";
import MyAlarmList from "./pages/user/0myPage/common/MyAlarmList.jsx";
import MyGatherInquiry from "./pages/user/0myPage/gathering/MyGatherInquiry";
import GatheringChat from './pages/user/gathering/GatheringChat';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* 공통 /~~~으로 시작 */}
        <Route path="/" element={<Main />} />
        <Route path="/classList" element={<ClassList />} />
        <Route path="/classRingDetail" element={<ClassRingDetail />} />
        <Route path="/gatheringDetail/:gatheringId" element={<GatheringDetail />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/userFeed" element={<UserFeed />} />
        <Route path="/feedDetail" element={<FeedDetail />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/feedCreate" element={<FeedCreate/>}/>
        <Route path="/feedEdit" element={<FeedEdit/>}/>
        <Route path="/myFeed" element={<MyFeed/>}/>
        <Route path="/scrapList" element={<ScrapList/>}/>
        <Route path="/followList" element={<FollowList/>}/>
        <Route path="/join" element={<UserJoin/>}/>
        <Route path="/joinCategory" element={<UserJoinCategory/>}/>
        <Route path="/joinSuccess" element={<UserJoinSuccess/>}/>
        <Route path="/userlogin" element={<UserLogin />} />
        {/* 로그인한 유저 /user/~~~ */}
        <Route path="/user/ClassPayment" element={<ClassPayment />} />
        <Route path="/user/gatheringWrite" element={<GatheringWrite />} />
        <Route path="/user/gatheringModify/:gatheringId" element={<GatheringModify />} />
        <Route exact path="/user/chat" element={<GatheringChat />}></Route>

        {/* 유저의 마이페이지 /user/mypage/~~~~ */}
        <Route path="/user/mypage/mySchedule" element={<MySchedule />} />
        <Route path="/user/mypage/reviewList" element={<ReviewList />} />
        <Route path="/user/mypage/classInquiry" element={<ClassInquiry />} />
        <Route path="/user/mypage/myCouponList" element={<MyCouponList />} />
        <Route path="/user/mypage/myClassList" element={<MyClassList />} />
        <Route path="/user/mypage/myWishlist" element={<MyWishlist />} />
        <Route exact path="/user/mypage/myGatheringList" element={<MyGatheringList />}></Route>
        <Route exact path="/user/mypage/myGatheringApplyList" element={<MyGatheringApplyList />}></Route>
        <Route exact path="/user/mypage/myGatheringApplyList" element={<MyGatheringApplyList />}></Route>
        <Route exact path="/user/mypage/myGatherInquiry" element={<MyGatherInquiry />}></Route>
        <Route path="/user/mypage/myAlarmList" element={<MyAlarmList />} />

        {/* 강사 /host/~~~~~ */}
        <Route path="/host/intro" element={<HostIntroPage />} />
        <Route path="/host/regist" element={<HostRegist/>}/> 
        <Route element={<DashboardLayout />}>
          <Route path="/host/hostMyPage" element={<MainContent />} />
          <Route path="/host/profile" element={<HostProfile />} />
          <Route path="/host/classRegist" element={<ClassRegisterPage />} />
          <Route path="/host/HostclassList" element={<HostClassList />} />
          <Route path="/host/students" element={<StudentSearch />} />
          <Route path="/host/settlementInfo" element={<SettlementInfo />} />
          <Route path="/host/inquiry" element={<Inquiry />} />
          <Route path="/host/calendar" element={<ClassCalendar />} />
          <Route path="/host/detail" element={<ClassDetail />} />
          <Route path="/host/classReview" element={<ClassReview />} />
          <Route path="/host/classSettlement" element={<ClassSettlement />} />

        </Route>
        {/* 관리자 /admin/~~~~ */}
        {/* 1차 로그인 화면  */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />

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
      



      
      {/* 관리자(/admin) */}
        <Route path="/admin" element={<Login />} />                         {/* 1차 로그인 화면  */} 
        <Route path="/admin/verify" element={<TwoFactorAuth />} />          {/* 2차 로그인 화면 (인증번호 입력) */}
        <Route path="/admin/dashboard" element={<Dashboard />} />        {/* 대시보드 페이지 */}
        <Route path="/admin/member" element={<MemberManagement/>} />   {/* 회원 관리 페이지 */}
        <Route path="/admin/class" element={<ClassManagement />} />   {/* 클래스 관리 페이지 */}
        <Route path="/admin/notice" element={<NoticeManagement />} />    {/* 공지사항 관리 페이지  */}
        <Route path="/admin/notice/create" element={<NoticeCreate />} />     {/* 공지사항 생성 모달  */}
        <Route path="/admin/report" element={<ReportManagement />} />       {/* 신고관리 페이지  */}
        <Route path="/admin/banner" element={<BannerManagement />} />    {/* 배너관리 페이지  */}
        <Route path="/admin/banner/create" element={<BannerCreateModal />} />  {/* 배너등록 모달  */}
        <Route path="/admin/payment" element={<PaymentManagement />} />     {/* 결제관리 페이지  */}
        <Route path="/admin/settlement" element={<SettlementManagement />} />          {/* 정산관리 페이지  */}      
        <Route path="/admin/category" element={<CategoryManagement />} />    {/* 카테고리 관리 페이지  */}
        </Routes>
    </Router>
  );
}

export default App;
