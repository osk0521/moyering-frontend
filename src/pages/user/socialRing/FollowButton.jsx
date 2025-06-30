// src/components/FollowButton.jsx
import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { myAxios } from '../../../config';


export default function FollowButton({ targetUserId, className, style }) {
    const currentUser = useAtomValue(userAtom);

    console.log('▶ FollowButton targetUserId:', targetUserId);
    const token = useAtomValue(tokenAtom);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const jwt = token?.access_token;

    // **로그인된 사용자(=토큰)가 아니면 컴포넌트 자체를 안 보이게**
    if (!jwt) {
        return null;
    }
    useEffect(() => {
        if (!targetUserId) return;
        setLoading(true);
        myAxios(token).get(`/user/socialing/follow/status/${targetUserId}`)
            .then(res => setIsFollowing(res.data))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [targetUserId, token]);

    const toggleFollow = () => {
        if (loading) return;
        setLoading(true);
        const req = isFollowing
            ? myAxios(token).delete(`/user/socialing/follow/${targetUserId}`)
            : myAxios(token).post(`/user/socialing/follow/${targetUserId}`);
        req
            .then(() => setIsFollowing(x => !x))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    };

    if (error) return <button disabled className={className} style={style}>오류</button>;
    if (loading) return <button disabled className={className} style={style}>로딩…</button>;
    if (targetUserId === currentUser.id) {
        return (
            <button disabled className={className} style={{ opacity: 0.5, ...style }}>
                내 프로필
            </button>
        );
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
