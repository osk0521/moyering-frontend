// src/components/MyFeed/MyFeed.jsx

import React, { useEffect, useState } from 'react';
import './MyFeed.css';
import badgeIcon from './icons/badge.jpg';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import Header from '../../common/Header';

const dummyMyPosts = [
  {
    id: 1,
    authorName: '내닉네임',
    date: '2025.06.29',
    imageUrl: 'https://picsum.photos/300/300',
    content: '안녕하세요 글입니다..',
    hashtags: ['#냥만'],
    likeCount: 0,
    commentCount: 0,
    liked: false,
  },
  {
    id: 2,
    authorName: '내닉네임',
    date: '2025.06.29',
    imageUrl: 'https://picsum.photos/300/300',
    content: '두번째 글입니다아아아아아',
    hashtags: ['#냥만', '#노을'],
    likeCount: 0,
    commentCount: 0,
    liked: false,
  },
  {
    id: 3,
    authorName: '내닉네임',
    date: '2025.06.29',
    imageUrl: 'https://picsum.photos/300/300',
    content: '강아지 귀엽죠?',
    hashtags: ['#냥만'],
    likeCount: 0,
    commentCount: 0,
    liked: false,
  },
  {
    id: 4,
    authorName: '내닉네임',
    date: '2025.06.29',
    imageUrl: 'https://picsum.photos/300/300',
    content: '두마리니까 두배로 귀여움',
    hashtags: ['#냥만'],
    likeCount: 0,
    commentCount: 0,
    liked: false,
  },
];

export default function MyFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(dummyMyPosts);
  }, []);

  const toggleLike = id => {
    setPosts(p =>
      p.map(x =>
        x.id === id
          ? { ...x, liked: !x.liked, likeCount: x.liked ? x.likeCount - 1 : x.likeCount + 1 }
          : x
      )
    );
  };

  return (
    <>
    <Header/>
    <div className="myfeed-container">
      <h2 className="myfeed-title">내가 쓴 글</h2>
      <div className="myfeed-grid">
        {posts.map(post => (
          <div key={post.id} className="myfeed-card">
            <div className="myfeed-header">
              <div className="myfeed-user-info">
                <div className="myfeed-avatar" />
                <span className="myfeed-nickname">{post.authorName}</span>
                <img src={badgeIcon} alt="배지" className="myfeed-badge" />
                <span className="myfeed-date">{post.date}</span>
              </div>
            </div>
            <img src={post.imageUrl} alt="내 게시물" className="myfeed-image" />
            <div className="myfeed-content">
              <p>{post.content}</p>
              <div className="myfeed-hashtags">
                {post.hashtags.map(t => (
                  <span key={t} className="myfeed-hashtag">{t}</span>
                ))}
              </div>
            </div>
            <div className="myfeed-footer">
              <button
                className={`myfeed-like-btn${post.liked ? ' active' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                <img
                  src={post.liked ? heartFilled : heartOutline}
                  alt="좋아요"
                  className="myfeed-icon"
                />
                <span>{post.likeCount}</span>
              </button>
              <span className="myfeed-comment-count">💬 {post.commentCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
}
