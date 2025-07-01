import "bootstrap/dist/css/bootstrap.min.css";
import { CiSearch } from "react-icons/ci";
import { FaHeart, FaRegBell, FaBell } from "react-icons/fa6";
import { LuMessageCircleMore } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from "reactstrap";
import "./Header.css";
import logoImage from "/logo.png";
import React, { useEffect, useState, useCallback } from "react";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { tokenAtom, userAtom, alarmsAtom } from "../../atoms";
import { myAxios, url } from "../../config";

export default function Header() {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);
  const [alarms, setAlarms] = useAtom(alarmsAtom);
  
  // Dropdown 상태 관리
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/userlogin");
  }, [setUser, setToken, navigate]);

  const toggleNotificationDropdown = useCallback(async () => {
    const newState = !notificationDropdownOpen;
    setNotificationDropdownOpen(newState);
  }, [notificationDropdownOpen]);

  // 모든 알림을 읽음으로 처리
 const handleMarkAllAsRead = useCallback(async (e) => {
    e.stopPropagation(); // 드롭다운이 닫히지 않도록
    if (!Array.isArray(alarms) || alarms.length === 0) {
      console.log('알림이 없어서 함수 종료');
      return;
    }
    try {
      const alarmList = alarms.map(notif => notif.alarmId);
      await myAxios(token).post('/confirmAll', { alarmList });
      setAlarms([]); // 모든 알림 제거
      setUnreadCount(0);
      console.log('모든 알림을 읽음으로 처리했습니다.');
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  }, [alarms, token, setAlarms]);

  // 알림 클릭 처리
 const handleNotificationClick = useCallback(async (notification, e) => {
    e.stopPropagation(); // 드롭다운이 닫히지 않도록
    
    try {
      const response = await myAxios(token).post(`/confirm/${notification.alarmId}`);
      
      if (response.data === true) {
        // 확인된 알림을 목록에서 제거
        setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.alarmId !== notification.alarmId));
        console.log(`알림 ${notification.alarmId}을 확인했습니다.`);
        console.log('알림 클릭:', notification);
      } else {
        console.error(`알림 ${notification.alarmId} 확인 실패`);
      }
    } catch (error) {
      console.error('개별 알림 확인 실패:', error);
    }
  }, [token, setAlarms]);

    useEffect(() => {
      console.log(user);
      if (user) {
        myAxios(token,setToken).post('/user/alarms')
          .then(response=> {
            console.log(response.data)
            setAlarms([...response.data])
          })
          .catch(err=> {
            console.log(err)
          })
      } 
  }, [user]);

  return (
    <div className="Header_header-container_osk">
      <div className="Header_top-menu-bar_osk">
        <div className="Header_top-menu-items_osk">
          {token && user ? (
            <>
              <span className="Header_top-menu-link_osk">
                <img
                  src={
                    user.profile
                      ? user.profile.startsWith("http") 
                        ? user.profile
                        : `${url}/image?filename=${user.profile}` 
                      : '/profile.png'
                  }
                  alt={`${user.nickName}`}
                  className="Header_profile-image_osk"
                />
                <span>{user.nickName} 님</span>
              </span>
              
              <Button className="Header_icon-button_osk Header_heart-button_osk">
                <FaHeart className="Header_top-icon_osk login" />
              </Button>

              <Dropdown 
                isOpen={notificationDropdownOpen} 
                toggle={toggleNotificationDropdown}
                className="Header_notification-dropdown-container_osk"
              >
                <DropdownToggle
                  tag="button"
                  className="Header_notification-button_osk"
                >
                  {alarms.length > 0 ? (
                    <FaBell className="Header_top-icon_osk Header_notification-active_osk" />
                  ) : (
                    <FaRegBell className="Header_top-icon_osk" />
                  )}

                  {alarms.length > 0 && (
                    <Badge 
                      color="danger" 
                      pill 
                      className="Header_notification-badge_osk"
                    >
                    </Badge>
                  )}
                </DropdownToggle>

                <DropdownMenu 
                  end 
                  className="Header_notification-dropdown-menu_osk"
                >
                  <div className="Header_notification-header_osk">
                    <h6 className="Header_notification-title_osk">알림</h6>
                    {Array.isArray(alarms) && alarms.length > 0 && (
                      <Button 
                        size="sm" 
                        color="link" 
                        className="Header_mark-all-read-btn_osk"
                        onClick={handleMarkAllAsRead}
                      >
                        모두 읽음
                      </Button>
                    )}
                  </div>

                  {!Array.isArray(alarms) || alarms.length === 0 ? (
                    <DropdownItem disabled className="Header_no-notifications_osk">
                      <div className="Header_empty-state_osk">
                        <FaRegBell className="Header_empty-icon_osk" />
                        새로운 알림이 없습니다.
                      </div>
                    </DropdownItem>
                  ) : (
                    <>
                      
                      {alarms.map((alarms, index) => (
                        <DropdownItem
                          key={alarms?.num || index}
                          className="Header_notification-item_osk"
                          
                        >
                          <div className="Header_notification-content_osk">
                            <div className="Header_notification-main_osk">
                              <div className="Header_notification-item-title_osk">
                                {alarms?.title || '제목 없음'}
                              </div>
                              <div className="Header_notification-body_osk">
                                {alarms?.content || '내용 없음'}
                              </div>
                              <div className="Header_notification-meta_osk">
                                <small className="Header_notification-sender_osk">
                                  보낸 사람: {alarms?.senderNickname || '알 수 없음'}
                                </small>
                              </div>
                            </div>
                            <Button className="Header_notification-confirm_osk" onClick={(e) => handleNotificationClick(alarms, e)}>확인</Button>
                          </div>
                        </DropdownItem>
                      ))}        
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
              <Button className="Header_icon-button_osk">
                <a href="/user/chat">
                  <LuMessageCircleMore className="Header_top-icon_osk" />
                </a>
              </Button>
              <span className="Header_top-menu-link_osk">
                <a href="/user/mypage/mySchedule">마이페이지</a>
              </span>
              <span className="Header_top-menu-link_osk">
                {user.userType==="ROLE_HT" ? <a href="/host/hostMyPage">호스트페이지</a> : ''}
              </span>
              <span className="Header_top-menu-link_osk">
                <button className="Header_top-menu-logout" onClick={logout}>로그아웃</button>
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
                <Button className="Header_search-button_osk">
                  <CiSearch size={20} />
                </Button>
              </div>
            </Form>
          </div>

          {/* 네비게이션 메뉴 */}
          <div className="Header_nav-section_osk">
            <span
              className="Header_nav-item_osk"
              onClick={() => 
              {user.userType==="ROLE_HT" ? navigate("/host/hostMyPage") : navigate("/host/intro")}}
            >
              클래스잉
            </span>
            <span className="Header_nav-item_osk" onClick={() => navigate(`/gatheringList`)}>게더링</span>
            <span className="Header_nav-item_osk" onClick={() => navigate(`/feeds`)}>소셜링</span>
            <span className="Header_nav-item_osk" onClick={() => navigate(`/`)}>공지사항</span>
            <span className="Header_nav-item_osk" onClick={() => navigate(`/`)}>고객센터</span>
          </div>
        </div>
      </div>
    </div>
  );
}