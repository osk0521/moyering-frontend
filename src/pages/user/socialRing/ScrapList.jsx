import React, { useEffect, useState } from 'react';
import './ScrapList.css';
import badgeIcon from './icons/badge.jpg';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import commentIcon from './icons/comment.svg';

const dummyScraps = [
  {
    id: 1,
    author: '닉네임3🐴',
    date: '2025.05.29',
    imageUrl: 'https://placehorse.example/horse1.jpg',
    content: '뭘 보냥?',
    hashtags: ['#방탄'],
    likeCount: 0,
    commentCount: 0,
    liked: false
  },
  {
    id: 2,
    author: '닉네임3🐴',
    date: '2025.05.29',
    imageUrl: 'https://placehorse.example/horse2.jpg',
    content: 'ㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇ',
    hashtags: ['#방탄','#노을'],
    likeCount: 0,
    commentCount: 0,
    liked: false
  },
  {
    id: 3,
    author: '닉네임1🐴',
    date: '2025.05.29',
    imageUrl: 'https://placehorse.example/horse3.jpg',
    content: '엥?',
    hashtags: ['#방탄'],
    likeCount: 0,
    commentCount: 0,
    liked: false
  },
  {
    id: 4,
    author: '닉네임2🐴',
    date: '2025.05.29',
    imageUrl: 'https://placehorse.example/horse4.jpg',
    content: '힐링해요',
    hashtags: ['#방탄','#노을'],
    likeCount: 0,
    commentCount: 0,
    liked: false
  }
];

export default function ScrapList() {
  const [scraps, setScraps] = useState([]);

  useEffect(() => {
    // 실제 API 연동 전에는 더미 데이터로 세팅
    setScraps(dummyScraps);
  }, []);

  const toggleLike = id => {
    setScraps(scraps.map(s =>
      s.id === id
        ? { ...s, liked: !s.liked, likeCount: s.liked ? s.likeCount - 1 : s.likeCount + 1 }
        : s
    ));
  };

  return (
    <div className="KYM-scraplist-container">
      <h2 className="KYM-scraplist-header">📑 스크랩 목록</h2>
      <div className="KYM-scraplist-grid">
        {scraps.map(post => (
          <div key={post.id} className="KYM-scrap-card">
            <div className="KYM-scrap-header">
              <div className="KYM-scrap-user">
                <div className="KYM-scrap-avatar" />
                <span className="KYM-scrap-nickname">{post.author}</span>
                <img src={badgeIcon} alt="배지" className="KYM-scrap-badge"/>
                <span className="KYM-scrap-date">{post.date}</span>
              </div>
            </div>
            <img src={post.imageUrl} alt="" className="KYM-scrap-image" />
            <p className="KYM-scrap-content">{post.content}</p>
            <div className="KYM-scrap-hashtags">
              {post.hashtags.map(tag => (
                <span key={tag} className="KYM-scrap-tag">{tag}</span>
              ))}
            </div>
            <div className="KYM-scrap-footer">
              <button
                className={`KYM-like-btn${post.liked ? ' active' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                <img
                  src={post.liked ? heartFilled : heartOutline}
                  alt="좋아요"
                  className="KYM-icon"
                />
                <span>{post.likeCount}</span>
              </button>
              <button className="KYM-comment-btn">
                <img src={commentIcon} alt="댓글" className="KYM-icon"/>
                <span>{post.commentCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
