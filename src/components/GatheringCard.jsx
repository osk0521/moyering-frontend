import React from 'react';
import styles from './GatheringCard.module.css';
import { MdCalendarMonth } from "react-icons/md";

export default function GatheringCard({ gatherInfo, onClick  }) {
    if (!gatherInfo) return null;
  console.log(gatherInfo);
  return (
    <div className={styles.card} onClick={onClick}>
      <div
        className={styles.cardImage}
        style={{ backgroundImage: "url('/public/myclassList.png')" }}
      >
        <span className={styles.likeIcon}>🤍</span>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTags}>
          <span className={`${styles.tag} ${styles.yellow}`}>{gatherInfo.category1}</span>
          <span className={`${styles.tag} ${styles.blue}`}>{gatherInfo.addr}</span>
        </div>
        <h3 className={styles.cardTitle}>{gatherInfo.name}</h3>
        <p className={styles.cardInfo}><MdCalendarMonth/> {gatherInfo.startDate}</p>
      </div>
    </div>
  );
}

