import React from "react";
import styles from "./Main.module.css";
import ClassCard from "../../components/ClassCard";
import { recommendClassAtom,hotClassAtom  } from "../../atom/classAtom";
import useRecommendClasses from "../../hooks/common/useRecommendClasses";
import { useAtomValue } from "jotai";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

export default function Main() {
const navigate = useNavigate();

const items = [
  { title: "내 주변 클래스링", desc: "주변에 있는 클래스 찾기", icon: "❤️", link: "/classList" },
  { title: "오늘 당장 게더링", desc: "주변에 있는 당일모임 찾기", icon: "🕒", link: "/classList" },
  { title: "강사 홍보 게시판", desc: "원하는 강사를 찾아보세요.", icon: "🗂️", link: "/" },
  { title: "소셜링", desc: "사람들은 어떤 이야기를 나눌까?", icon: "💬", link: "/feed" },
];
  useRecommendClasses(1); // userId 없으면 null 넘기기

  const classes = useAtomValue(recommendClassAtom);
  const hotClasses = useAtomValue(hotClassAtom);

  return (
    <>
      <Header />
      <main className={styles.mainPage}>
        {/* 배너 */}
        <section className={styles.bannerSection}>
          <div className={styles.bannerPlaceholder}>배너 이미지</div>
        </section>

        {/* 바로가기 버튼 */}
        <section className={styles.quickLinksSec}>
          <div className={styles.quickLinks}>
            {items.map((item, idx) => (
            <div
              className={styles.quickLinkBox}
              key={idx}
              onClick={() => navigate(item.link)}
            >                
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
              <ClassCard key={idx} classInfo={classInfo} 
              onClick={() => navigate(`/classRingDetail/${classInfo.id}`)}
              />
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
          <h2 className={styles.sectionTitle}>인기 클래스링</h2>
          <p className={styles.sectionSub}>
            따끈따끈한 원데이 클래스를 수강해보세요.
          </p>
          <div className={styles.cardList}>
            {hotClasses.map((classInfo, idx) => (
              <ClassCard key={idx} classInfo={classInfo} 
              onClick={() => navigate(`/classRingDetail/${classInfo.id}`)}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
