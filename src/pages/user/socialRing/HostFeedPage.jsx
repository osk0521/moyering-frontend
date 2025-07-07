import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { myAxios, url } from '../../../config';
import './HostFeedPage.css';
import Header from '../../common/Header';

export default function HostFeedPage() {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [offset, setOffset] = useState(0);
    const [size] = useState(10);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});

    // 👉 전체 조회 (카테고리 필터도 서버에서 무시하도록 요청 가능)
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
        <Header/>
        <div className="KYM-feed-container">
            <h2>강사 홍보</h2>

            <div className="KYM-feed-filters">
                {['', '스포츠', '음식', '공예 / DIY', '뷰티', '문화예술', '심리 / 상담', '자유모임'].map(cat => (
                    <button key={cat}
                        className={`KYM-filter-button${category === cat ? ' active' : ''}`}
                        onClick={() => {
                setCategory(cat);
                setOffset(0);
            }}>
                        {cat || '전체'}
                    </button>
                ))}
            </div>

            <div className="KYM-feed-main">
                <div className="KYM-posts-grid">
                    {feeds.map(feed => {
                        const images = getFeedImages(feed);
                        const currentIdx = imageIndexes[feed.feedId] || 0;

                        return (
                            <div className="KYM-post-card" key={feed.feedId}>
                                <div className="KYM-post-header">
                                    <div className="KYM-user-info">
                                        <img src={`${url}/iupload/${feed.hostProfile}`} alt="강사 프로필"
                                            className="KYM-avatar" style={{ cursor: "pointer" }}
                                            onClick={() => navigate(`/feedHost/${feed.hostId}`)} />
                                        <span className="KYM-nickname"
                                            onClick={() => navigate(`/feedHost/${feed.hostId}`)}
                                            style={{ cursor: "pointer" }}>
                                            {feed.hostName}
                                        </span>
                                    </div>
                                </div>

                                <div className="KYM-image-slider">
                                    <img src={`${url}/iupload/${images[currentIdx]}`} alt="피드 이미지" className="KYM-post-image" />
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

                                {/* 좋아요 버튼 완전히 제거 */}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
        </>
    );
}
