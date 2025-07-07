import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { myAxios, url } from '../../../config';
import './HostFeedPage.css';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import plusIcon from './icons/plus.svg';

export default function HostFeedPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [token, setToken] = useAtom(tokenAtom);
    const { hostId } = useParams();
    const [category, setCategory] = useState('');
    const [offset, setOffset] = useState(0);
    const [size] = useState(10);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});

    // 👉 전체 조회 or 카테고리 필터
    const { data: feeds = [] } = useQuery({
        queryKey: ['hostFeeds', hostId, category, offset, size],
        queryFn: async () => {
            const params = new URLSearchParams({ offset, size });
            if (category) params.append('category', category);
            const endpoint = category
                ? `/api/hostFeeds/${hostId}/category?${params.toString()}`
                : `/api/hostFeeds/${hostId}?${params.toString()}`;
            const res = await myAxios().get(endpoint);
            return res.data;
        }
    });

    // 👉 좋아요 (socialing과 동일 로직이라면 유지)
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

    // 👉 좋아요 mutation
    const likeMutation = useMutation({
        mutationFn: (feedId) => myAxios(token, setToken).post(`/user/socialing/likes/${feedId}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['likes']);
            queryClient.invalidateQueries(['hostFeeds', hostId, category, offset, size]);
        }
    });
    const toggleLike = (feed) => {
        if (!token) return alert("로그인이 필요합니다.");
        likeMutation.mutate(feed.feedId);
    };

    // 👉 이미지 helpers
    const getFeedImages = feed =>
        [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean);

    return (
        <div className="KYM-feed-container">
            <h2>강사 홍보 피드</h2>

            <div className="KYM-feed-filters">
                {['', '스포츠', '음식', '공예 / DIY', '뷰티', '문화예술', '심리 / 상담', '자유모임'].map(cat => (
                    <button key={cat}
                        className={`KYM-filter-button${category === cat ? ' active' : ''}`}
                        onClick={() => setCategory(cat)}>
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
                                            onClick={() => navigate(`/host/${feed.hostId}`)} />
                                        <span className="KYM-nickname"
                                            onClick={() => navigate(`/host/${feed.hostId}`)}
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

                                <div className="KYM-post-footer">
                                    <button
                                        className={`KYM-like-button${likedFeedIdSet.has(feed.feedId) ? ' active' : ''}`}
                                        onClick={() => toggleLike(feed)}
                                    >
                                        <img src={likedFeedIdSet.has(feed.feedId) ? heartFilled : heartOutline} alt="좋아요" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
