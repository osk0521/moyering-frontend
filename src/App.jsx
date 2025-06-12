import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import FeedPage from './pages/user/socialRing/FeedPage';
import UserFeed from './pages/user/socialRing/UserFeed';
import FeedDetail from './pages/user/socialRing/FeedDetail';
import Sidebar from './pages/user/socialRing/Sidebar';
function App() {

  return (
    <>
    <Routes>

      {/* 공통 /~~~으로 시작 */}
      <Route path="/feed" element={<FeedPage/>}/>
      <Route path="/userFeed" element={<UserFeed/>}/>
      <Route path="/feedDetail" element={<FeedDetail/>}/>
      <Route path="/sidebar" element={<Sidebar/>}/>
      {/* 로그인한 유저 /user/~~~ */}

      {/* 유저의 마이페이지 /user/mypage/~~~~ */}

      {/* 강사 /host/~~~~~ */}
      
      {/* 관리자 /admin/~~~~ */}

      
    </Routes>
    </>
  )
}

export default App
