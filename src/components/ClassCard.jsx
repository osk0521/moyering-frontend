import React from 'react';
import styles from './ClassCard.module.css';

export default function ClassCard({ classInfo }) {
  return (
    <div className={styles.card}>
      <div
        className={styles.cardImage}
        style={{ backgroundImage: "url('/public/myclassList.png')" }}
      >
        <span className={styles.badge}>추천</span>
        <span className={styles.likeIcon}>🤍</span>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTags}>
          <span className={`${styles.tag} ${styles.yellow}`}>카테고리</span>
          <span className={`${styles.tag} ${styles.blue}`}>클래스 장소</span>
        </div>
        <h3 className={styles.cardTitle}>클래스 이름</h3>
        <p className={styles.cardInfo}>🗓 25.6.1(일) 오후 2:00</p>
      </div>
    </div>
  );
}
