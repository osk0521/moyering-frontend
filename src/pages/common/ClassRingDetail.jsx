// ClassRingDetail.jsx (전체 섹션 포함, module.css 적용)
import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { BiChevronRight, BiChevronDown } from "react-icons/bi";
import styles from "./ClassRingDetail.module.css";
import Header from "./Header";

export default function ClassRingDetail() {
  const [activeTab, setActiveTab] = useState("details");
  const [isExpanded, setIsExpanded] = useState(false);

  const PREVIEW_LENGTH = 500;
  const description = `보드게임은 단순한 놀이를 넘어서 사람들 간의 소통과 교감을 이끌어내는 훌륭한 매개체입니다.\n\n초보자를 위한 배려도 빼놓지 않았습니다.`;

  const previewText =
    description.length > PREVIEW_LENGTH
      ? description.slice(0, PREVIEW_LENGTH) + "..."
      : description;

  const shouldShowMore = description.length > PREVIEW_LENGTH;

  const questions = [
    { id: 1, status: "답변대기", title: "존비롤 필수인가요?", author: "id18****", date: "2025-03-29", hasAnswer: false },
    { id: 2, status: "답변완료", title: "저의 질문이습니다.", author: "id335****", date: "2025-03-29", hasAnswer: false },
    {
      id: 3,
      status: "답변완료",
      title: "수업에 상착 늘을 것같은데 초반을 툴지면 따라가기 힘들까요?",
      author: "id877****",
      date: "2025-02-21",
      hasAnswer: true,
      answer: {
        content:
          "안녕하세요. 고객님 저희 1대1로 수강생분들의 속도에 맞춰서 수업을 진행합니다.\n\n또한, 사전 강의자료를 업로드해드리오니 크게 문제는 없을 것으로 예상됩니다.\n\n다만, 많이 늦을실 경우에 한정된 시간 내에 완성이 어려우실 수 있습니다.",
        author: "모임장",
        date: "2025-02-21"
      }
    }
  ];

  const handleExpandClick = () => setIsExpanded(true);

  const handleTabClick = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 140, behavior: "smooth" });
    setActiveTab(id);
  };

  useEffect(() => {
    const sections = ["details", "host", "questions", "members", "recommendations"];
    const onScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY + 200 >= el.offsetTop) {
          setActiveTab(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <Header/>
    <div className={styles.detailWrapper}>
      <main className={styles.mainContent}>
        <section className={styles.imageSection}>
          <img src="/public/myclassList.png" alt="모임 이미지" className={styles.mainImage} />
        </section>

        <nav className={styles.tabs}>
          {["details", "host", "questions", "members", "recommendations"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className={styles.section} id="details">
          <h2>상세 소개</h2>
          <p>{isExpanded ? description : previewText}</p>
          {shouldShowMore && !isExpanded && (
            <button onClick={handleExpandClick} className={styles.moreBtn}>더보기 <BiChevronDown /></button>
          )}
        </section>

        <section className={styles.section} id="questions">
          <h2>질문</h2>
          <div className={styles.questionsTable}>
            <div className={styles.questionsHeader}>
              <div>답변상태</div>
              <div>제목</div>
              <div>작성자</div>
              <div>작성일</div>
            </div>

            {questions.map((q, i) => (
              <div key={q.id} className={`${styles.questionsRow} ${i % 2 === 1 ? styles.alternate : ""}`}>
                <div className={styles.questionsGrid}>
                  <div>{q.status}</div>
                  <div>{q.title}</div>
                  <div>{q.author}</div>
                  <div>{q.date}</div>
                </div>
                {q.hasAnswer && q.answer && (
                  <div className={styles.answerSection}>
                    <div className={styles.answerHeader}>
                      <span className={styles.answerBadge}>답변</span>
                      <span className={styles.answerAuthor}>{q.answer.author}</span>
                      <span className={styles.answerDate}>{q.answer.date}</span>
                    </div>
                    <div className={styles.answerContent}>{q.answer.content}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className={styles.sidebar}>
        <div className={styles.cardBox}>
          <div className={styles.badges}>
            <span className={styles.badgeCategory}>스포츠 &gt; 실내</span>
            <span className={styles.badgeLocation}>서울/성동구</span>
          </div>
          <h1 className={styles.title}>클래스명</h1>

          <div className={styles.row}><span className={styles.infoIcon}><CiCalendar /></span>
            <select className={styles.couponList}>
              <option value="">2023년 11월 25일 (토)</option>
              <option value="쿠폰1">2023년 11월 25일 (토)</option>
              <option value="쿠폰2">2023년 11월 25일 (토)</option>
            </select>
          </div>
          <div className={styles.row}><span className={styles.infoIcon}><CiClock1 /></span><span>오전 9:00 - 오후 3:00</span></div>
          <div className={styles.row}><span className={styles.infoIcon}><GoPeople /></span><span>8/15 명 참가</span></div>
          <div className={styles.row}><span className={styles.infoIcon}><CiLocationOn /></span><span>서울대입구역</span></div>
          <div className={styles.row}>
                <select className={styles.couponList}>
                  <option value="">쿠폰 다운받기</option>
                  <option value="쿠폰1">쿠폰1</option>
                  <option value="쿠폰2">쿠폰2</option>
                </select>
              </div>
          <div className={styles.buttonGroup}>
            <button className={styles.outlineBtn}><CiHeart /> 찜하기</button>
            <button className={styles.applyBtn}>신청하기</button>
          </div>
          <div>
            <p className={styles.etc}>결제 취소는 수강 2일 전까지만 가능합니다.</p>
          </div>
        </div>
      </aside>
    </div>
    </>
  );
}
