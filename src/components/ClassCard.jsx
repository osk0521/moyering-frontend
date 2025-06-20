import React from 'react';
import styles from './ClassCard.module.css';
import { MdCalendarMonth } from "react-icons/md";
import { url } from '../config';

export default function ClassCard({ classInfo, onClick  }) {
    if (!classInfo) return null;
  console.log(classInfo);
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
        <span className={styles.badge}>추천</span>
        <span className={styles.likeIcon}>🤍</span>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTags}>
          <span className={`${styles.tag} ${styles.yellow}`}>{classInfo.category1}-{classInfo.category2}</span>
          <span className={`${styles.tag} ${styles.blue}`}>{classInfo.addr}</span>
        </div>
        <h3 className={styles.cardTitle}>{classInfo.name}</h3>
        <div className={styles.cardEtc}>
          <p className={styles.cardInfo}><MdCalendarMonth/> {classInfo.startDate}</p>
          <p className={styles.cardPrice}>{classInfo.price}원</p>
        </div>
      </div>
    </div>
  );
}

