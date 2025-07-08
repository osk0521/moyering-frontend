// src/components/FollowButton.jsx
import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { myAxios } from '../../../config';


export default function FollowButton({ targetUserId, className, style }) {
    const currentUser = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // console.log('▶ FollowButton targetUserId:', targetUserId);

    useEffect(() => {
        if (!token || !targetUserId) return;
        setLoading(true);
        myAxios(token, setToken).get(`/user/socialing/follow/status/${targetUserId}`)
            .then(res => setIsFollowing(res.data))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [targetUserId, token]);

    const toggleFollow = () => {
        if (loading) return;
        setLoading(true);
        const req = isFollowing
            ? myAxios(token, setToken).delete(`/user/socialing/follow/${targetUserId}`)
            : myAxios(token, setToken).post(`/user/socialing/follow/${targetUserId}`);
        req
            .then(() => setIsFollowing(x => !x))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    };

    // 여기서부터 조건부 렌더링
    if (!token) return null;
    if (error) return <button disabled className={className} style={style}>오류</button>;
    if (loading) return <button disabled className={className} style={style}>로딩…</button>;
    if (targetUserId === currentUser.id) {
        return null;
        // (
        //     <button disabled className={className} style={{ opacity: 0.5, ...style }}>
        //         내 프로필
        //     </button>
        // );
    }

    return (
        <button
            onClick={toggleFollow}
            disabled={!token}
            className={className}
            style={style}
        >
            {isFollowing ? '언팔로우' : '팔로우'}
        </button>
    );
}
