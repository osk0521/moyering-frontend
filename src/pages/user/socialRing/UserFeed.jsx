import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenAtom } from '../../../atoms';
import { myAxios, url } from '../../../config';
import axios from 'axios';

import './UserFeed.css';
import Header from '../../common/Header';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import commentIcon from './icons/comment.svg';
import FollowButton from './FollowButton';

export default function UserFeed() {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useAtom(tokenAtom);
  const queryClient = useQueryClient();
  const [currentImage, setCurrentImage] = useState({});

  // 👉 유저 프로필
  const { data: user } = useQuery({
    queryKey: ['userFeedProfile', nickname],
    queryFn: async () => {
      const api = token ? myAxios(token, setToken) : axios.create({ baseURL: url });
      const res = await api.get(`/socialing/feedUser/${nickname}`);
      return {
        userId: res.data.userId,
        profile: res.data.profile,
        nickname: res.data.nickName || res.data.username,
        intro: res.data.intro || '',
        badgeImg: res.data.badgeImg
      };
    },
    enabled: !!nickname
  });

  // 👉 유저 피드
  const { data: feeds = [] } = useQuery({
    queryKey: ['memberFeeds', nickname],
    queryFn: async () => {
      const res = await myAxios(token, setToken).get(`/socialing/memberFeed/${nickname}`);
      return res.data.map(feed => ({
        ...feed,
        images: [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean),
      }));
    },
    enabled: !!nickname
  });

  // 👉 좋아요 feedId
  const { data: likedIds = [] } = useQuery({
    queryKey: ['likes'],
    queryFn: async () => {
      if (!token) return [];
      const res = await myAxios(token, setToken).get(`/user/socialing/likes`);
      return res.data.filter(item => item.likedByUser).map(item => item.feedId);
    },
    enabled: !!token
  });

  const likedFeedIdSet = useMemo(() => new Set(likedIds), [likedIds]);
  const feedsWithLiked = useMemo(() => {
    return feeds.map(feed => ({
      ...feed,
      likedByUser: likedFeedIdSet.has(Number(feed.feedId))
    }));
  }, [feeds, likedFeedIdSet]);

  // 👉 좋아요 mutation
  const likeMutation = useMutation({
    mutationFn: (feedId) => myAxios(token, setToken).post(`/user/socialing/likes/${feedId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['likes']);
      queryClient.invalidateQueries(['memberFeeds', nickname]);
    }
  });

  const toggleLike = (feed) => {
    if (!token) return alert("로그인이 필요합니다.");
    likeMutation.mutate(feed.feedId);
  };

  // 👉 게시물/팔로워/팔로잉
  const [feedCount, setFeedCount] = useState('');
  const [followCount, setFollowCount] = useState('');
  const [followingCount, setFollowingCount] = useState('');

  useEffect(() => {
    if (user) {
      token && myAxios(token, setToken)
        .get(`/socialing/subCount`, { params: { userId: user.userId } })
        .then(res => {
          setFeedCount(res.data.feedCount);
          setFollowCount(res.data.followCount);
          setFollowingCount(res.data.followingCount);
        })
        .catch(console.error);
    }
  }, [token, user]);

  const prevImage = (feedId, count) => {
    setCurrentImage(prev => ({ ...prev, [feedId]: (prev[feedId] - 1 + count) % count }));
  };
  const nextImage = (feedId, count) => {
    setCurrentImage(prev => ({ ...prev, [feedId]: (prev[feedId] + 1) % count }));
  };

  if (!user) return <div className="KYM-userfeed-loading">로딩 중…</div>;
console.log("==========================",user)
  return (
    <>
      <Header />
      <div className="KYM-userfeed-container">
        <div className="KYM-userfeed-header">
          <img
            className="KYM-userfeed-avatar"
            src={user.profile ? `${url}/iupload/${user.profile}` : '/profile.png'}
            alt="프로필"
          />
          <div className="KYM-userfeed-info">
            <div className="KYM-userfeed-name-line">
              <h2 className="KYM-userfeed-nickname">{user.nickname}</h2>
                <img className="KYM-userfeed-badge" src={`/badge_${user.badgeImg}.png`} alt="배지" />
            </div>
            <p className="KYM-userfeed-intro">
              {user.intro.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="KYM-userfeed-action-buttons">
              <FollowButton targetUserId={user.userId} className="KYM-userfeed-follow-btn" />
              <button className="KYM-userfeed-btn" onClick={() => navigate(`/user/chat?receiverId=${user.userId}`)}>
                DM
              </button>
            </div>
            <ul className="KYM-userfeed-stat-list">
              <li><strong>{feedCount}</strong><span>게시물</span></li>
              <li><strong>{followCount}</strong><span>팔로워</span></li>
              <li><strong>{followingCount}</strong><span>팔로잉</span></li>
            </ul>
          </div>
        </div>

        <hr className="KYM-userfeed-divider" />

        <div className="KYM-userfeed-posts-grid">
          {feedsWithLiked.map(post => {
            const images = post.images;
            const currentIdx = currentImage[post.feedId] || 0;
            return (
              <div key={post.feedId} className="KYM-userfeed-post-card">
                <div className="KYM-userfeed-image-slider" onClick={() => navigate(`/feed/${post.feedId}`)}>
                  <img className="KYM-userfeed-post-img" src={`${url}/iupload/${images[currentIdx]}`} alt="게시물" />
                  {images.length > 1 && (
                    <>
                      <button className="KYM-userfeed-image-nav left" onClick={(e) => { e.stopPropagation(); prevImage(post.feedId, images.length); }}>‹</button>
                      <button className="KYM-userfeed-image-nav right" onClick={(e) => { e.stopPropagation(); nextImage(post.feedId, images.length); }}>›</button>
                      <div className="KYM-userfeed-image-dots">
                        {images.map((_, i) => (
                          <span key={i} className={i === currentIdx ? 'KYM-userfeed-dot active' : 'KYM-userfeed-dot'} onClick={(e) => e.stopPropagation()}>●</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <p className="KYM-userfeed-post-content">{post.content}</p>
                <div className="KYM-userfeed-post-footer">
                  <div className="KYM-userfeed-stats">
                    <button className={`KYM-userfeed-like-button${post.likedByUser ? ' KYM-active' : ''}`} onClick={() => toggleLike(post)}>
                      <img src={post.likedByUser ? heartFilled : heartOutline} alt="좋아요" className="KYM-userfeed-icon" />
                      <span>{post.likesCount}</span>
                    </button>
                    <span className="KYM-userfeed-comment-count">
                      <img src={commentIcon} alt="댓글" className="KYM-userfeed-icon" />{post.commentsCount}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}
