import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { myAxios, url } from '../../../config';
import './HostFeedPage.css';
import Header from '../../common/Header';
import moreIcon from './icons/more.png';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';

export default function HostFeedPage() {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [offset, setOffset] = useState(0);
    const [size] = useState(10);
    const [feeds, setFeeds] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});
    const user = useAtomValue(userAtom);
    const token = useAtomValue(tokenAtom);
    const menuRef = useRef(null);
    const loaderRef = useRef(null);

    // 데이터 요청
    const { refetch, isFetching } = useQuery({
        queryKey: ['hostFeeds'],
        enabled: false,
        queryFn: async () => {
            const params = new URLSearchParams({ offset, size });
            if (category) params.append('category', category);
            const res = await myAxios().get(`/feedHost?${params}`);
            return res.data;
        },
        onSuccess: (newData) => {
            if (offset === 0) {
                setFeeds(newData);
            } else {
                setFeeds(prev => [...prev, ...newData]);
            }
            setHasMore(newData.length === size);
        }
    });

    useEffect(() => {
        refetch();
    }, [offset]);

    useEffect(() => {
        setFeeds([]);
        setOffset(0);
        setHasMore(true);
        // 🔥 이걸 추가해줘야 함
        refetch();
    }, [category]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const target = entries[0];
            if (target.isIntersecting) {
                setLoadTrigger(true);
            }
        }, { threshold: 1.0 });

        const current = loaderRef.current;
        if (current) observer.observe(current);

        return () => {
            if (current) observer.unobserve(current);
        };
    }, []); // 👈 최초 1번만 실행

    const [loadTrigger, setLoadTrigger] = useState(false);

    useEffect(() => {
        if (loadTrigger && hasMore && !isFetching) {
            setOffset(prev => prev + size);
        }
        setLoadTrigger(false); // 재감지 방지
    }, [loadTrigger, hasMore, isFetching]);

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



    const getFeedImages = feed => [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean);

    return (
        <>
            <Header />
            <div className="KYM-host-container">
                <h2>강사 홍보</h2>

                {user?.hostId && (
                    <div style={{ textAlign: "right", margin: "10px 0" }}>
                        <button
                            style={{
                                background: "#FFB22C",
                                color: "white",
                                border: "none",
                                borderRadius: "20px",
                                padding: "8px 16px",
                                cursor: "pointer",
                                fontSize: "1rem"
                            }}
                            onClick={() => navigate("/host/createFeed")}
                        >
                            + 글쓰기
                        </button>
                    </div>
                )}

                <div className="KYM-host-filters">
                    {['', '스포츠', '음식', '공예 / DIY', '뷰티', '문화예술', '심리 / 상담', '자유모임'].map(cat => (
                        <button key={cat}
                            className={`KYM-host-filter-button${category === cat ? ' active' : ''}`}
                            onClick={() => {
                                if (cat !== category) {
                                    setCategory(cat);
                                }
                            }}>
                            {cat || '전체'}
                        </button>
                    ))}
                </div>

                <div className="KYM-host-main">
                    <div className="KYM-host-grid">
                        {feeds.map(feed => {
                            const images = getFeedImages(feed);
                            const currentIdx = imageIndexes[feed.feedId] || 0;

                            return (
                                <div className="KYM-host-card" key={feed.feedId}>
                                    <div className="KYM-host-header">
                                        <div className="KYM-host-user">
                                            <img src={`${url}/iupload/${feed.hostProfile}`} alt="강사 프로필"
                                                className="KYM-host-avatar" style={{ cursor: "pointer" }}
                                                onClick={() => navigate(`/feedHost/${feed.hostId}`)} />
                                            <span className="KYM-host-nickname"
                                                onClick={() => navigate(`/feedHost/${feed.hostId}`)}
                                                style={{ cursor: "pointer" }}>
                                                {feed.hostName}
                                            </span>
                                        </div>
                                        <img
                                            src={moreIcon}
                                            alt="더보기"
                                            className="KYM-host-more-icon"
                                            onClick={() => {
                                                setMenuOpenId(menuOpenId === feed.feedId ? null : feed.feedId);
                                            }}
                                        />
                                        {menuOpenId === feed.feedId && (
                                            <ul ref={menuRef} className="KYM-host-menu open">
                                                {user?.hostId === feed.hostId && (
                                                    <>
                                                        <li onClick={() => {
                                                            navigate(`/host/feedEdit/${feed.feedId}`);
                                                            setMenuOpenId(null);
                                                        }}>수정하기</li>
                                                        <li onClick={async () => {
                                                            if (!window.confirm("정말 삭제하시겠습니까?")) return;
                                                            try {
                                                                token && await myAxios(token).delete(`/host/feedDelete/${feed.feedId}`);
                                                                alert("삭제 완료!");
                                                                setFeeds(prev => prev.filter(f => f.feedId !== feed.feedId));
                                                            } catch (e) {
                                                                console.error(e);
                                                                alert("삭제 실패");
                                                            }
                                                            setMenuOpenId(null);
                                                        }}>삭제하기</li>
                                                    </>
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="KYM-host-slider" onClick={() => navigate(`/hostFeed/${feed.feedId}`)} style={{ cursor: "pointer" }}>
                                        <img src={`${url}/iupload/${images[currentIdx]}`} alt="피드 이미지" className="KYM-host-image" />
                                        {images.length > 1 && (
                                            <>
                                                <button className="KYM-host-nav left"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImageIndexes(prev => ({
                                                            ...prev, [feed.feedId]: (currentIdx - 1 + images.length) % images.length
                                                        }));
                                                    }}>◀</button>
                                                <button className="KYM-host-nav right"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImageIndexes(prev => ({
                                                            ...prev, [feed.feedId]: (currentIdx + 1) % images.length
                                                        }));
                                                    }}>▶</button>
                                            </>
                                        )}
                                    </div>

                                    <div className="KYM-host-dots">
                                        {images.map((_, i) => (
                                            <span key={i} className={i === currentIdx ? 'dot active' : 'dot'}>●</span>
                                        ))}
                                    </div>

                                    <div className="KYM-host-content">
                                        <p>{feed.content}</p>
                                        <div className="KYM-host-tags">
                                            {[feed.tag1, feed.tag2, feed.tag3, feed.tag4, feed.tag5]
                                                .filter(Boolean)
                                                .map((tag, i) => <span key={i} className="KYM-host-tag">#{tag}</span>)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* 무한스크롤 트리거 */}
                        {hasMore && <div ref={loaderRef} style={{ height: '40px' }} />}
                    </div>

                    {/* 로딩 or 없음 안내 */}
                    {isFetching && feeds.length === 0 && (
                        <p style={{ textAlign: 'center', margin: '1rem' }}>로딩 중...</p>
                    )}
                    {!isFetching && feeds.length === 0 && (
                        <p style={{ textAlign: 'center', margin: '1rem' }}>게시물이 없습니다.</p>
                    )}
                </div>
            </div>
        </>
    );
}
