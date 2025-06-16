// src/components/FeedDetail.jsx

import React, { useEffect, useRef, useState } from 'react';
import './FeedDetail.css';
import badgeIcon from './icons/badge.jpg';
import moreIcon from './icons/more.png';
import ReportModal from './ReportModal';

// 댓글 더미 데이터
const dummyComments = [
    {
        id: 1,
        author: 'abcd',
        avatar: 'https://via.placeholder.com/32',
        text: '와 강아지 정말 귀여워요~~!',
        date: '2025.05.24',
        replies: [
            {
                id: 11,
                author: '닉네임',
                avatar: 'https://via.placeholder.com/32',
                text: '놀러 오세요!!',
                date: '2025.05.24'
            }
        ]
    },
    {
        id: 2,
        author: 'efgtf',
        avatar: 'https://via.placeholder.com/32',
        text: '강아지 보고 싶어요~!',
        date: '2025.05.24',
        replies: []
    }
];

// 주인장 다른 피드 더미
const otherFeeds = [
    'https://via.placeholder.com/120?text=1',
    'https://via.placeholder.com/120?text=2',
    'https://via.placeholder.com/120?text=3'
];

export default function FeedDetail() {
    const [showReplies, setShowReplies] = useState({});
    const [replyInputMode, setReplyInputMode] = useState({});   // 답글 입력 모드
    const [showMenu, setShowMenu] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const menuRef = useRef(null);
    const toggleMenu = () => setShowMenu(prev => !prev);
    const openReport = () => {
        setShowMenu(false);
        setShowReport(true);
    };
    const closeReport = () => setShowReport(false);

    useEffect(() => {
        const onClickOutside = e => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);
    const toggleReplies = commentId => {
        setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };
    const toggleReplyInput = commentId => {
        setReplyInputMode(prev => ({ ...prev, [commentId]: !prev[commentId] }));
        // (추가로 input에 포커스 로직을 넣어도 좋습니다)
    };
    return (
        <div className="KYM-detail-container">
            <div className="KYM-detail-main">
                {/* ─── 왼쪽: 이미지 ─── */}
                <div className="KYM-detail-image">
                    <img
                        src="data:image/jpeg;base64,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"
                        alt="피드"
                    />
                </div>

                {/* ─── 오른쪽: 프로필 + 댓글 ─── */}
                <div className="KYM-detail-side">
                    {/* 프로필 헤더 */}
                    <div className="KYM-detail-header">
                        <img
                            src="data:image/jpeg;base64,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"
                            alt="작성자"
                            className="KYM-detail-avatar"
                        />
                        <div className="KYM-detail-userinfo">
                            <div className="KYM-detail-name-line">
                                <span className="KYM-detail-nickname">닉네임</span>
                                <img className="KYM-detail-badge" src={badgeIcon} alt="배지" />
                                <button className="KYM-follow-btn">팔로우</button>
                                <div className="KYM-more-wrapper" ref={menuRef}>
                                    <img
                                        className="KYM-detail-more"
                                        src={moreIcon}
                                        alt="더보기"
                                        onClick={toggleMenu}
                                    />

                                    {/* (2) 메뉴 팝업 */}
                                    {showMenu && (
                                        <ul className="KYM-detail-menu">
                                            <li onClick={openReport}>신고하기</li>
                                            <li onClick={() => {/* 스크랩 로직 */ }}>스크랩하기</li>
                                            <li onClick={() => {/* 공유 로직 */ }}>공유하기</li>
                                            <li onClick={() => { navigator.clipboard.writeText(window.location.href) }}>링크복사</li>
                                            <li onClick={() => {/* DM 로직 */ }}>DM 보내기</li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 댓글 리스트 */}
                    <div className="KYM-detail-comments">
                        {dummyComments.map(c => (
                            <div key={c.id} className="KYM-comment-block">
                                <div className="KYM-comment-item">
                                    <img className="KYM-comment-avatar" src={c.avatar} alt="" />
                                    <div className="KYM-comment-body">
                                        <div className="KYM-comment-header">
                                            <span className="KYM-comment-author">{c.author}</span>
                                            <img className="KYM-comment-badge" src={badgeIcon} alt="" />
                                            <span className="KYM-comment-date">{c.date}</span>
                                        </div>
                                        <p className="KYM-comment-text">{c.text}</p>
                                        <button
                                            className="KYM-reply-add"
                                            onClick={() => {
                                                toggleReplyInput(c.id)
                                            }}>답글달기</button>&nbsp;&nbsp;
                                        {c.replies.length > 0 && (
                                            <button
                                                className="KYM-toggle-replies"
                                                onClick={() => toggleReplies(c.id)}
                                            >
                                                {showReplies[c.id] ? '답글 숨기기' : '답글 보기'}
                                            </button>
                                        )}
                                        {/* ─── 답글 입력란 ─── */}
                                        {replyInputMode[c.id] && (
                                            <div className="KYM-reply-input">
                                                <input
                                                    type="text"
                                                    placeholder="답글을 입력하세요…"
                                                /* onChange, value, onKeyPress 등 로직 추가 */
                                                />
                                                <button className="KYM-btn KYM-submit">등록</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {showReplies[c.id] &&
                                    c.replies.map(r => (
                                        <div key={r.id} className="KYM-reply-item">
                                            <img className="KYM-reply-avatar" src={r.avatar} alt="" />
                                            <div className="KYM-reply-body">
                                                <div className="KYM-comment-header">
                                                    <span className="KYM-comment-author">{r.author}</span>
                                                    <img
                                                        className="KYM-comment-badge"
                                                        src={badgeIcon}
                                                        alt=""
                                                    />
                                                    <span className="KYM-comment-date">{r.date}</span>
                                                </div>
                                                <p className="KYM-comment-text">{r.text}</p>
                                                {/* 중첩된 대댓글에도 답글달기 링크 */}
                                                <button
                                                    className="KYM-reply-add"
                                                    onClick={() => toggleReplyInput(r.id)}
                                                >
                                                    답글달기
                                                </button>
                                                {replyInputMode[r.id] && (
                                                    <div className="KYM-reply-input">
                                                        <input
                                                            type="text"
                                                            placeholder="답글을 입력하세요…"
                                                        /* value, onChange 추가 */
                                                        />
                                                        <button className="KYM-btn KYM-submit">등록</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                    {/* ─── 새 댓글 입력 ─── */}
                    <div className="KYM-add-comment">
                        <input type="text" placeholder="댓글을 입력하세요…" />
                        <button className="KYM-btn KYM-submit">등록</button>
                    </div>
                </div>
            </div>

            <hr className="KYM-divider" />
            {/* ─── 작성자 다른 피드 더 보기 ─── */}
            <div className="KYM-other-section">
                <p className="KYM-other-title">닉네임 님의 게시글 더 보기</p>
                <div className="KYM-other-grid">
                    {otherFeeds.map((url, i) => (
                        <img key={i} src={url} alt={`other${i}`} />
                    ))}
                </div>
            </div>
            {/* 신고 모달 */}
            <ReportModal
                show={showReport}
                onClose={closeReport}
                onSubmit={({ reason, detail }) => {
                    // TODO: 신고 API 호출
                    console.log('신고:', reason, detail);
                    closeReport();
                }}
            />
        </div>
    );
}
