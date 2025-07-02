// src/components/MyFeed/MyFeed.jsx

import React, { useEffect, useState } from 'react';
import './MyFeed.css';
import badgeIcon from './icons/badge.jpg';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import Header from '../../common/Header';
import Sidebar from '../0myPage/common/Sidebar';
import { myAxios, url } from '../../../config';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { useNavigate } from 'react-router-dom';

export default function MyFeed() {
  const [token, setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);
  const [feedList, setFeedList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [currentImage, setCurrentImage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      myAxios(token, setToken).get("/socialing/feeds/myFeeds", {
        params: { userId: user.id }
      })
      .then(res => {
        setFeedList(res.data.feedList);
        setLikeList(res.data.likeList);

        const initIndices = {};
        res.data.feedList.forEach(feed => {
          initIndices[feed.feedId] = 0;
        });
        setCurrentImage(initIndices);
      })
      .catch(console.log);
    }
  }, [token]);

  const toggleLike = id => {
    setFeedList(prev =>
      prev.map(x =>
        x.id === id
          ? { ...x, liked: !x.liked, likeCount: x.liked ? x.likeCount - 1 : x.likeCount + 1 }
          : x
      )
    );
  };

  const prevImage = (feedId, count) => {
    setCurrentImage(prev => ({
      ...prev,
      [feedId]: (prev[feedId] - 1 + count) % count
    }));
  };

  const nextImage = (feedId, count) => {
    setCurrentImage(prev => ({
      ...prev,
      [feedId]: (prev[feedId] + 1) % count
    }));
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className="KYM-myfeed-container">
        <h2 className="KYM-myfeed-title">내가 쓴 글</h2>
        <div className="KYM-myfeed-grid">
          {feedList.map(feed => {
            const images = [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean);
            const currentIdx = currentImage[feed.feedId] || 0;

            return (
              <div key={feed.feedId} className="KYM-myfeed-card">
                <div className="KYM-myfeed-header">
                  <div className="KYM-myfeed-user-info">
                    <div className="KYM-myfeed-avatar" />
                    <span className="KYM-myfeed-nickname">{feed.writerId}</span>
                    <img src={feed.writerBadge || badgeIcon} alt="배지" className="KYM-myfeed-badge" />
                    <span className="KYM-myfeed-date">{feed.createdAt}</span>
                  </div>
                </div>

                <div className="KYM-myfeed-image-wrapper">
                  <img
                    src={`${url}/iupload/${images[currentIdx]}`}
                    alt="내 게시물"
                    className="KYM-myfeed-image"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        className="KYM-image-nav left"
                        onClick={() => prevImage(feed.feedId, images.length)}
                      >‹</button>
                      <button
                        className="KYM-image-nav right"
                        onClick={() => nextImage(feed.feedId, images.length)}
                      >›</button>
                      <div className="KYM-image-dots">
                        {images.map((_, i) => (
                          <span
                            key={i}
                            className={i === currentIdx ? 'KYM-dot active' : 'KYM-dot'}
                          >●</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="KYM-myfeed-content">
                  <p>{feed.content}</p>
                  <div className="KYM-myfeed-hashtags">
                    {[feed.tag1, feed.tag2, feed.tag3, feed.tag4, feed.tag5]
                      .filter(Boolean)
                      .map((tag, i) => (
                        <span key={i} className="KYM-myfeed-hashtag">#{tag}</span>
                      ))}
                  </div>
                </div>

                <div className="KYM-myfeed-footer">
                  <button
                    className={`KYM-myfeed-like-btn${feed.likedByUser ? ' active' : ''}`}
                    onClick={() => toggleLike(feed.id)}
                  >
                    <img
                      src={likeList.includes(feed.feedId) && likeList.userId === user.id ? heartFilled : heartOutline}
                      alt="좋아요"
                      className="KYM-myfeed-icon"
                    />
                    <span>{feed.likesCount}</span>
                  </button>
                  <button
                    className="KYM-comment-button"
                    onClick={() => navigate(`/feed/${feed.feedId}`)}
                  >
                    💬 {feed.commentsCount}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}
