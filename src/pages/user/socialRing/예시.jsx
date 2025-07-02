import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FollowList.css';
import searchIcon from './icons/search.png';
import axios from 'axios';
import { myAxios } from '../../../config';
import { tokenAtom, userAtom } from '../../../atoms';
import { useAtom, useAtomValue } from 'jotai';
import Header from '../../common/Header';
import Sidebar from '../0myPage/common/Sidebar';
import { data } from 'react-router';

export default function FollowList() {
    const [followers, setFollowers] = useState([]);      // 누적된 팔로워 리스트
    const [searchTerm, setSearchTerm] = useState('');
    const [token, setToken] = useAtom(tokenAtom);   // 검색어
    const [page, setPage] = useState(0);                 // 0부터 시작하는 페이지 인덱스
    const [hasMore, setHasMore] = useState(true);        // 더 불러올 데이터가 있는지
    const [loading, setLoading] = useState(false);       // 로딩 중 플래그
    const observer = useRef();                           // IntersectionObserver 인스턴스
    // const [data,setData] = useState('');
    // const token = useAtomValue(tokenAtom);

    // const { access_token: token } = useAtomValue(tokenAtom);
    const PER_PAGE = 5;
    useEffect(() => {
        token && myAxios(token, setToken).get('/user/socialing/follow/followers')
        .then(res=>{
            console.log("잘됌");
            console.log(res);
            setFollowers(res.data)
        })
        .catch(err=>{
            console.log("에러")
            console.log(err);
        })
    }, [token])
    // 1) 팔로워 API 호출 함수
    // const loadFollowers = async () => {
    //     if (loading || !hasMore) return;
    //     setLoading(true);
    //     try {
    //         const res = token && await myAxios(token, setToken).get('/user/socialing/follow/followers'
    //         //     , {
    //         //     params: {
    //         //         page,
    //         //         size: PER_PAGE,
    //         //         search: searchTerm.trim(),
    //         //     }
    //         // }
    //     );
    //     setFollowers(res.data); // { content: [...], totalPages, totalElements, ... } 구조 가정
    //     console.log(res)
    //         // setFollowers(prev => [...prev, ...data.content]);
    //         // setHasMore(data.content.length === PER_PAGE);
    //     } catch (e) {
    //         console.error(e);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // 2) 검색어가 바뀌면 리스트 초기화
    useEffect(() => {
        // setFollowers([]);
        setPage(0);
        setHasMore(true);
    }, [token]);

    // // 3) 페이지가 바뀔 때마다 load 호출
    // useEffect(() => {
    //     loadFollowers();
    // }, [token]);

    // 4) 마지막 아이템에 ref 달아서 감시
    const lastFollowerRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <>
            <Header />
            <Sidebar />
            <div className="KYM-followlist-container">
                <h2 className="KYM-followlist-header">팔로워 목록</h2>

                <div className="KYM-followlist-controls">
                    <span className="KYM-followlist-count">
                        팔로워 수: {followers.length}
                    </span>
                    <div className="KYM-followlist-search">
                        <input
                            type="text"
                            placeholder="팔로워 검색"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <img src={searchIcon} alt="검색" />
                    </div>
                </div>
                {!loading && followers.length === 0 && (
                    <div className="KYM-no-followers">팔로워가 없습니다.</div>
                )}

                <ul className="KYM-followlist-list">
                    {followers.map((user, idx) => {
                        const isLast = idx === followers.length - 1;
                        return (
                            <li
                                key={user.id}
                                ref={isLast ? lastFollowerRef : null}  // 마지막 아이템에만 ref 연결
                                className="KYM-followlist-item"
                            >
                                <div className="KYM-followlist-user">
                                    <img src={user.profile} alt="" className="KYM-followlist-avatar" />
                                    <span className="KYM-followlist-nickname">{user.nickName}</span>
                                </div>
                                <button
                                    className="KYM-followlist-button"
                                    onClick={() => window.location.href = `/userfeed/${user.nickName}`}
                                >
                                    피드로 가기 &gt;
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {loading && <div className="loading">로딩 중...</div>}
                {!hasMore && <div className="end">마지막 페이지입니다.</div>}
            </div>
        </>
    );
}
