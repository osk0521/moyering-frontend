import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios, url } from '../../../config';
import './HostFeedPage.css';
import Header from '../../common/Header';
import moreIcon from './icons/more.png';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import HostFeedCreate from './FeedHostCreate'; // 🔥 HostFeedCreate 임포트

export default function HostFeedPage() {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [feeds, setFeeds] = useState([]);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});
    const user = useAtomValue(userAtom);
    const token = useAtomValue(tokenAtom);
    const menuRef = useRef(null);
    const [showCreateModal, setShowCreateModal] = useState(false); // ✅ 모달 상태 추가

    const fetchFeeds = async () => {
        try {
            const params = new URLSearchParams();
            params.append("offset", 0);
            params.append("size", 100);
            if (category) params.append("category", category);

            const res = await myAxios().get(`/feedHost?${params}`);
            setFeeds(res.data);
        } catch (err) {
            console.error("피드 조회 실패", err);
        }
    };

    useEffect(() => {
        fetchFeeds();
    }, [category]);

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
                            onClick={() => setShowCreateModal(true)} // ✅ navigate → 모달 열기
                        >
                            + 글쓰기
                        </button>
                    </div>
                )}

                <div className="KYM-host-filters">
                    {['', '스포츠', '음식', '공예 / DIY', '뷰티', '문화예술', '심리 / 상담'].map(cat => (
                        <button key={cat}
                            className={`KYM-host-filter-button${category === cat ? ' active' : ''}`}
                            onClick={() => {
                                if (cat !== category) setCategory(cat);
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
                                            <img src={feed.hostProfile ? `${url}/iupload/${feed.hostProfile}` : "/profile.png"}
                                                alt="강사 프로필"
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
                                            onClick={() => setMenuOpenId(menuOpenId === feed.feedId ? null : feed.feedId)}
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
                                                    }}>&gt;</button>
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
                    </div>
                </div>

                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal-content KYM-HostFeedCreate-modal-content" onClick={(e) => e.stopPropagation()}>
                            <HostFeedCreate onCancel={() => setShowCreateModal(false)} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
