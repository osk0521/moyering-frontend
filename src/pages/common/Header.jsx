import "bootstrap/dist/css/bootstrap.min.css";
import { CiSearch } from "react-icons/ci";
import { FaHeart, FaRegBell } from "react-icons/fa6";
import { LuMessageCircleMore } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input } from "reactstrap";
import "./Header.css";
import logoImage from "/logo.png";
import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios, url } from "../../config";

const Header = () => {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);
  
  const [userInfo, setUserInfo] = useState({
    userId: "",
    nickName: "",
    profile: "",
  });

  const logout= ()=>{
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
     window.location.href = '/'; // 로그인 페이지로 이동
  }

  useEffect(() => {
    console.log(user);
    if (user) {
      setUserInfo({
        userId: user.id,
        nickName: user.nickName,
        profile: user.profile,
      });
    } 
  }, [user]);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="Header_header-container_osk">
      <div className="Header_top-menu-bar_osk">
        <div className="Header_top-menu-items_osk">
          {token&&user ? (
            <>
              <span className="Header_top-menu-link_osk">
                <img
                  src={
                    userInfo.profile 
                      ? `${url}/image?filename=${userInfo.profile}` 
                      : '/profile.png'
                  }
                  alt={`${userInfo.nickName}`}
                  className="Header_profile-image_osk"
                  />
                <span>{userInfo.nickName} 님</span>
              </span>
              <Button className="Header_icon-button_osk Header_heart-button_osk">
                <FaHeart className="Header_top-icon_osk login" />
              </Button>
              <Button className="Header_icon-button_osk">
                <FaRegBell className="Header_top-icon_osk" />
              </Button>
              <Button className="Header_icon-button_osk">
                <a href="/user/chat">
                  <LuMessageCircleMore className="Header_top-icon_osk" />
                </a>
              </Button>
              <span className="Header_top-menu-link_osk">
                <a href="/user/mypage/mySchedule">마이페이지</a>
              </span>
              <span className="Header_top-menu-link_osk">
                <a href="/">호스트페이지</a>
              </span>
              <span className="Header_top-menu-link_osk">
                <button onClick={logout}>로그아웃</button>
              </span>
            </>
          ) : (
            <>
              <span className="Header_top-menu-link_osk">
                <a href="/userlogin">로그인</a>
              </span>
              <span className="Header_top-menu-link_osk">
                <a href="/join">회원가입</a>
              </span>
              
              <Button className="Header_icon-button_osk Header_heart-button_osk">
                <FaHeart className="Header_top-icon_osk" />
              </Button>
              <Button className="Header_icon-button_osk">
                <FaRegBell className="Header_top-icon_osk" />
              </Button>
              <Button className="Header_icon-button_osk">
                  <LuMessageCircleMore className="Header_top-icon_osk" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="Header_main-header_osk">
        <div className="Header_header-content_osk">
          {/* 로고 섹션 */}
          <div
            className="Header_logo-section_osk"
            onClick={() => navigate(`/`)}
            style={{ cursor: "pointer" }}
          >
            <div className="Header_logo-container_osk">
              <img
                src={logoImage}
                alt="모여링 로고"
                className="Header_logo-image_osk"
              />
            </div>
          </div>

          {/* 검색바 */}
          <div className="Header_search-section_osk">
            <Form>
              <div className="Header_search-container_osk">
                <Input
                  type="text"
                  placeholder="다양한 컨텐츠를 찾아보세요!"
                  className="Header_search-input_osk"
                />
                <Button className="Header_search-button_osk ">
                  <CiSearch size={20} />
                </Button>
              </div>
            </Form>
          </div>

          {/* 네비게이션 메뉴 */}
          <div className="Header_nav-section_osk">
            <span
              className="Header_nav-item_osk"
              onClick={() => navigate("/host/intro")}
            >
              클래스잉
            </span>
            <span className="Header_nav-item_osk">게더링</span>
            <span className="Header_nav-item_osk">소셜링</span>
            <span className="Header_nav-item_osk">공지사항</span>
            <span className="Header_nav-item_osk">고객센터</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
