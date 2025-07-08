import React, { useState, useEffect } from 'react';
import styles from './ClassCard.module.css';
import { MdCalendarMonth } from "react-icons/md";
import { url,myAxios  } from '../config';
import { useAtomValue ,useAtom,useSetAtom } from "jotai";
import { classLikesAtom } from "../atom/classAtom";
import { GoHeart,GoHeartFill  } from "react-icons/go";
import { tokenAtom } from "../atoms";


export default function ClassCard({ classInfo, onClick  }) {
  if (!classInfo) return null;
  const classLikes = useAtomValue(classLikesAtom);
  const [token,setToken] = useAtom(tokenAtom);
  const classId = classInfo.classId;

  //찜하기
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    
    const liked = classLikes.some((like) => like.classId ===  Number(classId));
    setIsLiked(liked);
  }, [classLikes, classId]);

  const handleHeart = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 막기

    try {
      await myAxios(token, setToken).post("/user/toggle-like", { classId });

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
              backgroundImage: `url(${url}/image?filename=${classInfo.imgName1})`,
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
          <span className={`${styles.tag} ${styles.yellow}`}>{classInfo.category1}&gt;{classInfo.category2}</span>
          <span className={`${styles.tag} ${styles.blue}`}>{classInfo.addr}</span>
        </div>
        <h3 className={styles.cardTitle}>{classInfo.name}</h3>
        <div className={styles.cardEtc}>
          <p className={styles.cardInfo}><MdCalendarMonth/> {classInfo.startDate}</p>
          <p className={styles.cardPrice}>{classInfo.price.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
}

