import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './FeedPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import plusIcon from './icons/plus.svg';
import moreIcon from './icons/more.png';
import badgeIcon from './icons/badge.jpg';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import ReportModal from './ReportModal';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Header from '../../common/Header';
import FeedCreate from '../socialRing/FeedCreate';
import { tokenAtom, userAtom } from '../../../atoms';
import { useAtom, useAtomValue } from 'jotai';
import { myAxios, url } from '../../../config';

const POSTS_PER_PAGE = 3;

export default function FeedPage() {
  const user = useAtomValue(userAtom);
  const userId = user?.id;


  const { feedId } = useParams();
  const [token,setToken] = useAtom(tokenAtom)
  console.log('🌟 FeedPage token:', token);
  const filters = ['전체', '좋아요순', '댓글순', '팔로워'];
  const [feeds, setFeeds] = useState([]);
  const [scrapped, setScrapped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [popularFeeds, setPopularFeeds] = useState([]);
  const [popularPage, setPopularPage] = useState(1);
  const [imageIndexes, setImageIndexes] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [reportTargetId, setReportTargetId] = useState(null);
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const slideRef = useRef(null);

  //create모달
  const [showCreateModal, setShowCreateModal] = useState(false);

  const totalPopularPages = Math.ceil(popularFeeds.length / POSTS_PER_PAGE);

  const getFeedImages = feed => [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean);
  const getFeedTags = feed => [feed.tag1, feed.tag2, feed.tag3, feed.tag4, feed.tag5].filter(Boolean);

  useEffect(() => {
    console.log("user:", user)
    const sortKey = {
      '전체': 'all',
      '좋아요순': 'likes',
      '댓글순': 'comments',
      '팔로워': 'follow'
    }[activeFilter];

console.log('userId:', userId);
    token && myAxios(token,setToken).get(`/socialing/feeds?sort=${sortKey}`
      // {
      // headers: {
      // Authorization :`Bearer ${token}`}}
      )
      .then(res => {
        const mapped = res.data.map(feed => ({
          ...feed,
          liked: !!feed.likedByUser // ← likedByUser → liked 매핑
        }));
        console.log("여기데이터 확인!!!", res.data)
        // setFeeds(mapped); // 매핑된 결과로 교체
        setFeeds(res.data)
      })
      .catch(err => console.error('피드 불러오기 실패:', err));

    // 인기 피드
    myAxios().get(`/socialing/feeds?sort=likes`)
      .then(res => setPopularFeeds(res.data))
      .catch(err => console.error('인기 피드 불러오기 실패:', err));
  }, [activeFilter, token]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPopularPage(p => (p % totalPopularPages) + 1);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [totalPopularPages]);

  const toggleLike = async feedId => {
    try {

      // 1) 백엔드에 좋아요/취소 요청
      await myAxios(token,setToken).post(
        `/user/socialing/likes/${feedId}`,
        {},
        {
          // params: { userId },
          // headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 2) 요청 성공 시, 로컬 UI 업데이트 (optimistic)
      setFeeds(prev =>
        prev.map(f =>
          f.feedId !== feedId ? f : {
            ...f,
            liked: !f.liked,
            likesCount: f.liked ? f.likesCount - 1 : f.likesCount + 1
          }
        )
      );
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
    }
  };

  const handleMenuToggle = id => setOpenMenuId(openMenuId === id ? null : id);
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

  const paginatedPopular = popularFeeds.slice(
    (popularPage - 1) * POSTS_PER_PAGE,
    popularPage * POSTS_PER_PAGE
  );

  // 1. 마운트 시 / feedId 변경 시 스크랩 여부 조회
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    myAxios(token).get(`/user/socialing/scrap/${feeds.feedId}`)
      .then(res => {
        if (mounted) setScrapped(res.data);
      })
      .catch(console.error);
    return () => { mounted = false; };
  }, [token, feedId]);

  // 2. 스크랩 토글 함수
  const handleScrapToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (scrapped) {
        await myAxios(token).delete(`/user/socialing/scrap/${feeds.feedId}`);
        setScrapped(false);
      } else {
        await myAxios(token).post(`/user/socialing/scrap`, null, { params: { feedId } });
        setScrapped(true);
      }
    } catch (err) {
      console.error('스크랩 에러', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="KYM-feed-page">
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <FeedCreate
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}
      <Header />
      <div className="KYM-feed-container">
        <div className="KYM-feed-title">
          <h2>커뮤니티 피드</h2>
        </div>

        <div className="KYM-feed-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`KYM-filter-button${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="KYM-feed-main">
          <div className="KYM-posts-grid">
            {feeds.map(feed => {
              const images = getFeedImages(feed);
              const currentIdx = imageIndexes[feed.feedId] || 0;
              return (
                <div key={feed.feedId} className="KYM-post-card">
                  <div className="KYM-post-header">
                    <div className="KYM-user-info">
                      <img src={feed.writerProfile} alt="프로필" className="KYM-avatar"
                       />
                      <span className="KYM-nickname" 
                      onClick={()=> navigate(`/userFeed/${feed.writerId}`)}>{feed.writerId}
                      </span>
                      <img src={badgeIcon} alt="배지" className="KYM-badge-icon" />
                    </div>
                    <div className="KYM-more-container">
                      <img src={moreIcon} alt="더보기" className="KYM-more-icon" onClick={() => handleMenuToggle(feed.feedId)} />
                      {openMenuId === feed.feedId && (
                        <ul className="KYM-post-menu open">
                          <li onClick={() => setReportTargetId(feed.feedId)}>신고하기</li>
                          <li onClick={() => navigate(`/feed/${feed.feedId}`)}>게시물로 이동</li>
                          <li
                            onClick={() => {
                              handleScrapToggle();
                              setShowMenu(false);
                            }}
                            style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                          >
                            {scrapped ? '스크랩 해제' : '스크랩하기'}
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="KYM-image-slider">
                    <img src={`${url}/iupload/${images[currentIdx]}`} alt={`피드 이미지 `} className="KYM-post-image" />
                    {images.length > 1 && (
                      <>
                        <button className="KYM-image-nav left" onClick={() => handlePrevImage(feed.feedId, images.length)}>&lt;</button>
                        <button className="KYM-image-nav right" onClick={() => handleNextImage(feed.feedId, images.length)}>&gt;</button>
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
                    <div className="KYM-hashtags">
                      {getFeedTags(feed).map((tag, i) => (

                        <span key={i} className="KYM-hashtag">#{tag}</span>
                      ))}
                    </div>
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

          <aside
            className="KYM-feed-sidebar"
            onMouseDown={e => setDragStartX(e.clientX)}
            onMouseUp={e => setDragStartX(null)}
          >
            <h3>인기 피드</h3>
            <SwitchTransition mode="out-in">
              <CSSTransition key={popularPage} nodeRef={slideRef} timeout={300} classNames="slide" unmountOnExit>
                <ul ref={slideRef} className="KYM-popular-list">
                  {paginatedPopular.map((item, idx) => (
                    <li key={item.feedId} className="KYM-popular-item">
                      <span className="KYM-rank">{(popularPage - 1) * POSTS_PER_PAGE + idx + 1}.</span>
                      <img src={getFeedImages(item)[0]} alt="썸네일" className="KYM-pop-thumb" />
                      <div className="KYM-info">
                        <span className="KYM-pop-nickname">{item.writerId}</span>
                        <span className="KYM-pop-count">❤️ {item.likesCount}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CSSTransition>
            </SwitchTransition>

            <div className="KYM-pagination-dots">
              {Array.from({ length: totalPopularPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`KYM-dot${popularPage === idx + 1 ? ' active' : ''}`}
                  onClick={() => setPopularPage(idx + 1)}
                />
              ))}
            </div>
          </aside>

          {/* <button className="KYM-create-post-button" onClick={() => navigate('/feed/create')}> */}

          {/* <button className="KYM-create-post-button" onClick={() => setShowCreateModal(true)}>
          <img src={plusIcon} alt="새 글 작성" />
        </button> */}
          {token && (
            <button
              className="KYM-create-post-button"
              onClick={() => setShowCreateModal(true)}
            >
              <img src={plusIcon} alt="새 글 작성" />
            </button>
          )}
        </div>

        <ReportModal
          show={reportTargetId !== null}
          onClose={() => setReportTargetId(null)}
          onSubmit={({ reason }) => {
            console.log(`피드 ${reportTargetId} 신고됨 - 사유: ${reason}`);
            setReportTargetId(null);
          }}
        />
        {showCreateModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <FeedCreate onCancel={() => setShowCreateModal(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
