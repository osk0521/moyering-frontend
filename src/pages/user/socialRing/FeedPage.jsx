// src/components/FeedPage/FeedPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './FeedPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import plusIcon from './icons/plus.svg';
import moreIcon from './icons/more.png';
import badgeIcon from './icons/badge.jpg';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import ReportModal from './ReportModal';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';

const POSTS_PER_PAGE = 3;
const dummyPosts = [
  {
    id: 1,
    authorName: '테스터1',
    date: '2025.06.10',
    imageUrl: 'data:image/jpeg;base64,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',
    content: '첫 번째 더미 게시물입니다.',
    hashtags: ['#더미', '#테스트'],
    likeCount: 0,
    commentCount: 2,
    liked: false
  },
  {
    id: 2,
    authorName: '테스터2',
    date: '2025.06.09',
    imageUrl: 'data:image/jpeg;base64,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',
    content: '두 번째 더미 게시물입니다.',
    hashtags: ['#React', '#DummyData'],
    likeCount: 1,
    commentCount: 0,
    liked: true
  },
  {
    id: 3,
    authorName: '테스터3',
    date: '2025.06.08',
    imageUrl: 'data:image/jpeg;base64,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',
    content: '세 번째 더미 게시물입니다.',
    hashtags: ['#Feed', '#Page'],
    likeCount: 5,
    commentCount: 3,
    liked: false
  }
];

// 더미 인기 피드 (총 10개)
const popularPosts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nickname: `닉네임${i + 1}`,
  image: 'data:image/jpeg;base64,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',
  count: 200 - i * 10
}));

