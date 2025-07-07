import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './Test2.css';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { myAxios, url } from '../../../config';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import { SwitchTransition } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import FollowButton from './FollowButton';
import moreIcon from './icons/more.png';
import plusIcon from './icons/plus.svg';
import FeedCreate from '../socialRing/FeedCreate';

export default function FeedPage2() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [token, setToken] = useAtom(tokenAtom);
    const [sortType, setSortType] = useState('all');
    const [popularPage, setPopularPage] = useState(1);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);


    // 👉 피드
    const { data: feeds = [] } = useQuery({
        queryKey: ['feeds', sortType, token],
        queryFn: async () => {
            const res = await myAxios().get(`/socialing/feeds?sort=${sortType}`);
            return res.data;
        },
        // enabled: !!token
    });

    // 👉 인기 피드
    const { data: popularFeeds = [] } = useQuery({
        queryKey: ['popular'],
        queryFn: async () => {
            const res = await myAxios().get(`/socialing/popular?size=10`);
            return res.data;
        }
    });

    // 👉 좋아요
    const { data: likedIds = [] } = useQuery({
        queryKey: ['likes'],
        queryFn: async () => {
            if (!token) return [];
            const res = await myAxios(token, setToken).get(`/user/socialing/likes`);
            return res.data.filter(item => item.likedByUser).map(item => item.feedId);
        },
        enabled: !!token
    });
    const likedFeedIdSet = useMemo(() => new Set(likedIds), [likedIds]);

    // 👉 스크랩
    const { data: scrappedIds = [] } = useQuery({
        queryKey: ['scraps'],
        queryFn: async () => {
            if (!token) return [];
            const res = await myAxios(token, setToken).get(`/user/socialing/scrap`);
            return res.data;  // 서버에서 feedId 배열만 리턴
        },
        enabled: !!token
    });
    const scrappedFeedIdSet = useMemo(() => new Set(scrappedIds), [scrappedIds]);

    // 👉 merge liked, scrapped
    const feedsWithStatus = useMemo(() => {
        return feeds.map(feed => ({
            ...feed,
            likedByUser: likedFeedIdSet.has(Number(feed.feedId)),
            scrapped: scrappedFeedIdSet.has(Number(feed.feedId))
        }));
    }, [feeds, likedIds, scrappedIds]);

    // 👉 좋아요 mutation
    const likeMutation = useMutation({
        mutationFn: (feedId) => myAxios(token, setToken).post(`/user/socialing/likes/${feedId}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['likes']);
            queryClient.invalidateQueries(['feeds', sortType, token]);
        }
    });

    const toggleLike = (feed) => {
        if (!token) return alert("로그인이 필요합니다.");
        likeMutation.mutate(feed.feedId);
    };

    // 👉 스크랩 mutation
    const scrapMutation = useMutation({
        mutationFn: async (feed) => {
            if (!token) return;
            if (!feed.scrapped) {
                return myAxios(token, setToken).post(`/user/socialing/scrap`, null, { params: { feedId: feed.feedId } });
            } else {
                return myAxios(token, setToken).delete(`/user/socialing/scrap/${feed.feedId}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['scraps']);
            queryClient.invalidateQueries(['feeds', sortType, token]);
        }
    });

    const toggleScrap = (feed) => {
        if (!token) return alert("로그인이 필요합니다.");
        scrapMutation.mutate(feed);
    };

    const getFeedImages = feed => [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: '게시물 제목',
                text: '게시물 설명',
                url: window.location.href,
            })
                .catch(console.error);
        } else {
            alert("이 브라우저에서는 공유를 지원하지 않습니다. 카카오톡으로 공유하려면 별도 버튼을 이용하세요.");
            // 또는 Kakao.Share.sendDefault(...) 호출
        }
    };

    const POSTS_PER_PAGE = 3;
    const totalPages = Math.ceil(popularFeeds.length / POSTS_PER_PAGE);
    const safePopularPage = Math.min(Math.max(popularPage, 1), totalPages);
    const startIdx = (popularPage - 1) * POSTS_PER_PAGE;
    const endIdx = startIdx + POSTS_PER_PAGE;
    const paginatedPopular = popularFeeds.slice(startIdx, endIdx);
    const goToPage = (pageNum) => {
        const safePage = Math.max(1, Math.min(pageNum, totalPages));
        setPopularPage(safePage);
    };

    const slideRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setPopularPage(prev => {
                if (prev >= totalPages) return 1;
                return prev + 1;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [totalPages]);


    return (
        <>
            <Header />
            <div className="KYM-feed-container">
                <div className="KYM-feed-title"><h2>소셜링</h2></div>

                <div className="KYM-feed-filters">
                    {['전체', '좋아요순', '댓글순', '팔로워'].map((txt, idx) => {
                        const key = ['all', 'likes', 'comments', 'follow'][idx];
                        return (
                            <button key={key}
                                className={`KYM-filter-button${sortType === key ? ' active' : ''}`}
                                onClick={() => setSortType(key)}>
                                {txt}
                            </button>
                        );
                    })}
                </div>

                <div className="KYM-feed-main">
                    <div className="KYM-posts-grid">
                        {feedsWithStatus.map(feed => {
                            const images = getFeedImages(feed);
                            const currentIdx = imageIndexes[feed.feedId] || 0;

                            return (
                                <div className="KYM-post-card" key={feed.feedId}>
                                    <div className="KYM-post-header">
                                        <div className="KYM-user-info">
                                            <img src={feed.writerProfile} alt="프로필" className="KYM-avatar" 
                                            onClick={()=> navigate(`/userFeed/${feed.writerId}`)} style={{cursor: "pointer"}}/>
                                            <span className="KYM-nickname"
                                            onClick={()=> navigate(`/userFeed/${feed.writerId}`)} style={{cursor: "pointer"}} >{feed.writerId}</span>
                                            {feed.writerBadge && <span className="KYM-detail-badge">🏅</span>}

                                            {/* 👍 팔로우 버튼 */}
                                            <FollowButton
                                                targetUserId={feed.writerUserId}
                                                className="KYM-follow-btn"
                                                style={{ marginLeft: '8px' }}
                                            />
                                        </div>
                                        <img
                                            src={moreIcon}
                                            alt="더보기"
                                            className="KYM-more-icon"
                                            onClick={() => setMenuOpenId(menuOpenId === feed.feedId ? null : feed.feedId)}
                                        />
                                        {menuOpenId === feed.feedId && (
                                            <ul className="KYM-post-menu open">
                                                <li onClick={() => {
                                                    console.log(`신고: ${feed.feedId}`);
                                                    setMenuOpenId(null);
                                                }}>신고하기</li>

                                                <li onClick={() => {
                                                    toggleScrap(feed);
                                                    setMenuOpenId(null);
                                                }}>
                                                    {feed.scrapped ? '스크랩 해제' : '스크랩하기'}
                                                </li>

                                                <li onClick={() => {
                                                    navigate(`/feed/${feed.feedId}`);
                                                    setMenuOpenId(null);
                                                }}>게시물로 이동</li>

                                                <li onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/feed/${feed.feedId}`);
                                                    alert("링크 복사됨");
                                                    setMenuOpenId(null);
                                                }}>링크복사</li>

                                                <li onClick={() => {
                                                    handleShare(feed);
                                                    setMenuOpenId(null);
                                                }}>공유하기</li>
                                            </ul>
                                        )}
                                    </div>

                                    <div className="KYM-image-slider">
                                        <img src={`${url}/iupload/${images[currentIdx]}`} alt="피드" className="KYM-post-image" />
                                        {images.length > 1 && (
                                            <>
                                                <button className="KYM-image-nav left"
                                                    onClick={() => setImageIndexes(prev => ({
                                                        ...prev, [feed.feedId]: (currentIdx - 1 + images.length) % images.length
                                                    }))}>◀</button>
                                                <button className="KYM-image-nav right"
                                                    onClick={() => setImageIndexes(prev => ({
                                                        ...prev, [feed.feedId]: (currentIdx + 1) % images.length
                                                    }))}>▶</button>
                                            </>
                                        )}
                                    </div>
                                    <div className="KYM-image-dots">
                                        {images.map((_, i) => (
                                            <span key={i} className={i === currentIdx ? 'dot active' : 'dot'}>●</span>
                                        ))}
                                    </div>

                                    <div className="KYM-post-content">
                                        <p>{feed.content}</p>
                                        <div className="KYM-hashtags">
                                            {[feed.tag1, feed.tag2, feed.tag3, feed.tag4, feed.tag5]
                                                .filter(Boolean)
                                                .map((tag, i) => <span key={i} className="KYM-hashtag">#{tag}</span>)}
                                        </div>
                                    </div>

                                    <div className="KYM-post-footer">
                                        <div className="KYM-stats">
                                            <button
                                                className={`KYM-like-button${feed.likedByUser ? ' active' : ''}`}
                                                onClick={() => toggleLike(feed)}
                                            >
                                                <img src={feed.likedByUser ? heartFilled : heartOutline} alt="좋아요" />
                                                <span>{feed.likesCount}</span>
                                            </button>
                                            <button className="KYM-comment-button" onClick={() => navigate(`/feed/${feed.feedId}`)}>
                                                💬 {feed.commentsCount}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <aside className="KYM-feed-sidebar">
                        <h3>인기 피드</h3>
                        <SwitchTransition mode="out-in">
                            <CSSTransition
                                key={safePopularPage}
                                nodeRef={slideRef}
                                timeout={300}
                                classNames="fade"
                                unmountOnExit
                            >
                                <ul ref={slideRef} className="KYM-popular-list">
                                    {paginatedPopular.map((feed, idx) => (
                                        <li key={feed.feedId} className="KYM-popular-item"
                                            onClick={() => navigate(`/feed/${feed.feedId}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <span className="KYM-rank">{startIdx + idx + 1}.</span>
                                            <img src={`${url}/iupload/${getFeedImages(feed)[0]}`} alt="썸네일" className="KYM-pop-thumb" />
                                            <div className="KYM-info">
                                                <span className="KYM-pop-nickname">{feed.writerId}</span>
                                                <span className="KYM-pop-count">❤️ {feed.likesCount}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CSSTransition>
                        </SwitchTransition>
                        <div className="KYM-pagination-dots">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`KYM-dot${safePopularPage === idx + 1 ? ' active' : ''}`}
                                    onClick={() => goToPage(idx + 1)}
                                />
                            ))}
                        </div>
                    </aside>
                    {token && (
                        <button
                            className="KYM-create-post-button"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <img src={plusIcon} alt="새 글 작성" />
                        </button>
                    )}
                </div>
            </div>
            <Footer />
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <FeedCreate onCancel={() => setShowCreateModal(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
