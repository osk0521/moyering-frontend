import React from 'react';
import styles from './Main.module.css';
import ClassCard from '../../components/ClassCard';
import { recommendClassAtom } from '../../atom/classAtom';
import useRecommendClasses from '../../hooks/common/useRecommendClasses';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../atoms';

export default function Main() {
  const items = [
    { title: '내 주변 클래스링', desc: '주변에 있는 클래스 찾기', icon: '❤️' },
    { title: '오늘 당장 게더링', desc: '주변에 있는 당일모임 찾기', icon: '🕒' },
    { title: '카테고리', desc: '카테고리별 다양한 클래스', icon: '🗂️' },
    { title: '소셜링', desc: '사람들은 어떤 이야기를 나눌까?', icon: '💬' },
  ];
  const user = useAtomValue(userAtom);
  const classes = useAtomValue(recommendClassAtom);
  useRecommendClasses(user.username); // userId 없으면 null 넘기기

  return (
    <main className={styles.mainPage}>
      {/* 배너 */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerPlaceholder}>배너 이미지</div>
      </section>

      {/* 바로가기 버튼 */}
      <section className={styles.quickLinksSec}>
        <div className={styles.quickLinks}>
          {items.map((item, idx) => (
            <div className={styles.quickLinkBox} key={idx}>
              <div className={styles.quickLinkIcon}>{item.icon}</div>
              <div>
                <div className={styles.quickLinkTitle}>{item.title}</div>
                <div className={styles.quickLinkDesc}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 추천 클래스 */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>당신의 취향 저격!</h2>
        <p className={styles.sectionSub}>모여링이 추천해주는 맞춤 클래스</p>
        <div className={styles.cardList}>
        {classes.map((classInfo, idx) => (
                  <ClassCard key={idx} classInfo={classInfo} />
        ))}
        </div>
      </section>

      {/* 추천 모임 */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>추천 모임 👍</h2>
        <p className={styles.sectionSub}>모여링이 대표하는 알짜 모임들</p>
        <div className={styles.cardList}>
          {[...Array(4)].map((_, idx) => (
            <ClassCard key={idx} />
          ))}
        </div>
      </section>

      {/* 인기 소셜링 */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>신규 클래스</h2>
        <p className={styles.sectionSub}>따끈따끈한 원데이 클래스를 수강해보세요.</p>
        <div className={styles.cardList}>
          {[...Array(4)].map((_, idx) => (
            <ClassCard key={`social-${idx}`} />
          ))}
        </div>
      </section>
    </main>
  );
}
