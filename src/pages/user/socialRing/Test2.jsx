import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import './Test2.css';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../../atoms';
import { myAxios } from '../../../config';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';

export default function FeedPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [token, setToken] = useAtom(tokenAtom);
    const [sortType, setSortType] = useState('all');
    const [popularPage, setPopularPage] = useState(0);
    const [menuFeed, setMenuFeed] = useState(null);

    // 👉 피드 목록 react-query
    const { data: feeds = [] } = useQuery({
        queryKey: ['feeds', sortType, token],
        queryFn: async () => {
            const res = await myAxios(token, setToken).get(`/socialing/feeds?sort=${sortType}`
                //     , {
                //     headers: { Authorization: token }
                // }
            );
            console.log("📦 서버에서 온 feeds data:", res.data);
            return res.data;
        },
        enabled: token !== undefined,
    });


    // 👉 인기 피드 react-query
    const { data: popularFeeds = [] } = useQuery(
        {
            queryKey: ['popular', popularPage],
            queryFn: async () => {
                const res = await myAxios().get(`/socialing/popular?page=${popularPage}&size=3`);
                return res.data;
            }
        });


    const { data: likedIds = [] } = useQuery({
        queryKey: ['likes'],
        queryFn: async () => {
            if (!token) return [];
            const res = await myAxios(token, setToken).get(`/user/socialing/likes`);
            console.log("🚀 API /user/socialing/likes res.data =", res.data);
            // return res.data; // [1,3,5,...] 이런 feedId 배열
            return res.data.map(item => item.feedId);
        },
        enabled: !!token
    });
const likedFeedIdSet = useMemo(() => 
    new Set(likedIds.map(id => Number(id))), 
    [likedIds]
);
    const feedsWithLikeStatus = useMemo(() => {
        console.log("🧩 useMemo: feeds =", feeds);
        console.log("🧩 useMemo: likedIds =", likedIds);
        if (!likedIds) return feeds;
        return feeds.map(feed => ({
            ...feed,
            // likedByUser: likedIds ? likedIds.includes(feed.feedId) : false
            likedByUser: likedFeedIdSet.has(Number(feed.feedId))
        }));
    }, [feeds, likedIds]);

    // 👉 좋아요 mutate
    const likeMutation = useMutation({
        mutationFn: (feedId) => myAxios(token, setToken).post(`/user/socialing/likes/${feedId}`, {}
            //     , {
            //     headers: { Authorization: token }
            // }
        ),
        onSuccess: () => {
            console.log("좋아요 토글 성공. invalidate 실행");
            queryClient.invalidateQueries({ queryKey: ['feeds', sortType, token] });
            queryClient.invalidateQueries({ queryKey: ['likes'] });
        }
    });

    // 👉 스크랩 mutate
    const scrapMutation = useMutation({
        mutationFn: async (feed) => {
            if (!feed.scrapped) {
                return myAxios(token, setToken).post(`/user/socialing/scrap?feedId=${feed.feedId}`, {}, {
                    // headers: { Authorization: token }
                });
            } else {
                return myAxios(token, setToken).delete(`/user/socialing/scrap/${feed.feedId}`, {
                    // headers: { Authorization: token }
                });
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feeds', sortType] })
    });

    const toggleLike = (feed) => {
        if (!token) return alert("로그인이 필요합니다.");
        likeMutation.mutate(feed.feedId);
    };

    const toggleScrap = (feed) => {
        if (!token) return alert("로그인이 필요합니다.");
        scrapMutation.mutate(feed);
    };

    const handleMenuAction = (action, feed) => {
        if (['신고하기', '스크랩하기', 'DM보내기'].includes(action) && !token) {
            alert("로그인이 필요합니다.");
            return;
        }
        switch (action) {
            case '신고하기':
                console.log(`신고: ${feed.feedId}`);
                break;
            case '스크랩하기':
                toggleScrap(feed);
                break;
            case 'DM보내기':
                console.log(`DM to ${feed.writerId}`);
                break;
            case '게시물로 이동':
                navigate(`/feed/${feed.feedId}`);
                break;
            case '링크복사':
                navigator.clipboard.writeText(`${window.location.origin}/feed/${feed.feedId}`);
                alert("링크 복사됨");
                break;
            case '공유하기':
                console.log("공유하기");
                break;
            default:
                break;
        }
        setMenuFeed(null);
    };

    return (
        <>
            <div className="feed-container">
                <div className="feed-left">
                    <div className="feed-sort-buttons">
                        {['전체', '좋아요순', '댓글순', '팔로워'].map((txt, idx) => {
                            const key = ['all', 'likes', 'comments', 'follow'][idx];
                            return (
                                <button key={key}
                                    className={sortType === key ? 'active' : ''}
                                    onClick={() => setSortType(key)}>
                                    {txt}
                                </button>
                            );
                        })}
                    </div>

                    <div className="feed-grid">
                        {feedsWithLikeStatus.map(feed => {
                            console.log("피드 likedByUser 상태:", feed.likedByUser);
                            console.log(`🟥 feedId: ${feed.feedId} likedByUser: ${feed.likedByUser}, includes: ${likedIds.includes(feed.feedId) || likedIds.includes(String(feed.feedId))}`);
                            return (
                                <div className="feed-card" key={feed.feedId}>
                                    <div className="feed-header">
                                        <img src={feed.writerProfile} alt="프로필" className="profile-img" />
                                        <span>{feed.writerId}</span>
                                        <span className="badge">{feed.writerBadge}</span>
                                        <button className="menu-btn" onClick={() => setMenuFeed(feed)}>...</button>
                                    </div>
                                    <img src={feed.img1} alt="피드" className="feed-img" />
                                    <div className="feed-actions">
                                        <span className="heart"
                                            onClick={() => toggleLike(feed)}>
                                            <img
                                                src={feed.likedByUser ? heartFilled : heartOutline}
                                                alt="좋아요"
                                                style={{ width: '20px', height: '20px' }}
                                            />
                                        </span>
                                        <span>{feed.likesCount}</span>
                                        <span onClick={() => navigate(`/feed/${feed.feedId}`)}>
                                            💬 {feed.commentsCount}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="feed-right">
                    <div className="popular-box">
                        <h3>인기 피드</h3>
                        <ul>
                            {popularFeeds.map((feed, idx) => (
                                <li key={feed.feedId}>
                                    <span>{popularPage * 3 + idx + 1}. </span>
                                    <img src={feed.img1} alt="썸네일" className="thumb-img" />
                                    <span>{feed.writerId}</span>
                                    <span>❤️ {feed.likesCount}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="popular-pagination">
                            <button onClick={() => setPopularPage(Math.max(popularPage - 1, 0))} disabled={popularPage === 0}>◀</button>
                            <button onClick={() => setPopularPage(popularPage + 1)}>▶</button>
                        </div>
                    </div>
                </div>

                {menuFeed && (
                    <div className="menu-modal" onClick={() => setMenuFeed(null)}>
                        <div className="menu-content" onClick={e => e.stopPropagation()}>
                            {['신고하기', '스크랩하기', 'DM보내기', '게시물로 이동', '링크복사', '공유하기']
                                .map(item => (
                                    <button key={item} onClick={() => handleMenuAction(item, menuFeed)}>{item}</button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
