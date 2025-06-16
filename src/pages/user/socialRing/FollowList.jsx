import React, { useState, useEffect } from 'react';
import './FollowList.css';
import searchIcon from './icons/search.png';
// import arrowRight from './icons/arrow-right.png';
// import arrowLeft from './icons/arrow-left.png';

const dummyFollowers = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
    nickname: ['멍멍이', '보노보노', '짱구', '이누야샤', '뽀로로'][i % 5],
}));

export default function FollowList() {
    const [followers, setFollowers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const PER_PAGE = 5;
    const totalPages = Math.ceil(dummyFollowers.length / PER_PAGE);

    useEffect(() => {
        setFollowers(dummyFollowers);
    }, []);

    const filtered = followers.filter(f =>
        f.nickname.includes(searchTerm)
    );

    const paged = filtered.slice(
        (page - 1) * PER_PAGE,
        page * PER_PAGE
    );

    return (
        <div className="KYM-followlist-container">
            <h2 className="KYM-followlist-header">팔로워 목록</h2>

            <div className="KYM-followlist-controls">
                <span className="KYM-followlist-count">
                    팔로워 수: {filtered.length}
                </span>
                <div className="KYM-followlist-search">
                    <input
                        type="text"
                        placeholder="팔로워 검색"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                    <img src={searchIcon} alt="검색" />
                </div>
            </div>

            <ul className="KYM-followlist-list">
                {paged.map(user => (
                    <li key={user.id} className="KYM-followlist-item">
                        <div className="KYM-followlist-user">
                            <img src={user.avatar} alt="" className="KYM-followlist-avatar" />
                            <span className="KYM-followlist-nickname">{user.nickname}</span>
                        </div>
                        <button
                            className="KYM-followlist-button"
                            onClick={() => window.location.href = `/feed/${user.nickname}`}
                        >
                            {/* 피드로 가기 <img src={arrowRight} alt=">" /> */}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="KYM-followlist-pager">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    {/* <img src={arrowLeft} alt="<" /> */}
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={page === i + 1 ? 'active' : ''}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    {/* <img src={arrowRight} alt=">" /> */}
                </button>
            </div>
        </div>
    );
}
