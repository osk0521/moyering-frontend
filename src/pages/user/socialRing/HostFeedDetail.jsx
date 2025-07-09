import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { myAxios, url } from '../../../config';
import Header from '../../common/Header';
import './HostFeedDetail.css'; // 기존 CSS 사용
import moreIcon from './icons/more.png';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { useQuery, useQueryClient } from '@tanstack/react-query';


export default function HostFeedDetail() {
  const { feedId } = useParams();
  const [feed, setFeed] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
    const [menuOpenId, setMenuOpenId] = useState(null);
        const menuRef = useRef(null);
const user = useAtomValue(userAtom)
const navigate = useNavigate();
const [token, setToken] = useAtom(tokenAtom);
const queryClient = useQueryClient();

  useEffect(() => {
    myAxios().get(`/feedHost/${feedId}`)
      .then(res => {
        console.log("▶ HostFeedDetail:", res.data);
        setFeed(res.data);
      })
      .catch(err => {
        console.error("피드 상세 조회 실패:", err);
        alert("피드를 불러오지 못했습니다.");
      });
  }, [feedId]);

  if (!feed) return <div className="KYM-detail-container">로딩 중...</div>;

  const {
    content,
    img1, img2, img3, img4, img5,
    tag1, tag2, tag3, tag4, tag5,
    category,
    hostId, hostName, hostProfile
  } = feed;

  const images = [img1, img2, img3, img4, img5].filter(Boolean);
  const tags = [tag1, tag2, tag3, tag4, tag5].filter(Boolean);

  return (
    <>
      <Header />
      <div className="KYM-detail-container">
        <div className="KYM-detail-main">
          <div className="KYM-detail-image">
            {images.length > 0 && (
              <>
                <img
                  src={`${url}/iupload/${images[currentImage]}`}
                  alt={`feed-${currentImage}`}
                />
                {images.length > 1 && (
                  <>
                    <button
                      className="KYM-image-nav left"
                      onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
                    >‹</button>
                    <button
                      className="KYM-image-nav right"
                      onClick={() => setCurrentImage((currentImage + 1) % images.length)}
                    >›</button>
                    <div className="KYM-image-dots">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={i === currentImage ? 'dot active' : 'dot'}
                          onClick={() => setCurrentImage(i)}
                        >●</span>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="KYM-detail-side">
            <div className="KYM-detail-header">
              <div className="KYM-left-info">
                <img className="KYM-detail-avatar" src={`${url}/iupload/${hostProfile}`} alt="" />
                <span className="KYM-detail-nickname">{hostName}</span>
              </div>
              <img
                src={moreIcon}
                alt="더보기"
                className="KYM-detail-more-icon"
                onClick={() => {
                  console.log("Clicked moreIcon for feedId:", feed.feedId);
                  setMenuOpenId(menuOpenId === feed.feedId ? null : feed.feedId);
                }}
              />
              {console.log('menuOpenId:', menuOpenId, 'feed.feedId:', feed.feedId)}
              {menuOpenId === feed.feedId && (
                <ul ref={menuRef} className="KYM-detail-menu open">
                  {console.log('user?.id:', feed.hostId, 'feed.writerUserId:', feed.hostId)}
                  {user?.hostId === feed.hostId && (
                    <>
                      <li onClick={() => {
                        navigate(`/host/feedEdit/${feed.feedId}`);
                        setMenuOpenId(null);
                      }}>수정하기</li>
                      <li onClick={async () => {
                        if (!window.confirm("정말 삭제하시겠습니까?")) return;
                        try {
                          token && await myAxios(token, setToken).delete(`/host/feedDelete/${feed.feedId}`);
                          alert("삭제 완료!");
                          // queryClient.invalidateQueries(['hostFeeds']);
                          navigate("/hostFeeds");
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

            <div className="KYM-detail-content">{content}</div>
            <div className="KYM-hashtags">
              {tags.map((t, i) => <span key={i} className="KYM-hashtag">#{t}</span>)}
            </div>
            <div className="KYM-detail-comments">
              <p>카테고리: {category}</p>
            </div>


            <div className="KYM-like-info">
              <span className="KYM-detail-date">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
