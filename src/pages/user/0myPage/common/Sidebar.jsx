import React, { useEffect, useState, useCallback } from "react";
import './Sidebar.css';
// import badgeIcon from './icons/badge.jpg';
// import avatarImg from '../icons/avatar.jpg'; // 기본 아바타 이미지
import { useLocation, useNavigate } from "react-router-dom";
import { tokenAtom, userAtom } from "../../../../atoms";
import { myAxios ,url } from "../../../../config";
import { useSetAtom, useAtomValue, useAtom } from "jotai";


// user prop 예시:
// { username: 'USER', avatarUrl: '...', stats: { posts:0, followers:0, following:0 } }
export default function Sidebar() {
    const navigate = useNavigate();
    const token = useAtomValue(tokenAtom);
    const user = useAtomValue(userAtom);

    const setToken = useSetAtom(tokenAtom);
    const setUser = useSetAtom(userAtom);
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/userlogin");// 로그인 페이지로 이동
    }, [setUser, setToken, navigate]);
    return (
        <aside className="KYM-sidebar">
            {/* 회원정보 섹션 */}
            <section className="KYM-member-info">
                <h3>회원정보</h3>
                <div className="KYM-member-box">
                    <img
                        className="KYM-member-avatar"
                        src={`${url}/image?filename=${user?.profile}`}
                        alt="아바타"
                    />
                    <div className="KYM-member-text">
                        <div className="KYM-member-name-line">
                            <strong className="KYM-member-name">{user.username}</strong>
                            {/* <img className="KYM-member-badge" src={badgeIcon} alt="배지" /> */}
                        </div>
                        {/* <div className="KYM-member-stats">
                            <span>게시물 {user.stats.posts}</span>
                            <span>팔로워 {user.stats.followers}</span>
                            <span>팔로잉 {user.stats.following}</span>
                        </div> */}
                    </div>
                </div>
                <div className="KYM-member-actions">
                    <button className="KYM-btn KYM-primary" onClick={()=> navigate(`/user/mypage/mySchedule`)}>모여링 일정</button>
                    <button className="KYM-btn" onClick={logout}>로그아웃</button>
                </div>
            </section>

            {/* 마이메뉴 섹션 */}
            <section className="KYM-my-menu">
                <h3>마이메뉴</h3>
                <nav>
                    <ul>
                        <li><strong>클래스링</strong></li>
                        <li><a href="/user/mypage/MyClassRegistList">수강 클래스링</a></li>
                        <li><a href="/user/mypage/myReviewList">클래스 후기</a></li>
                        <li><a href="/user/mypage/myClassInquiry">클래스 문의내역</a></li>

                        <li><strong>게더링</strong></li>
                        <li><a href="/user/mypage/myGatheringingApplyList">지원한 게더링</a></li>
                        <li><a href="/user/mypage/myGatheringList">내가 개설한 게더링</a></li>
                        <li><a href="/user/mypage/myGatheringInquiryList">게더링 문의</a></li>

                        <li><strong>소셜링</strong></li>
                        <li><a href="/user/mypage/myFeed">작성한 피드</a></li>
                        <li><a href="/user/mypage/myScraps">스크랩 목록</a></li>
                        <li><a href="/user/mypage/follower">팔로우 목록</a></li>
                        <li><a href="/user/mypage/following">팔로잉 목록</a></li>

                        <li><strong></strong></li>
                        <li><a href="/user/mypage/myWishlist">찜목록</a></li>
                        <li><a href="/user/mypage/myCouponList">마이 쿠폰</a></li>
                        <li><a href="/user/mypage/myAlarmList">알림 내역</a></li>
                        <li><a href="/user/mypage/myProfile">내 정보 수정</a></li>
                    </ul>
                </nav>
            </section>
        </aside>
    );
}