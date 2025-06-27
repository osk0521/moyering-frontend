import React from 'react';
import styles from './ClassCard.module.css';
import { MdCalendarMonth } from "react-icons/md";
import { url } from '../config';

export default function GatheringCard({ gatherInfo, onClick  }) {
    //if (!gatherInfo) return null;
  return (
    <div className={styles.card} onClick={onClick}>
      <div
        className={styles.cardImage}
        style={{
              backgroundImage: `url(${url}/image?filename=${gatherInfo.thumbnailFileName})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
      >
        <span className={styles.likeIcon}>🤍</span>
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

