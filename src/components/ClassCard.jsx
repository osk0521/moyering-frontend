import React from 'react';
import styles from './ClassCard.module.css';
import { MdCalendarMonth } from "react-icons/md";
import { url } from '../config';
import { useAtomValue } from "jotai";
import { classLikesAtom } from "../atom/classAtom";
import { FaRegHeart } from "react-icons/fa";
import { GoHeart,GoHeartFill  } from "react-icons/go";

export default function ClassCard({ classInfo, onClick  }) {
    const classLikes = useAtomValue(classLikesAtom);

    if (!classInfo) return null;
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
        {classLikes.some(like => like.classId === classInfo.classId) ? (
          <GoHeartFill  className={styles.likeIcon1} />
        ) : (
          <GoHeart  className={styles.likeIcon2} />
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

