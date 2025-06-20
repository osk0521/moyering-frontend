import React, { useEffect, useRef, useState } from 'react';
import './FeedDetail.css';
import moreIcon from './icons/more.png';
import { useParams } from 'react-router-dom';
import { myAxios } from '../../../config';
import ReportModal from './ReportModal';

export default function FeedDetail() {
  const { feedId } = useParams();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // commentId of open reply-input
  const [replyText, setReplyText] = useState('');   // draft for reply
  const menuRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('token');
        const api = myAxios(token ? `Bearer ${token}` : null);
        const { data } = await api.get(`/socialing/feed/${feedId}`);
        setFeed(data);
      } catch (err) {
        console.error(err);
        setError('피드 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [feedId]);

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (loading) return <div className="KYM-detail-container">로딩 중…</div>;
  if (error) return <div className="KYM-detail-container">{error}</div>;
  if (!feed) return <div className="KYM-detail-container">피드가 없습니다.</div>;

  const {
    img1,img2,img3,img4,img5, content,
    tag1, tag2, tag3, tag4, tag5,
    writerId, writerProfile, writerBadge,
    createdAt, likesCount, commentsCount, likedByUser, mine,
    comments = [], moreImg1List = []
  } = feed;
const images = [img1, img2, img3, img4, img5].filter(src => src);
  const tags = [tag1, tag2, tag3, tag4, tag5].filter(Boolean);
  const formatDate = s => new Date(s).toLocaleDateString();

  const toggleMenu = () => setShowMenu(v => !v);
  const openReport = () => { setShowMenu(false); setShowReport(true); };
  const closeReport = () => setShowReport(false);

  // reply toggle
  const onReplyClick = (commentId) => {
    setReplyingTo(prev => prev === commentId ? null : commentId);
    setReplyText('');
  };

  // dummy post reply
  const postReply = async (parentId) => {
    // TODO: call API to post reply
    console.log('post reply to', parentId, replyText);
    setReplyingTo(null);
  };

  return (
    <div className="KYM-detail-container">
      <div className="KYM-detail-main">
        <div className="KYM-detail-image">
          {images.length > 0 && (
            <>
              <img
                src={images[currentImage]}
                alt={`feed-${currentImage}`}
              />

              {/* 좌/우 내비게이션 */}
              {images.length > 1 && (
                <>
                  <button
                    className="KYM-image-nav left"
                    onClick={() =>
                      setCurrentImage(
                        (currentImage - 1 + images.length) % images.length
                      )
                    }
                  >‹</button>

                  <button
                    className="KYM-image-nav right"
                    onClick={() =>
                      setCurrentImage((currentImage + 1) % images.length)
                    }
                  >›</button>

                  <div className="KYM-image-dots">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={i === currentImage ? 'dot active' : 'dot'}
                      >●</span>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="KYM-detail-side">
          {/* header */}
          <div className="KYM-detail-header">
            <img className="KYM-detail-avatar" src={writerProfile} alt="" />
            <span className="KYM-detail-nickname">{writerId}</span>
            {writerBadge && <span className="KYM-detail-badge">🏅</span>}
            {!mine
              ? <button className="KYM-follow-btn">팔로우</button>
              : <button className="KYM-edit-btn">수정</button>}
            <div className="KYM-more-wrapper" ref={menuRef}>
              <img className="KYM-detail-more" src={moreIcon} onClick={toggleMenu} alt="more" />
              {showMenu && (
                <ul className="KYM-detail-menu">
                  <li onClick={openReport}>신고하기</li>
                  <li onClick={() => navigator.clipboard.writeText(window.location.href)}>링크복사</li>
                  <li>공유하기</li>
                  <li>DM 보내기</li>
                </ul>
              )}
            </div>
          </div>

          {/* content */}
          <div className="KYM-detail-content">{content}</div>
          <div className="KYM-hashtags">
            {tags.map((t, i) => <span key={i} className="KYM-hashtag">#{t}</span>)}
          </div>
          <div className="KYM-detail-date">{formatDate(createdAt)}</div>

          {/* comments */}
          <div className="KYM-detail-comments">
            {comments.map(c => (
              <div key={c.commentId} className="KYM-comment-block">
                <img className="KYM-comment-avatar" src={c.userProfile || ''} alt="" />
                <div className="KYM-comment-body">
                  <div className="KYM-comment-header">
                    <span className="KYM-comment-author">{c.username}</span>
                    <span className="KYM-comment-date">{formatDate(c.createAt)}</span>
                    <button className="KYM-reply-add" onClick={() => onReplyClick(c.commentId)}>
                      답글
                    </button>
                  </div>
                  <p className="KYM-comment-text">{c.content}</p>
                  {/* 대댓글 리스트 */}
                  {c.replies?.map(r => (
                    <div key={r.commentId} className="KYM-reply-item">
                      <img className="KYM-reply-avatar" src={r.userProfile || ''} alt="" />
                      <div className="KYM-reply-body">
                        <div className="KYM-comment-header">
                          <span className="KYM-comment-author">{r.username}</span>
                          <span className="KYM-comment-date">{formatDate(r.createAt)}</span>
                        </div>
                        <p className="KYM-comment-text">{r.content}</p>
                      </div>
                    </div>
                  ))}
                  {/* 대댓글 입력 */}
                  {replyingTo === c.commentId && (
                    <div className="KYM-reply-input">
                      <input
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="답글을 입력하세요..."
                      />
                      <button className="KYM-btn KYM-submit" onClick={() => postReply(c.commentId)}>
                        등록
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 액션 + stats */}
          <div className="KYM-actions">
            <button className={`KYM-action-icon ${likedByUser ? 'liked' : ''}`}>
              {likedByUser ? '❤️' : '🤍'}
            </button>
            <button className="KYM-action-icon">💬</button>
            <button className="KYM-action-icon">✈️</button>
            <div className="KYM-action-spacer" />
            <button className="KYM-action-icon">🔖</button>
          </div>
          <div className="KYM-like-info">
            <span className="KYM-like-count">좋아요 {likesCount}개</span>
            <span className="KYM-detail-date">{formatDate(createdAt)}</span>
          </div>

          {/* 댓글 입력창 */}
          <div className="KYM-add-comment">
            <span className="KYM-input-emoji">😊</span>
            <input className="KYM-input-field" placeholder="댓글 달기..." />
            <button className="KYM-input-post">게시</button>
          </div>
        </div>
      </div>

      <hr className="KYM-divider" />

      {/* 아래 썸네일 */}
      <div className="KYM-other-section">
        <p className="KYM-other-title">{writerId} 님의 게시글 더 보기</p>
        <div className="KYM-other-grid">
          {moreImg1List.map((src, i) => <img key={i} src={src} className="KYM-thumb" alt="" />)}
        </div>
      </div>

      <ReportModal
        show={showReport}
        onClose={closeReport}
        onSubmit={({ reason, detail }) => { console.log(reason, detail); closeReport(); }}
      />
    </div>
  );
}
