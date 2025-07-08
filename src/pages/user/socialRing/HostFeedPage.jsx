import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { myAxios, url } from '../../../config';
import './HostFeedPage.css';
import Header from '../../common/Header';
import moreIcon from './icons/more.png';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../../atoms';

export default function HostFeedPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [category, setCategory] = useState('');
    const [offset, setOffset] = useState(0);
    const [size] = useState(10);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});
    const user = useAtomValue(userAtom)
    const menuRef = useRef(null);

    const { data: feeds = [] } = useQuery({
        queryKey: ['hostFeeds', category, offset, size],
        queryFn: async () => {
            const params = new URLSearchParams({ offset, size });
            if (category) params.append('category', category);
            const endpoint = `/feedHost?${params.toString()}`;
            const res = await myAxios().get(endpoint);
            return res.data;
        }
    });

    const getFeedImages = feed =>
        [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean);

    return (
        <>
            <Header />
            <div className="KYM-host-container">
                <h2>강사 홍보</h2>

                <div className="KYM-host-filters">
                    {['', '스포츠', '음식', '공예 / DIY', '뷰티', '문화예술', '심리 / 상담', '자유모임'].map(cat => (
                        <button key={cat}
                            className={`KYM-host-filter-button${category === cat ? ' active' : ''}`}
                            onClick={() => {
                                setCategory(cat);
                                setOffset(0);
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
                                        <div className="KYM-host-category">{feed.category}</div>
                                        <img
                                            src={moreIcon}
                                            alt="더보기"
                                            className="KYM-host-more-icon"
                                            onClick={() => {
                                                console.log("Clicked moreIcon for feedId:", feed.feedId);
                                                setMenuOpenId(menuOpenId === feed.feedId ? null : feed.feedId);
                                            }}
                                        />
                                        {menuOpenId === feed.feedId && (
                                            <ul ref={menuRef} className="KYM-host-menu open">
                                                {user?.id === feed.writerUserId && (
                                                    <>
                                                        <li onClick={() => {
                                                            navigate(`/edit/${feed.feedId}`);
                                                            setMenuOpenId(null);
                                                        }}>수정하기</li>
                                                        <li onClick={async () => {
                                                            if (!window.confirm("정말 삭제하시겠습니까?")) return;
                                                            try {
                                                                await myAxios().delete(`/user/${feed.feedId}`);
                                                                alert("삭제 완료!");
                                                                queryClient.invalidateQueries(['hostFeeds']);
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
                    </div>
                </div>
            </div>
        </>
    );
}
