// src/components/UserFeed/UserFeed.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom } from '../../../atoms';
import { myAxios, url } from '../../../config';
import axios from 'axios';

import './UserFeed.css';
import Header from '../../common/Header';
import moreIcon from './icons/more.png';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import commentIcon from './icons/comment.svg';

export default function UserFeed() {
  const params = useParams();
  console.log('🐞 useParams →', params);
  const { nickname } = useParams();     
  const navigate = useNavigate();
  const [token,setToken] = useAtom(tokenAtom);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // 기본 프로필 이미지 경로
  const defaultProfile = '/images/default-profile.png';

  // 1) 프로필 정보 조회
  useEffect(() => {
    if (!nickname) return;
    (async () => {
      try {
        console.log('▶ fetchUser 호출, nickname=', nickname,' token=', token);
        // 토큰 없으면 인증 헤더 없이 호출
        const api = token
          ? myAxios(token,setToken)
          : axios.create({ baseURL: url });

        const { data: u } = await api
          .get(`/socialing/feedUser/${nickname}`);
        // const { data: u } = await myAxios(token)
        //   .get(`${url}/socialing/userFeed/${nickname}`);
        console.log('◀ fetchUser 응답 u=', u);

        setUser({
          profile: u.profile,
          nickname: u.nickName || u.username,
          badgeUrl: `/badges/${u.userBadgeId}.png`,
          intro: u.intro || '',
          stats: {
            posts: u.postsCount ?? 0,
            followers: u.followersCount ?? 0,
            following: u.followingCount ?? 0,
          },
        });
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/not-found', { replace: true });
        } else {
          console.error('유저 정보 조회 실패:', err);
        }
      }
    })();
  }, [nickname, token, navigate]);

  // 2) 피드 리스트 조회
  useEffect(() => {
    if (!nickname) return;
    (async () => {
      try {
        const { data: feeds } = await myAxios(token,setToken)
          .get(`${url}/socialing/memberFeed/${nickname}`);

        setPosts(
          feeds.map(feed => ({
            id: feed.feedId,
            imageUrl: feed.img1,
            content: feed.content,
            liked: feed.likedByUser,
            likeCount: feed.likesCount,
            commentCount: feed.commentsCount,
            mine: feed.mine,
            createdAt: feed.createdAt,
          }))
        );
      } catch (err) {
        console.error('피드 리스트 조회 실패:', err);
      }
    })();
  }, [nickname, token]);

  // 3) 좋아요 토글 (로컬 UI 반영)
  const toggleLike = id => {
    setPosts(posts.map(p =>
      p.id !== id
        ? p
        : {
          ...p,
          liked: !p.liked,
          likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1,
        }
    ));
    // TODO: 서버 좋아요/취소 API 호출 추가
  };

  // // 프로필도 없고 포스트도 없으면 로딩
  // if (!user && posts.length === 0) {
  //   return <div className="KYM-loading">로딩 중…</div>;
  // }

  return (
    <>
      <Header />

      <div className="KYM-profile-container">
        <div className="KYM-profile-header">
          <img
            className="KYM-avatar"
            src={user?.profile || defaultProfile}
            alt="프로필"
          />
          <div className="KYM-profile-info">
            <div className="KYM-name-line">
              <h2 className="KYM-nickname">{user?.nickname}</h2>
              <img className="KYM-badge" src={user?.badgeUrl} alt="배지" />
              <img src={moreIcon} alt="더보기" className="KYM-more-icon" />
            </div>
            <p className="KYM-intro">
              {user?.intro.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="KYM-action-buttons">
              <button className="KYM-btn KYM-follow">팔로우</button>
              <button className="KYM-btn KYM-message">메시지</button>
            </div>
            <ul className="KYM-stat-list">
              <li><strong>{user?.stats.posts}</strong><span>게시물</span></li>
              <li><strong>{user?.stats.followers}</strong><span>팔로워</span></li>
              <li><strong>{user?.stats.following}</strong><span>팔로잉</span></li>
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