const FeedPage = () => {
  const filters = ['전체', '좋아요순', '댓글순', '팔로워'];
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [popularPage, setPopularPage] = useState(1);
  const [dragStartX, setDragStartX] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [reportTargetId, setReportTargetId] = useState(null);
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const slideRef = useRef(null);

  const totalPopularPages = Math.ceil(popularPosts.length / POSTS_PER_PAGE);

  useEffect(() => {
    setPosts(dummyPosts);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPopularPage(p => (p % totalPopularPages) + 1);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [totalPopularPages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // 더보기 버튼(.KYM-more-container)이나 열린 메뉴 안이 아니면 닫기
      if (!e.target.closest('.KYM-more-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const toggleLike = id => {
    setPosts(posts.map(p =>
      p.id !== id
        ? p
        : { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
    ));
  };


  const onFilterClick = filter => setActiveFilter(filter);
  const onCreateClick = () => navigate('/feed/create');
  const handleDragStart = x => {
    setDragStartX(x);
    clearInterval(intervalRef.current);
  };
  const handleDragEnd = x => {
    if (dragStartX !== null) {
      const delta = x - dragStartX;
      if (delta > 50) setPopularPage(p => Math.max(1, p - 1));
      else if (delta < -50) setPopularPage(p => Math.min(totalPopularPages, p + 1));
    }
    setDragStartX(null);
    intervalRef.current = setInterval(() => {
      setPopularPage(p => (p % totalPopularPages) + 1);
    }, 5000);
  };

  const paginatedPopular = popularPosts.slice(
    (popularPage - 1) * POSTS_PER_PAGE,
    popularPage * POSTS_PER_PAGE
  );

  // 메뉴 동작 함수
  const reportPost = id => alert(`게시물 ${id} 신고`);
  const viewPost = id => navigate(`/feed/${id}`);
  const scrapPost = id => alert(`게시물 ${id} 스크랩`);
  const sharePost = id => {
    if (navigator.share) navigator.share({ url: window.location.origin + `/feed/${id}` });
    else alert('공유 API를 지원하지 않습니다.');
  };
  const copyLink = id => {
    const url = window.location.origin + `/feed/${id}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('링크가 복사되었습니다.'))
      .catch(() => alert('복사에 실패했습니다.'));
  };
  const openDM = author => navigate(`/dm/${encodeURIComponent(author)}`);

  const handleMenuToggle = id => setOpenMenuId(openMenuId === id ? null : id);

  return (
    <div className="KYM-feed-container">
      <div className="KYM-feed-title">
        <h2>커뮤니티 피드</h2>
      </div>

      <div className="KYM-feed-filters">
        {filters.map(f => (
          <button
            key={f}
            className={`KYM-filter-button${activeFilter === f ? ' active' : ''}`}
            onClick={() => onFilterClick(f)}
          >{f}</button>
        ))}
      </div>

      <div className="KYM-feed-main">
        <div className="KYM-posts-grid">
          {posts.map(post => (
            <div key={post.id} className="KYM-post-card">
              <div className="KYM-post-header">
                <div className="KYM-user-info">
                  <div className="KYM-avatar-placeholder" />
                  <span className="KYM-nickname">{post.authorName}</span>
                  <img src={badgeIcon} alt="배지" className="KYM-badge-icon" />
                  <span className="KYM-date">{post.date}</span>
                </div>
                <div className="KYM-more-container">
                  <img src={moreIcon} alt="더보기" className="KYM-more-icon"
                    onClick={() => handleMenuToggle(post.id)} />
                  {openMenuId === post.id && (
                    <ul className="KYM-post-menu open">
                      <li onClick={() => { setOpenMenuId(null); setReportTargetId(post.id); }}>신고하기</li>
                      <li onClick={() => viewPost(post.id)}>게시물로 이동</li>
                      <li onClick={() => scrapPost(post.id)}>스크랩하기</li>
                      <li onClick={() => sharePost(post.id)}>공유하기</li>
                      <li onClick={() => copyLink(post.id)}>링크복사</li>
                      <li onClick={() => openDM(post.authorName)}>DM</li>
                    </ul>
                  )}
                </div>
              </div>

              <img className="KYM-post-image" src={post.imageUrl} alt="게시물" />

              <div className="KYM-post-content">
                <p>{post.content}</p>
                <div className="KYM-hashtags">
                  {post.hashtags.map(tag => (
                    <span key={tag} className="KYM-hashtag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="KYM-post-footer">
                <div className="KYM-stats">
                  <button
                    className={`KYM-like-button${post.liked ? ' active' : ''}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <img
                      src={post.liked ? heartFilled : heartOutline}
                      alt="좋아요"
                      className="KYM-icon"
                    />
                    <span>{post.likeCount}</span>
                  </button>
                  <span className="KYM-comment-count">💬 {post.commentCount}</span>
                </div>
                <button className="KYM-detail-button">더보기</button>
              </div>
            </div>
          ))}
        </div>

        <aside
          className="KYM-feed-sidebar"
          onMouseDown={e => handleDragStart(e.clientX)}
          onMouseUp={e => handleDragEnd(e.clientX)}
          onTouchStart={e => handleDragStart(e.touches[0].clientX)}
          onTouchEnd={e => handleDragEnd(e.changedTouches[0].clientX)}
        >
          <h3>인기 피드</h3>
          
            {/* ① SwitchTransition + out-in 모드 */}
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={popularPage}         // 페이지가 바뀔 때마다 exit → enter
          nodeRef={slideRef}        // findDOMNode 대체용 ref
          timeout={{ exit: 300, enter: 300 }}
          classNames="slide"
          unmountOnExit              // exit 끝난 뒤에야 DOM 언마운트
        >
          {/* ② 매번 새로 렌더되는 컨테이너에 ref 달기 */}
          <ul ref={slideRef} className="KYM-popular-list">
            {paginatedPopular.map((item, idx) => (
              <li key={item.id} className="KYM-popular-item">
                <span className="KYM-rank">
                  {(popularPage - 1) * POSTS_PER_PAGE + idx + 1}.
                </span>
                <img
                  src={item.image}
                  alt="썸네일"
                  className="KYM-pop-thumb"
                  draggable="false"
                />
                <div className="KYM-info">
                  <span className="KYM-pop-nickname">{item.nickname}</span>
                  <span className="KYM-pop-count">{item.count}</span>
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

        <button
          className="KYM-create-post-button"
          onClick={onCreateClick}
        >
          <img src={plusIcon} alt="새 글 추가" />
        </button>
      </div>
      {/* 신고 모달 */}
      <ReportModal
        show={reportTargetId !== null}
        onClose={() => setReportTargetId(null)}
        onSubmit={({ reason, detail }) => {
          // TODO: 여기에 실제 신고 API 호출
          console.log('신고할 게시물 ID:', reportTargetId, '사유:', reason, '상세:', detail);
          setReportTargetId(null);
        }}
      />
    </div>
  );
};

export default FeedPage;