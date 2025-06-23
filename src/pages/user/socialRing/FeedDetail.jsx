import React, { useEffect, useRef, useState } from 'react';
import './FeedDetail.css';
import moreIcon from './icons/more.png';
import { useParams } from 'react-router-dom';
import { myAxios } from '../../../config';
import ReportModal from './ReportModal';
import EmojiPicker from 'emoji-picker-react';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';

export default function FeedDetail() {
  // Jotai atom에서 토큰 읽어오기
  const token = useAtomValue(tokenAtom);
  const isLoggedIn = Boolean(token);

  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { feedId } = useParams();
  // const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [replyText, setReplyText] = useState('');
  const menuRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const user = useAtomValue(userAtom);

  const [feed, setFeed] = useState([]);
  const [comment, setComment] = useState([]);
  // const rawToken = typeof token === 'string'
  // ? token
  // : token.access_token.replace(/^Bearer\s+/, '');
  useEffect(() => {
    console.log(token)
    myAxios().get(`/socialing/feed?feedId=${feedId}`)
      .then(res => {
        console.log(res)
        setFeed(res.data)
        console.log("댓글")
        console.log(res.data.comments)
        setComment(res.data.comments)
        console.log(token)
      })
      .catch(err => {
        console.log(err)
      })
  }, [token])
  // useEffect(() => {
  //   const fetchFeed = async () => {
  //     try {
  //       console.log(user.username)
  //       const api = myAxios(token);
  //       const { data } = await api.get(`/socialing/feed/${feedId}`);
  //       setFeed(data);
  //       console.log(data)
  //     } catch (err) {
  //       console.error(err);
  //       setError('피드 정보를 불러오지 못했습니다.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchFeed();
  // }, [feedId]);

  // useEffect(() => {
  //   const handler = e => {
  //     if (menuRef.current && !menuRef.current.contains(e.target)) {
  //       setShowMenu(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handler);
  //   return () => document.removeEventListener('mousedown', handler);
  // }, []);

  // if (loading) return <div className="KYM-detail-container">로딩 중…</div>;
  if (error) return <div className="KYM-detail-container">{error}</div>;
  if (!feed) return <div className="KYM-detail-container">피드가 없습니다.</div>;

  const {
   content,
    tag1, tag2, tag3, tag4, tag5,
    writerId, writerProfile, writerBadge,
    createdAt, likesCount,  likedByUser, mine,
    comments = [], moreImg1List = []
  } = feed;
  const images = [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(src => src);
  const tags = [tag1, tag2, tag3, tag4, tag5].filter(Boolean);
  const formatDate = s => new Date(s).toLocaleDateString();

  const toggleMenu = () => setShowMenu(v => !v);
  const openReport = () => { setShowMenu(false); setShowReport(true); };
  const closeReport = () => setShowReport(false);

  const onToggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const postComment = async () => {
    if (!commentText.trim()) return;
    try {
      const api = myAxios(token);
      const res = await api.post(`/user/socialing/feed/comment`, {
        feedId: feedId,
        content: commentText,
        parentId: null   // 최상위 댓글
      });
      const newComment = res.data;   // 서버에서 반환된 방금 등록된 댓글

    // 2) comment 배열에 바로 추가
    setComment(prev => [  ...prev,newComment ]);
      // 등록 후 새로고침 대신 comments만 갱신
      const { data } = await api.get(`/socialing/feed?feedId=${feedId}`);
      setFeed(data);
      setCommentText('');
    } catch (e) {
      console.error(e);
      alert('댓글 등록에 실패했습니다.');
    }
  };
  // const postReply = async (parentId) => {
  //   if (!replyText.trim()) return;
  //   try {
  //     const api = myAxios(token);
  //     await api.post(`/user/socialing/feed/${feedId}/comment`, {
  //       content: replyText,
  //       parentId: parentId
  //     });
  //     const { data } = await api.get(`/socialing/feed/${feedId}`);
  //     setFeed(data);
  //     setReplyingTo(null);
  //     setReplyText('');
  //   } catch (e) {
  //     console.error(e);
  //     alert('답글 등록에 실패했습니다.');
  //   }
  // };
  // const replysubmit = async()=>{
  //   console.log("▶ rawToken in replysubmit:", rawToken);
  //   myAxios(rawToken).post("/user/socialing/feed/comment",feed.feedId)
  //   .then(res=>{

  //     console.log(res)
      
  //   }).catch(err=>{
  //     console.log(feed.feedId)
  //     console.log(err)
  //   })
  // }
const replysubmit = async () => {
  // 1️⃣ 호출 직후 rawToken 찍기
  console.log("▶ rawToken in replysubmit:", rawToken);

  try {
    // 2️⃣ axios 인스턴스 생성 시 항상 rawToken 넘기기
    const api = myAxios(rawToken);

    // 3️⃣ 올바른 엔드포인트, 올바른 Body
    const payload = {
      content: replyText,        // 답글 내용
      parentId: replyingTo      // 최상위라면 null
    };

    console.log("▶ 요청 보낼 URL:", `/user/socialing/feed/${feedId}/comment`);
    console.log("▶ 요청 보낼 payload:", payload);

    // 4️⃣ 실제 POST 요청
    const res = await api.post(
      "/user/socialing/feed/comment",feed.feedId,
      payload
    );
    console.log("▶ 댓글 등록 성공:", res.status, res.data);

  } catch (err) {
    // 5️⃣ 에러도 꼭 찍기
    console.error("▶ 댓글 등록 에러:", err.response?.status, err.response?.data);
  }
};
  // 이모지 선택 핸들러
  const onEmojiClick = (emojiData, event) => {
    setCommentText(text => text + emojiData.emoji);
    setShowEmojiPicker(false);
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
            {comment.map(c => (
              <div key={c.commentId} className="KYM-comment-block">
                <img className="KYM-comment-avatar" src={c.userProfile || null} alt="" />
                <div className="KYM-comment-body">
                  <div className="KYM-comment-header">
                    <span className="KYM-comment-author">{c.writerId}</span>
                  </div>
                  <p className="KYM-comment-text">{c.content}</p>
                  <div className="KYM-comment-actions">
                    <span className="KYM-comment-date">{formatDate(c.createAt)}</span>
                    {c.replies && c.replies.length > 0 && (
                      <button
                        className="KYM-reply-toggle"
                        onClick={() => onToggleReplies(c.commentId)}
                      >
                        {showReplies[c.commentId] ? '답글 숨기기' : '답글 보기'}
                      </button>
                    )}
                    {isLoggedIn && (
                      <button
                        className="KYM-reply-add"
                        onClick={() => onReplyClick(c.commentId)}
                      >
                        답글 달기
                      </button>
                    )}
                  </div>
                  {showReplies[c.commentId] && c.replies?.map(r => (
                    <div key={r.commentId} className="KYM-reply-item">
                      <img className="KYM-reply-avatar" src={r.userProfile || null} alt="" />
                      <div className="KYM-reply-body">
                        <div className="KYM-comment-header">
                          <span className="KYM-comment-author">{r.writerId}</span>
                          <span className="KYM-comment-date">{formatDate(r.createAt)}</span>
                        </div>
                        <p className="KYM-comment-text">{r.content}</p>
                      </div>
                    </div>
                  ))}
                  {replyingTo === c.commentId && (
                    <div className="KYM-reply-input">
                      <input
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="답글을 입력하세요..."
                      />
                      <button className="KYM-btn KYM-submit" onClick={replysubmit}>
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
            <button
              className={`KYM-action-icon ${likedByUser ? 'liked' : ''}`}
              disabled={!isLoggedIn}
              onClick={() => {
                if (!isLoggedIn) return window.alert('로그인 후 이용해주세요.');
                // TODO: 좋아요 API 호출
              }}
            >
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
            <span
              className="KYM-input-emoji"
              onClick={() => {
                if (!isLoggedIn) {
                  return window.alert('로그인 후 이용해주세요.');
                }
                setShowEmojiPicker(v => !v);
              }}
            >
              😊
            </span>
            {/* 이모지 픽커 */}
            {showEmojiPicker && (
              <div className="emoji-picker-wrapper">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  disableSearchBar={true}
                  pickerStyle={{ width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                />
              </div>
            )}
            <input
              className="KYM-input-field"
              placeholder={isLoggedIn ? "댓글 달기..." : "로그인 후 댓글 작성 가능"}
              disabled={!isLoggedIn}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button
              className="KYM-input-post"
              disabled={!isLoggedIn || !commentText.trim()}
              onClick={postComment}
            >
              게시
            </button>
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
    </div >
  );
}
