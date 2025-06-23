// src/components/ProfilePage/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import axios from 'axios';                     // ← 꼭 import
import { tokenAtom } from '../../../atoms';
import { myAxios, url } from '../../../config';

import './UserFeed.css';
import Header from '../../common/Header';
import moreIcon from './icons/more.png';
import heartOutline from './icons/heart-outline.png';
import heartFilled  from './icons/heart-filled.png';
import commentIcon  from './icons/comment.svg';

export default function UserFeed() {
  const { nickname } = useParams();            // /socialing/feeds/:nickname
  const token = useAtomValue(tokenAtom);

  // 프로필과 게시물 상태
  const [user, setUser]   = useState(null);
  const [posts, setPosts] = useState([]);

  // 1) 유저 프로필 API
  useEffect(() => {
    if (!nickname) return;                     // nickname 없으면 스킵
    const fetchUser = async () => {
      try {
        const { data: u } = await myAxios(token)
          .get(`${url}/socialing/users/${nickname}`);
        setUser({
          profile:   u.profile,                 // 빈 문자열 대신 null 체크
          nickname:  u.nickName || u.username,
          badgeUrl:  `/badges/${u.userBadgeId}.png`,
          intro:     u.intro || '',
          stats: {
            posts:     u.postsCount     || 0,
            followers: u.followersCount || 0,
            following: u.followingCount || 0
          }
        });
      } catch (err) {
        console.error('유저 정보 조회 실패', err);
      }
    };
    fetchUser();
  }, [nickname, token]);

  // 2) 피드 리스트 API
  useEffect(() => {
    if (!nickname) return;
    const fetchFeeds = async () => {
      try {
        const { data } = await axios
          .get(`${url}/socialing/feeds/${nickname}`);
        setPosts(data.map(feed => ({
          id:           feed.feedId,
          imageUrl:     feed.img1,       // null이면 뒤에서 체크 가능
          content:      feed.content,
          liked:        false,
          likeCount:    feed.likesCount,
          commentCount: feed.commentsCount
        })));
      } catch (err) {
        console.error('피드 리스트 조회 실패', err);
      }
    };
    fetchFeeds();
  }, [nickname]);

  // 3) 로컬 좋아요 토글
  const toggleLike = id => {
    setPosts(posts.map(p =>
      p.id !== id
        ? p
        : {
            ...p,
            liked:     !p.liked,
            likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1
          }
    ));
  };

//   // 4) 렌더링 전 null 체크
//   if (user === null) {
//     return <div className="KYM-loading">로딩 중...</div>;
//   }

  return (
    <>
      <Header />
      <div className="KYM-profile-container">
        <div className="KYM-profile-header">
          {user.profile && (
            <img className="KYM-avatar" src={user.profile} alt="프로필" />
          )}
          <div className="KYM-profile-info">
            <div className="KYM-name-line">
              <h2 className="KYM-nickname">{user.nickname}</h2>
              <img className="KYM-badge" src={user.badgeUrl} alt="배지" />
              <img src={moreIcon} alt="더보기" className="KYM-more-icon" />
            </div>
            <p className="KYM-intro">
              {user.intro.split('\n').map((line, i) => (
                <span key={i}>{line}<br/></span>
              ))}
            </p>
            <div className="KYM-action-buttons">
              <button className="KYM-btn KYM-follow">팔로우</button>
              <button className="KYM-btn KYM-message">메시지 보내기</button>
            </div>
            <ul className="KYM-stat-list">
              <li><strong>{user.stats.posts}</strong><span>게시물</span></li>
              <li><strong>{user.stats.followers}</strong><span>팔로워</span></li>
              <li><strong>{user.stats.following}</strong><span>팔로잉</span></li>
            </ul>
          </div>
        </div>

        <hr className="KYM-divider" />

        <div className="KYM-posts-grid">
          {posts.map(post => (
            <div key={post.id} className="KYM-post-card">
              {post.imageUrl && (
                <img className="KYM-post-img" src={post.imageUrl} alt="게시물" />
              )}
              <p className="KYM-post-content">{post.content}</p>
              <div className="KYM-post-footer">
                <div className="KYM-stats">
                  <button
                    className={`KYM-like-button${post.liked ? ' KYM-active' : ''}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <img
                      src={post.liked ? heartFilled : heartOutline}
                      alt="좋아요"
                      className="KYM-icon"
                    />
                    <span>{post.likeCount}</span>
                  </button>
                  <span className="KYM-comment-count">
                    <img src={commentIcon} alt="댓글" className="KYM-icon" /> 
                    {post.commentCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
