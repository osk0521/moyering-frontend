
import { Route, Routes } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import FeedDetail from './pages/user/socialRing/FeedDetail';
import FeedPage from './pages/user/socialRing/FeedPage';
import Sidebar from './pages/user/socialRing/Sidebar';
import UserFeed from './pages/user/socialRing/UserFeed';
// 관리자 페이지
import BannerCreateModal from "./pages/admin/BannerCreateModal";
import BannerManagement from './pages/admin/BannerManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ClassManagement from './pages/admin/ClassManagement';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import MemberManagement from './pages/admin/MemberManagement';
import NoticeCreate from "./pages/admin/NoticeCreate";
import NoticeManagement from './pages/admin/NoticeManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import ReportManagement from './pages/admin/ReportManagement';
import SettlementManagement from './pages/admin/SettlementManagement';
import TwoFactorAuth from './pages/admin/TwoFactorAuth';


import './App.css';
import ClassList from './pages/common/ClassList.jsx';
import ClassRingDetail from './pages/common/classRingDetail.jsx';
import Main from './pages/common/Main.jsx';
import ClassInquiry from './pages/user/0myPage/classRing/ClassInquiry.jsx';
import MyClassList from './pages/user/0myPage/classRing/MyClassList.jsx';
import ReviewList from './pages/user/0myPage/classRing/ReviewList.jsx';
import MyCouponList from './pages/user/0myPage/common/MyCouponList.jsx';
import MySchedule from './pages/user/0myPage/common/MySchedule.jsx';
import MyWishlist from './pages/user/0myPage/common/MyWishlist.jsx';
import ClassPayment from './pages/user/classRing/ClassPayment.jsx';

function App() {

  return (

    <Router>
      <Routes>

        {/* 공통 /~~~으로 시작 */}
        <Route path="/" element={<Main />} />
        <Route path="/classList" element={<ClassList />} />
        <Route path="/classRingDetail" element={<ClassRingDetail />} />
        {/* 공통 /~~~으로 시작 */}
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/userFeed" element={<UserFeed />} />
        <Route path="/feedDetail" element={<FeedDetail />} />
        <Route path="/sidebar" element={<Sidebar />} />
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

        {/* 관리자 /admin/~~~~ */}
        {/* 1차 로그인 화면  */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />

        {/* 2차 로그인 화면 (인증번호 입력) */}
        <Route path="/verify" element={<TwoFactorAuth />} />

        {/* 대시보드 페이지 */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* 회원 관리 페이지 */}
        <Route path="/admin/member" element={<MemberManagement />} />

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
