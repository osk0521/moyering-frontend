import { useState, useEffect, useRef } from 'react';
import './MyScrapList.css';
import { useNavigate } from 'react-router-dom';
import badgeIcon from './icons/badge.jpg';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import moreIcon from './icons/more.png';
import Header from '../../common/Header';
import Sidebar from '../0myPage/common/Sidebar';
import ReportModal from './ReportModal';
import { tokenAtom, userAtom } from '../../../atoms';
import { useAtom, useAtomValue } from 'jotai';
import { myAxios, url } from '../../../config';

export default function MyScrapPage() {
  const user = useAtomValue(userAtom);
  const userId = user?.id;
  const [token, setToken] = useAtom(tokenAtom);

  const [scraps, setScraps] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrapped, setScrapped] = useState({});
  const [reportTargetId, setReportTargetId] = useState(null);
  const navigate = useNavigate();

  const getFeedImages = feed => [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean);

  useEffect(() => {
    if (!token) return;
    myAxios(token, setToken).get(`/user/socialing/scrap/myScraps`)
      .then(res => {
        setScraps(res.data);
        const scrapMap = {};
        res.data.forEach(item => scrapMap[item.feedId] = true);
        setScrapped(scrapMap);
      })
      .catch(err => console.error('스크랩 목록 불러오기 실패:', err));
  }, [token]);

  const handleNextImage = (feedId, length) => {
    setImageIndexes(prev => ({
      ...prev,
      [feedId]: ((prev[feedId] || 0) + 1) % length
    }));
  };
  const handlePrevImage = (feedId, length) => {
    setImageIndexes(prev => ({
      ...prev,
      [feedId]: ((prev[feedId] || 0) - 1 + length) % length
    }));
  };

  const toggleLike = async feedId => {
    try {
      await myAxios(token, setToken).post(`/user/socialing/likes/${feedId}`);
      setScraps(prev => prev.map(f =>
        f.feedId !== feedId ? f : {
          ...f,
          liked: !f.liked,
          likesCount: f.liked ? f.likesCount - 1 : f.likesCount + 1
        }
      ));
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
    }
  };

  const handleScrapToggle = async feedId => {
    if (loading) return;
    setLoading(true);
    try {
      if (scrapped[feedId]) {
        await myAxios(token, setToken).delete(`/user/socialing/scrap/${feedId}`);
        setScrapped(prev => ({ ...prev, [feedId]: false }));
        setScraps(prev => prev.filter(f => f.feedId !== feedId));
      }
    } catch (err) {
      console.error('스크랩 해제 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="KYM-feed-page">
      <Header />
      <div className='KYM-myfeed-wrapper'>
        <div className="KYM-feed-main"> {/* <- 새로 묶는 flex 부모 */}
          <div className='KYM-scrap-sidebar'>
            <Sidebar /> {/* 왼쪽 */}
          </div>
          <div className="KYM-feed-container"> {/* 오른쪽 */}
            <div className="KYM-feed-title">
              <h2>내가 스크랩한 글</h2>
            </div>

            <div className="KYM-feed-main">
              {scraps.length === 0 && (
                <div className='KYM-no-scraps'>스크랩목록이 없습니다.</div>
              )}
              <div className="KYM-posts-grid">
                {scraps.map(feed => {
                  const images = getFeedImages(feed);
                  const currentIdx = imageIndexes[feed.feedId] || 0;
                  return (
                    <div key={feed.feedId} className="KYM-post-card">
                      <div className="KYM-post-header">
                        <div className="KYM-user-info">
                          {/* <img src={`${url}/iupload/${feed.writerProfile}`} alt="프로필" className="KYM-avatar" /> */}
                          <img src={feed.writerProfile ? `{${url}/iupload/${feed.writerProfile}}` : '/profile.png'} alt="프로필" className="KYM-avatar" />
                          <span className="KYM-nickname">{feed.writerNickName}</span>
                          <img src={`/badge_${feed.writerBadgeImg}.png`} alt="배지" className="KYM-badge-icon" />
                        </div>
                        <div className="KYM-more-container">
                          <img
                            src={moreIcon}
                            alt="더보기"
                            className="KYM-more-icon"
                            onClick={() => setOpenMenuId(openMenuId === feed.feedId ? null : feed.feedId)}
                          />
                          {openMenuId === feed.feedId && (
                            <ul className="KYM-post-menu open">
                              <li onClick={() => setReportTargetId(feed.feedId)}>신고하기</li>
                              <li onClick={() => navigate(`/feed/${feed.feedId}`)}>게시물로 이동</li>
                              <li
                                onClick={() => handleScrapToggle(feed.feedId)}
                                style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                              >
                                스크랩 해제
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="KYM-image-slider">
                        <img src={`${url}/iupload/${images[currentIdx]}`} alt="스크랩 이미지" className="KYM-post-image" />
                        {images.length > 1 && (
                          <>
                            <button className="KYM-image-nav left" onClick={() => handlePrevImage(feed.feedId, images.length)}>◀</button>
                            <button className="KYM-image-nav right" onClick={() => handleNextImage(feed.feedId, images.length)}>▶</button>
                            <div className="KYM-image-dots">
                              {images.map((_, i) => (
                                <span key={i} className={i === currentIdx ? 'dot active' : 'dot'}>●</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="KYM-post-content">
                        <p>{feed.content}</p>
                      </div>

                      <div className="KYM-post-footer">
                        <div className="KYM-stats">
                          <button className={`KYM-like-button${feed.liked ? ' active' : ''}`} onClick={() => toggleLike(feed.feedId)}>
                            <img src={feed.liked ? heartFilled : heartOutline} alt="좋아요" />
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
                    </div>
                  );
                })}
              </div>
            </div>

            <ReportModal
              show={reportTargetId !== null}
              onClose={() => setReportTargetId(null)}
              onSubmit={({ reason }) => {
                console.log(`피드 ${reportTargetId} 신고됨 - 사유: ${reason}`);
                setReportTargetId(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
