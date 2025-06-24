import React, { useState } from "react";
import styles from "./ClassRingReviewList.module.css";
import { FaStar } from "react-icons/fa";

const dummyReviews = [
  {
    id: 1,
    author: "루카스",
    date: "25.5.18",
    rating: 5,
    content:
      "과연 제 직업과 MBTI와의 궁합은 얼마나 궁금했었는데 이번기회를 알게되었구 앞으로 생각하던 직업과의 궁합을 어떨지도 알게되었습니다...",
    reply: {
      author: "강사명",
      date: "25.5.18",
      content:
        "MBTI에 대해 더 깊이 이해하시고 이를 통해 더 나에 대해 깊이 알게되신거 같아 뿌듯하네요👏 전직은 이미 존재합니다...",
    },
  },
  {
    id: 2,
    author: "유용",
    date: "25.5.20",
    rating: 5,
    content: "인터뷰처럼 면접과 회차가 확실하니깐, 딱 확실해요!",
  },
];

export default function ClassRingReviewList() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>강사 평점 및 후기</h2>

      <div className={styles.summaryBox}>
        <div>
          <strong>강사명</strong>
          <div className={styles.starsRow}><FaStar color="#FFD700" /><span>5</span></div>
        </div>
        <div>
          <span>진행한 클래스</span>
          <div>138건</div>
        </div>
      </div>

      <div className={styles.reviewList}>
        {dummyReviews.map((r) => (
          <div key={r.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <strong>{r.author}</strong>
              <span className={styles.rating}>
                {[...Array(r.rating)].map((_, i) => (
                  <FaStar key={i} color="#FFD700" />
                ))}
              </span>
              <span className={styles.date}>{r.date}</span>
            </div>
            <div className={styles.reviewContent}>{r.content}</div>
            {r.reply && (
              <div className={styles.reviewReply}>
                <div className={styles.replyHeader}>
                  <strong>{r.reply.author}</strong>
                  <span>{r.reply.date}</span>
                </div>
                <div>{r.reply.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn}>1</button>
        <button className={styles.pageBtn}>2</button>
        <button className={styles.pageBtn}>3</button>
      </div>
    </div>
  );
} 
