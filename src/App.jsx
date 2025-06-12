import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/common/Login';
import HostIntroPage from './pages/host/HostIntroPage';
import DashboardLayout from './pages/host/DashboardLayout';
import MainContent from './pages/host/MainContent';
import HostProfile from './pages/host/HostProfile';
import ClassRegisterPage from './pages/host/ClassRegist/ClassRegisterPage';
import ClassList from './pages/host/ClassList';
import StudentSearch from './pages/host/StudentSearch';
import SettlementInfo from './pages/host/SettlementInfo';
import Inquiry from './pages/host/Inquiry';
import ClassCalendar from './pages/host/ClassCalendar';
import ClassDetail from './pages/host/ClassDetail/ClassDetail';
import ClassReview from './pages/host/ClassReview';
import ClassSettlement from './pages/host/ClassSettlement';

function App() {

  return (
    <>
      {/* 공통 /~~~으로 시작 */}

      {/* 로그인한 유저 /user/~~~ */}

      {/* 유저의 마이페이지 /user/mypage/~~~~ */}

      {/* 강사 /host/~~~~~ */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/intro" element={<HostIntroPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/hostMyPage" element={<MainContent />} />
            <Route path="/profile" element={<HostProfile />} />
            <Route path="/register" element={<ClassRegisterPage />} />
            <Route path="/classList" element={<ClassList />} />
            <Route path="/students" element={<StudentSearch />} />
            <Route path="/settlementInfo" element={<SettlementInfo />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/calendar" element={<ClassCalendar />} />
            <Route path="/detail" element={<ClassDetail />} />
            <Route path="/classReview" element={<ClassReview />} />
            <Route path="/classSettlement" element={<ClassSettlement />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* 관리자 /admin/~~~~ */}

    </>
  )
}

export default App
