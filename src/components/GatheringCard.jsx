import React, { useState, useEffect } from 'react';
import styles from './ClassCard.module.css';
import { MdCalendarMonth } from "react-icons/md";
import { url,myAxios  } from '../config';
import { useAtomValue ,useAtom,useSetAtom } from "jotai";
import { gatheringLikesAtom } from "../atom/classAtom";
import { GoHeart,GoHeartFill  } from "react-icons/go";
import { tokenAtom } from "../atoms";

export default function GatheringCard({ gatherInfo, onClick  }) {
  if (!gatherInfo) return null;
  const gatherLikes = useAtomValue(gatheringLikesAtom);
  const [token,setToken] = useAtom(tokenAtom);
  const gatheringId = gatherInfo.gatheringId;
console.log('bg-url:', `${url}/image?filename=${gatherInfo.thumbnailFileName}`);

  //찜하기
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    
    const liked = gatherLikes.some((like) => like.gatheringId ===  Number(gatheringId));
    setIsLiked(liked);
  }, [gatherLikes, gatheringId]);

  const handleHeart = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 막기

    try {
      await myAxios(token, setToken).post("/user/gather-toggle-like", { gatheringId });

      // 찜 상태 토글
      setIsLiked(prev => !prev);

    } catch (err) {
      console.error("좋아요 실패", err);
      alert(err.response?.data?.message || "찜하기 처리 중 오류 발생");
    }
  };
  return (
    <div className={styles.card} onClick={onClick}>
      <div
        className={styles.cardImage}
        style={{
              backgroundImage: `url(${url}/image?filename=${encodeURIComponent(gatherInfo.thumbnailFileName)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
      >
        {isLiked ? (
          <GoHeartFill
            className={styles.likeIcon1}
            onClick={handleHeart}
          />
        ) : (
          <GoHeart
            className={styles.likeIcon2}
            onClick={handleHeart}
          />
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTags}>
          <span className={`${styles.tag} ${styles.yellow}`}>{gatherInfo.categoryName}&gt;{gatherInfo.subCategoryName}</span>
          <span className={`${styles.tag} ${styles.blue}`}>{gatherInfo.locName}</span>
        </div>
        <h3 className={styles.cardTitle}>{gatherInfo.title}</h3>
        <p className={styles.cardInfo}><MdCalendarMonth/> {gatherInfo.meetingDate}</p>
      </div>
    </div>
  );
}

