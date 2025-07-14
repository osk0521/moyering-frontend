import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Test2.css';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { myAxios, url } from '../../../config';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import FollowButton from './FollowButton';
import moreIcon from './icons/more.png';
import plusIcon from './icons/plus.svg';
import FeedCreate from '../socialRing/FeedCreate';

export default function FeedPage2() {
    const navigate = useNavigate();
    const [token, setToken] = useAtom(tokenAtom);
    const user = useAtomValue(userAtom);

    const [sortType, setSortType] = useState('all');
    const [feeds, setFeeds] = useState([]);
    const [offset, setOffset] = useState(0);
    const size = 10;
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false); // ✅ 추가

    const [likedFeedIdSet, setLikedFeedIdSet] = useState(new Set());
    const [scrappedFeedIdSet, setScrappedFeedIdSet] = useState(new Set());

    const [popularFeeds, setPopularFeeds] = useState([]);
    const [popularPage, setPopularPage] = useState(1);

    const [menuOpenId, setMenuOpenId] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);

    const POSTS_PER_PAGE = 3;
    const slideRef = useRef(null);

    useEffect(() => {
        setOffset(0);
        setHasMore(true);
        loadFeeds(0, true);
    }, [sortType]);

    useEffect(() => {
        if (!token) {
            setLikedFeedIdSet(new Set());
            setScrappedFeedIdSet(new Set());
            return;
        }
        const fetchLikesScraps = async () => {
            try {
                const [likesRes, scrapsRes] = await Promise.all([
                    myAxios(token, setToken).get(`/user/socialing/likes`),
                    myAxios(token, setToken).get(`/user/socialing/scrap`)
                ]);
                setLikedFeedIdSet(new Set(likesRes.data.filter(item => item.likedByUser).map(item => item.feedId)));
                setScrappedFeedIdSet(new Set(scrapsRes.data));
            } catch (err) {
                console.error(err);
            }
        };
        fetchLikesScraps();
    }, [token]);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await myAxios().get(`/socialing/popular?size=12`);
                setPopularFeeds(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPopular();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPopularPage(prev => {
                if (prev >= Math.ceil(popularFeeds.length / POSTS_PER_PAGE)) return 1;
                return prev + 1;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [popularFeeds]);

    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || loading) return; // ✅ loading 추가
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                loadFeeds(offset + size);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading, offset]); // ✅ loading, offset 의존성 추가

    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpenId && menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpenId]);

    const loadFeeds = async (nextOffset, reset = false) => {
        setLoading(true);
        try {
            const res = await myAxios().get(`/socialing/feeds`, {
                params: { sort: sortType, offset: nextOffset, size }
            });
            const newFeeds = res.data;
            if (reset) {
                setFeeds(newFeeds);
            } else {
                setFeeds(prev => [...prev, ...newFeeds]);
            }
            if (newFeeds.length < size) setHasMore(false);
            setOffset(nextOffset);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getFeedImages = feed => [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean);

    const toggleLike = async (feed) => {
        if (!token) return alert("로그인이 필요합니다.");
        try {
            await myAxios(token, setToken).post(`/user/socialing/likes/${feed.feedId}`);
            const isCurrentlyLiked = likedFeedIdSet.has(feed.feedId);
            const newLikeCount = isCurrentlyLiked ? feed.likesCount - 1 : feed.likesCount + 1;

            setLikedFeedIdSet(prev => {
                const copy = new Set(prev);
                if (copy.has(feed.feedId)) copy.delete(feed.feedId);
                else copy.add(feed.feedId);
                return copy;
            });

            setFeeds(prevFeeds => prevFeeds.map(f =>
                f.feedId === feed.feedId ? { ...f, likesCount: newLikeCount } : f
            ));

            setPopularFeeds(prevPopular => {
                const updated = prevPopular.map(f =>
                    f.feedId === feed.feedId ? { ...f, likesCount: newLikeCount } : f
                );
                return [...updated].sort((a, b) => b.likesCount - a.likesCount);
            });

        } catch (err) {
            console.error(err);
        }
    };

    const toggleScrap = async (feed) => {
        if (!token) return alert("로그인이 필요합니다.");
        try {
            if (!scrappedFeedIdSet.has(feed.feedId)) {
                await myAxios(token, setToken).post(`/user/socialing/scrap`, null, { params: { feedId: feed.feedId } });
                setScrappedFeedIdSet(prev => new Set(prev).add(feed.feedId));
            } else {
                await myAxios(token, setToken).delete(`/user/socialing/scrap/${feed.feedId}`);
                setScrappedFeedIdSet(prev => {
                    const copy = new Set(prev);
                    copy.delete(feed.feedId);
                    return copy;
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const totalPages = Math.ceil(popularFeeds.length / POSTS_PER_PAGE);
    const startIdx = (popularPage - 1) * POSTS_PER_PAGE;
    const paginatedPopular = popularFeeds.slice(startIdx, startIdx + POSTS_PER_PAGE);

    return (
        <>
            <Header />
            <div className="KYM-feed2-container">
                <div className="KYM-feed-title"><h3>소셜링</h3></div>

                <div className="KYM-feed2-filters">
                    {['전체', '좋아요순', '댓글순'].map((txt, idx) => {
                        const key = ['all', 'likes', 'comments'][idx];
                        return (
                            <button key={key}
                                className={`KYM-filter-button${sortType === key ? ' active' : ''}`}
                                onClick={() => setSortType(key)}>
                                {txt}
                            </button>
                        );
                    })}
                </div>

                <div className="KYM-feed2-main">
                    <div className="KYM-posts-grid">
                        {feeds.map(feed => {
                            const images = getFeedImages(feed);
                            const currentIdx = imageIndexes[feed.feedId] || 0;
                            const likedByUser = likedFeedIdSet.has(feed.feedId);
                            const scrapped = scrappedFeedIdSet.has(feed.feedId);

                            return (
                                <div className="KYM-post-card" key={feed.feedId}>
                                    <div className="KYM-post-header">
                                        <div className="KYM-user-info">
                                            <img src={feed.writerProfile ? `${url}/iupload/${feed.writerProfile}` : '/profile.png'}
                                                alt="프로필" className="KYM-avatar"
                                                onClick={() => navigate(`/userFeed/${feed.writerId}`)} style={{ cursor: "pointer" }} />
                                            <span className="KYM-nickname"
                                                onClick={() => navigate(`/userFeed/${feed.writerId}`)} style={{ cursor: "pointer" }} >{feed.writerId}</span>
                                            {feed.writerBadge && <img src={feed.writerBadgeImg} alt="대표 배지" className="KYM-detail-badge-img" />}
                                            <FollowButton targetUserId={feed.writerUserId} className="KYM-follow-btn" style={{ marginLeft: '8px' }} />
                                        </div>
                                        <img src={moreIcon} alt="더보기" className="KYM-more-icon"
                                            onClick={() => setMenuOpenId(menuOpenId === feed.feedId ? null : feed.feedId)} />
                                        {menuOpenId === feed.feedId && (
                                            <ul ref={menuRef} className="KYM-post-menu open">
                                                {/* <li onClick={() => { console.log(`신고: ${feed.feedId}`); setMenuOpenId(null); }}>신고하기</li> */}
                                                <li onClick={() => { toggleScrap(feed); setMenuOpenId(null); }}>
                                                    {scrapped ? '스크랩 해제' : '스크랩하기'}
                                                </li>
                                                <li onClick={() => { navigate(`/feed/${feed.feedId}`); setMenuOpenId(null); }}>게시물로 이동</li>
                                                <li onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/feed/${feed.feedId}`); alert("링크 복사됨"); setMenuOpenId(null); }}>링크복사</li>
                                            </ul>
                                        )}
                                    </div>

                                    <div className="KYM-image-slider" onClick={() => navigate(`/feed/${feed.feedId}`)} style={{ cursor: "pointer" }}>
                                        <img src={`${url}/iupload/${images[currentIdx]}`} alt="피드" className="KYM-post-image" />
                                        {images.length > 1 && (
                                            <>
                                                <button className="KYM-image-nav left" onClick={(e) => { e.stopPropagation(); setImageIndexes(prev => ({ ...prev, [feed.feedId]: (currentIdx - 1 + images.length) % images.length })); }}>◀</button>
                                                <button className="KYM-image-nav right" onClick={(e) => { e.stopPropagation(); setImageIndexes(prev => ({ ...prev, [feed.feedId]: (currentIdx + 1) % images.length })); }}>▶</button>
                                            </>
                                        )}
                                    </div>
                                    <div className="KYM-image-dots">
                                        {images.map((_, i) => (<span key={i} className={i === currentIdx ? 'dot active' : 'dot'}>●</span>))}
                                    </div>

                                    <div className="KYM-post-content">
                                        <p className="clamp-3">{feed.content}</p>
                                        {feed.content && feed.content.length > 100 && (
                                            <span className="more-button" onClick={() => navigate(`/feed/${feed.feedId}`)}>...더보기</span>
                                        )}
                                        <div className="KYM-hashtags">
                                            {[feed.tag1, feed.tag2, feed.tag3, feed.tag4, feed.tag5].filter(Boolean).map((tag, i) => (
                                                <span key={i} className="KYM-hashtag">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="KYM-post-footer">
                                        <div className="KYM-stats">
                                            <button className={`KYM-like-button${likedByUser ? ' active' : ''}`} onClick={() => toggleLike(feed)}>
                                                <img src={likedByUser ? heartFilled : heartOutline} alt="좋아요" /><span>{feed.likesCount}</span>
                                            </button>
                                            <button className="KYM-comment-button" onClick={() => navigate(`/feed/${feed.feedId}`)}>💬 {feed.commentsCount}</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <aside className="KYM-feed2-sidebar">
                        <h3>인기 피드</h3>
                        <SwitchTransition mode="out-in">
                            <CSSTransition key={popularPage} nodeRef={slideRef} timeout={300} classNames="fade">
                                <div ref={slideRef}>
                                    <ul className="KYM-popular-list">
                                        {paginatedPopular.map((feed, idx) => (
                                            <li key={feed.feedId} className="KYM-popular-item"
                                                onClick={() => navigate(`/feed/${feed.feedId}`)} style={{ cursor: "pointer" }}>
                                                <span className="KYM-rank">{startIdx + idx + 1}.</span>
                                                <img src={`${url}/iupload/${getFeedImages(feed)[0]}`} alt="썸네일" className="KYM-pop-thumb" />
                                                <div className="KYM-info">
                                                    <span className="KYM-pop-nickname">{feed.writerId}</span>
                                                    <span className="KYM-pop-count">❤️ {feed.likesCount}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CSSTransition>
                        </SwitchTransition>
                        <div className="KYM-pagination-dots">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button key={idx} className={`KYM-dot${popularPage === idx + 1 ? ' active' : ''}`} onClick={() => setPopularPage(idx + 1)} />
                            ))}
                        </div>
                    </aside>

                    {token && (
                        <button className="KYM-create-post-button" onClick={() => setShowCreateModal(true)}>
                            <img src={plusIcon} alt="새 글 작성" />
                        </button>
                    )}
                </div>

                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <FeedCreate onCancel={() => setShowCreateModal(false)} />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
