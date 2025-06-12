import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      
      {/* 관리자 /admin/~~~~ */}
      </Routes>
    <Footer/>
    </Router>
  )
}

export default App
