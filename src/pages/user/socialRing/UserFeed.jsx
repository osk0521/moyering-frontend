import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, data } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { myAxios, url } from '../../../config';
import axios from 'axios';

import './UserFeed.css';
import Header from '../../common/Header';
import moreIcon from './icons/more.png';
import heartOutline from './icons/heart-outline.png';
import heartFilled from './icons/heart-filled.png';
import commentIcon from './icons/comment.svg';
import FollowButton from './FollowButton';

export default function UserFeed() {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentImage, setCurrentImage] = useState({});
  const [follow, setFollow] = useState('');
  const [follower, setFollower] = useState('');
  const [feedCount, setFeedCount] = useState('');
  const [followCount, setFollowCount] = useState('');
  const [followingCount, setFollowingCount] = useState('');

  // 1) 프로필 정보 조회
  useEffect(() => {
    if (!nickname) return;
    (async () => {
      try {
        const api = token
          ? myAxios(token, setToken)
          : axios.create({ baseURL: url });

        const { data: u } = await api.get(`/socialing/feedUser/${nickname}`);

        setUser({
          userId: u.userId,
          profile: u.profile,
          nickname: u.nickName || u.username,
          badgeUrl: `${url}/iupload/${u.userBadgeId}.png`,
          intro: u.intro || '',
          badgeImg: u.writerBadgeImg,
          stats: {
            posts: u.postsCount ?? 0,
            followers: u.followersCount ?? 0,
            following: u.followingCount ?? 0,
          },
        });
        console.log('🐯 유저 데이터 u =', u);
        console.log("🔥 badgeId=", u.userBadgeId)
        console.log("🔥 badgeId=", u.writerBadgeImg)
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/not-found', { replace: true });
        } else {
          console.error('유저 정보 조회 실패:', err);
        }
      }
    })();
  }, [nickname, token, navigate]);

  // 2) 피드 리스트 조회
  useEffect(() => {
    if (!nickname) return;
    (async () => {
      try {
        const { data: feeds } = await myAxios(token, setToken)
          .get(`/socialing/memberFeed/${nickname}`);
        setPosts(
          feeds.map(feed => ({
            id: feed.feedId,
            images: [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean),
            content: feed.content,
            liked: feed.likedByUser,
            likeCount: feed.likesCount,
            commentCount: feed.commentsCount,
            mine: feed.mine,
            createdAt: feed.createdAt,
            badgeImg: feed.writerBadgeImg
          }))
        );
        setPosts(prev => {
          console.log("🚀 새 posts =", prev);
          return prev;
        });

        // 이미지 초기화
        const initIndices = {};
        feeds.forEach(feed => {
          initIndices[feed.feedId] = 0;
        });
        setCurrentImage(initIndices);

      } catch (err) {
        console.error('피드 리스트 조회 실패:', err);
      }
    })();
  }, [nickname, token]);

  // 3) 좋아요 토글
  const toggleLike = async (post) => {
    try {
      await myAxios(token, setToken).post(`/user/socialing/likes/${post.id}`);
      // 다시 불러오기
      const { data: feeds } = await myAxios(token, setToken)
        .get(`/socialing/memberFeed/${nickname}`);
      setPosts(
        feeds.map(feed => ({
          id: feed.feedId,
          images: [feed.img1, feed.img2, feed.img3, feed.img4, feed.img5].filter(Boolean),
          content: feed.content,
          liked: feed.likedByUser,
          likeCount: feed.likesCount,
          commentCount: feed.commentsCount,
          mine: feed.mine,
          createdAt: feed.createdAt,
        }))
      );
    } catch (e) {
      console.error("좋아요 실패:", e);
    }
  };


  // 4) 이미지 슬라이더
  const prevImage = (feedId, count) => {
    setCurrentImage(prev => ({
      ...prev,
      [feedId]: (prev[feedId] - 1 + count) % count
    }));
  };

  const nextImage = (feedId, count) => {
    setCurrentImage(prev => ({
      ...prev,
      [feedId]: (prev[feedId] + 1) % count
    }));
  };

  useEffect(() => {
    if (user) {
      token && myAxios(token, setToken)
        .get(`/socialing/subCount`, {
          params: {
            userId: user.userId,
          }
        }
        )
        .then((res) => {
          console.log("결과")
          console.log(res);
          setFeedCount(res.data.feedCount);
          setFollowCount(res.data.followCount);
          setFollowingCount(res.data.followingCount);
        })
        .catch((err) => {
          console.log(user.userId);
          console.log(err);
        });
    }
  }, [token, user]);  // user.userId가 변경될 때마다 실행

  if (!user) return <div className="KYM-loading">로딩 중…</div>;
  return (
    <>
      <Header />

      <div className="KYM-profile-container">
        <div className="KYM-profile-header">
          <img
            className="KYM-avatar"
            src={`${url}/iupload/${user.profile}`}
            alt="프로필"
          />
          <div className="KYM-profile-info">
            <div className="KYM-name-line">
              <h2 className="KYM-nickname">{user.nickname}</h2>
              {posts.length > 0 && posts[0].badgeImg && (
                <img
                  className="KYM-badge"
                  src={`/${posts[0].badgeImg}`}
                  alt="배지"
                />
              )}
              <img src={moreIcon} alt="더보기" className="KYM-more-icon" />
            </div>
            <p className="KYM-intro">
              {user.intro.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="KYM-action-buttons">
              <FollowButton
                targetUserId={user.userId}
                className="KYM-follow-btn"
                style={{ marginLeft: '8px' }}
              />
              <button className="KYM-btn KYM-message">메시지</button>
            </div>
            <ul className="KYM-stat-list">
              <li><strong>{feedCount}</strong><span>게시물</span></li>
              <li><strong>{followCount}</strong><span>팔로워</span></li>
              <li><strong>{followingCount}</strong><span>팔로잉</span></li>
            </ul>
          </div>
        </div>

        <hr className="KYM-divider" />

        <div className="KYM-posts-grid">
          {posts.map(post => {
            const images = post.images;
            const currentIdx = currentImage[post.id] || 0;

            return (
              <div key={post.id} className="KYM-post-card">
                <div
                  className="KYM-image-slider"
                  onClick={() => navigate(`/feed/${post.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="KYM-post-img"
                    src={`${url}/iupload/${images[currentIdx]}`}
                    alt="게시물"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        className="KYM-image-nav left"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage(post.id, images.length);
                        }}
                      >‹</button>
                      <button
                        className="KYM-image-nav right"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage(post.id, images.length);
                        }}
                      >›</button>
                      <div className="KYM-image-dots" 
>
                        {images.map((_, i) => (
                          <span
                            key={i}
                            className={i === currentIdx ? 'KYM-dot active' : 'KYM-dot'}
                            
                            onClick={(e) => e.stopPropagation()}
                          >●</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <p className="KYM-post-content">{post.content}</p>
                <div className="KYM-post-footer">
                  <div className="KYM-stats">
                    <button
                      className={`KYM-like-button${post.liked ? ' KYM-active' : ''}`}
                      onClick={() => toggleLike(post)}
                    >
                      <img
                        src={post.liked ? heartFilled : heartOutline}
                        alt="좋아요"
                        className="KYM-icon"
                      />
                      <span>{post.likeCount}</span>
                    </button>
                    <span className="KYM-comment-count">
                      <img src={commentIcon} alt="댓글" className="KYM-icon" />
                      {post.commentCount}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}
