import React, { useState, useCallback } from "react";
import { Button, Input, Form } from "reactstrap";
import { CiHeart, CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa6";
import { LuMessageCircleMore } from "react-icons/lu";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import logoImage from "../../../public/logo.png";


const Header = () => {
  return (
    <div className="Header_Header-container_osk">
      {/* 상단 작은 메뉴바 */}
      <div className="Header_top-menu-bar_osk">
        <div className="Header_top-menu-items_osk">
          <span className="Header_top-menu-link_osk">
            <a href="">로그인</a>
          </span>
          <span className="Header_top-menu-link_osk">
            <a href="">회원가입</a>
          </span>
          <Button className="Header_icon-button_osk">
            <CiHeart className="Header_top-icon_osk" />
          </Button>
          <Button className="Header_icon-button_osk">
            <FaRegBell className="Header_top-icon_osk" />
          </Button>
          <Button className="Header_icon-button_osk">
            <LuMessageCircleMore className="Header_top-icon_osk" />
          </Button>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="Header_main-Header_osk">
        <div className="Header_Header-content_osk">
          {/* 로고 섹션 */}
          <div className="Header_logo-section_osk">
            <div className="Header_logo-container_osk">
              <img src={logoImage} alt="모여링 로고" className="Header_logo-image_osk" />
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
            <span className="Header_nav-item_osk">클래스잉</span>
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