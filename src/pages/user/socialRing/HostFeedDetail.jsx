import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { myAxios, url } from '../../../config';
import Header from '../../common/Header';
import FollowButton from './FollowButton';
import './FeedDetail.css'; // 기존 CSS 사용

export default function HostFeedDetail() {
  const { feedId } = useParams();
  const [feed, setFeed] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    myAxios().get(`/feedHost/${feedId}`)
      .then(res => {
        console.log("▶ HostFeedDetail:", res.data);
        setFeed(res.data);
      })
      .catch(err => {
        console.error("피드 상세 조회 실패:", err);
        alert("피드를 불러오지 못했습니다.");
      });
  }, [feedId]);

  if (!feed) return <div className="KYM-detail-container">로딩 중...</div>;

  const {
    content,
    img1, img2, img3, img4, img5,
    tag1, tag2, tag3, tag4, tag5,
    category,
    hostId, hostName, hostProfile
  } = feed;

  const images = [img1, img2, img3, img4, img5].filter(Boolean);
  const tags = [tag1, tag2, tag3, tag4, tag5].filter(Boolean);

  return (
    <>
      <Header />
      <div className="KYM-detail-container">
        <div className="KYM-detail-main">
          <div className="KYM-detail-image">
            {images.length > 0 && (
              <>
                <img
                  src={`${url}/iupload/${images[currentImage]}`}
                  alt={`feed-${currentImage}`}
                />
                {images.length > 1 && (
                  <>
                    <button
                      className="KYM-image-nav left"
                      onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
                    >‹</button>
                    <button
                      className="KYM-image-nav right"
                      onClick={() => setCurrentImage((currentImage + 1) % images.length)}
                    >›</button>
                    <div className="KYM-image-dots">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={i === currentImage ? 'dot active' : 'dot'}
                          onClick={() => setCurrentImage(i)}
                        >●</span>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="KYM-detail-side">
            <div className="KYM-detail-header">
              <div className="KYM-left-info">
                <img className="KYM-detail-avatar" src={hostProfile} alt="" />
                <span className="KYM-detail-nickname">{hostName}</span>
              </div>
              
            </div>

            <div className="KYM-detail-content">{content}</div>
            <div className="KYM-hashtags">
              {tags.map((t, i) => <span key={i} className="KYM-hashtag">#{t}</span>)}
            </div>
            <div className="KYM-detail-comments">
              <p>카테고리: {category}</p>
            </div>

            <div className="KYM-actions">
              <button className="KYM-action-icon">🤍</button>
              <button className="KYM-action-icon">💬</button>
              <button className="KYM-action-icon2">📤</button>
              <div className="KYM-action-spacer" />
            </div>
            <div className="KYM-like-info">
              <span className="KYM-like-count">좋아요 0개</span>
              <span className="KYM-detail-date">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
