import React from "react";
import styles from "./Main.module.css";
import ClassCard from "../../components/ClassCard";
import { recommendClassAtom,hotClassAtom ,recommendGatheringAtom,mainBannerList } from "../../atom/classAtom";
import useRecommendClasses from "../../hooks/common/useRecommendClasses";
import { useAtomValue } from "jotai";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';
import GatheringCard from "../../components/GatheringCard";
import { url } from "../../config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function Main() {
//슬라이더 
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

  const navigate = useNavigate();

const items = [
  { title: "내 주변 클래스링", desc: "주변에 있는 클래스 찾기", icon: "❤️", link: "/classList" },
  { title: "오늘 당장 게더링", desc: "주변에 있는 당일모임 찾기", icon: "🕒", link: "/classList" },
  { title: "강사 홍보 게시판", desc: "원하는 강사를 찾아보세요.", icon: "🗂️", link: "/" },
  { title: "소셜링", desc: "사람들은 어떤 이야기를 나눌까?", icon: "💬", link: "/feed" },
];
  useRecommendClasses(); // userId 없으면 null 넘기기
  const classes = useAtomValue(recommendClassAtom);
  const hotClasses = useAtomValue(hotClassAtom);
  //const gathers = useAtomValue(recommendGatheringAtom);
  const gathers = [];
  const mainBanners = useAtomValue(mainBannerList);

  console.log(mainBanners);
  console.log(gathers);
  return (
    <>
      <Header />
              {/* 배너 */}
        <section className={styles.bannerSection}>
          <Slider {...settings}>
            {mainBanners.length === 0 ? (
              <p>데이터가 없습니다.</p>
            ) : (
            mainBanners.map((banner) => (
              <div key={banner.bannerId}>
                <img
                  src={`${url}/image?filename=${banner.bannerImg}`}
                  alt={banner.title}
                  className={styles.bannerImage}
                />
              </div>
            )))}
          </Slider>
        </section>
      <main className={styles.mainPage}>


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
          {classes.length === 0 ? <>
          <h2 className={styles.sectionTitle}>당신의 취향 저격!</h2>
          <p className={styles.sectionSub}>수강일이 얼마 남지 않았아요</p></>
          : <>
          <h2 className={styles.sectionTitle}>당신의 취향 저격!</h2>
          <p className={styles.sectionSub}>모여링이 추천해주는 맞춤 클래스</p></>}
          <div className={styles.cardList}>
            {classes.length === 0 ? (
              <p>클래스가 없습니다.</p>
            ) : (
              classes.map((classInfo, idx) => (
              <ClassCard
                key={idx}
                classInfo={classInfo}
                onClick={() => navigate(`/classRingDetail/${classInfo.classId}`)}
              />
            )))}
          </div>
        </section>

        {/* 추천 모임 */}
        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>추천 모임 👍</h2>
          <p className={styles.sectionSub}>모여링이 대표하는 알짜 모임들</p>
          <div className={styles.cardList}>
            {gathers.length === 0 ? (
              <p>데이터가 없습니다.</p>
            ) : (
              gathers.map((gatherInfo, idx) => (
              <GatheringCard
                key={idx}
                classInfo={gatherInfo}
                onClick={() => navigate(`/gatheringDetail/${gatherInfo.gatheringId}`)}
              />
            )))}
          </div>
        </section>

        {/* 인기 소셜링 */}
        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>인기 클래스링</h2>
          <p className={styles.sectionSub}>
            따끈따끈한 원데이 클래스를 수강해보세요.
          </p>
          <div className={styles.cardList}>
            {hotClasses.length === 0 ? (
              <p>클래스가 없습니다.</p>
            ) : (
              hotClasses.map((classInfo, idx) => (
              <ClassCard
                key={idx}
                classInfo={classInfo}
                onClick={() => navigate(`/classRingDetail/${classInfo.classId}`)}
              />
            )))}
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
