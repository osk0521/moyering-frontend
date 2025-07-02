import React, { useState } from 'react';
import styles from './MyClassRegistList.module.css';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { GoPeople } from 'react-icons/go';

const classData = [
  {
    id: 1,
    title: '감성 만들기 원데이 클래스',
    description: '서울의 감성 카페에서 원데이 클래스를 진행해요. 클래스를 커피향과 함께 즐겨보세요!',
    date: '2025년 10월 15일',
    deadline: '2025년 10월 10일 23:59',
    location: '서울 강남구 테헤란로 152',
    people: '6명 모집 / 4명 신청 완료',
    tags: ['원데이', '핸드메이드'],
    status: '수강확정',
    image: '/public/myclassList.png',
    bgColor: 'mint',
    buttons: ['결제내역', '문의하기', '강의자료 다운']
  },
  {
    id: 2,
    title: '한강 자전거 배우기',
    description: '한강 자전거 길에서 함께 라이딩하며 배우는 활동형 클래스입니다.',
    date: '2025년 6월 18일',
    deadline: '2025년 6월 15일 23:59',
    location: '서울 여의도',
    people: '8명 모집 / 5명 신청 완료',
    tags: ['자전거', '야외활동'],
    status: '수강예정',
    image: '/public/myclassList.png',
    bgColor: 'yellow',
    buttons: ['결제내역', '문의하기', '수강취소']
  },
  {
    id: 3,
    title: '챗GPT 입문과 활용하기',
    description: '쉽게 배우는 GPT 활용법과 프롬프트 설계까지. 누구나 따라할 수 있어요!',
    date: '2025년 6월 22일',
    deadline: '2025년 6월 20일 23:59',
    location: '서울 마포구',
    people: '5명 모집 / 5명 신청 완료',
    tags: ['AI', '코딩'],
    status: '수강취소',
    image: '/public/myclassList.png',
    bgColor: 'pink',
    buttons: ['취소내역']
  },
  {
    id: 4,
    title: '클라이밍 입문체험전',
    description: '클라이밍 체험과 함께 근력과 즐거움을. 초보도 할 수 있는 입문자용 클래스!',
    date: '2025년 5월 5일',
    deadline: '2025년 5월 1일 23:59',
    location: '서울 마포구 합정',
    people: '10명 모집 / 9명 신청 완료',
    tags: ['클라이밍', '액티비티'],
    status: '수강확정',
    image: '/public/myclassList.png',
    bgColor: 'mint',
    buttons: ['결제내역', '문의하기', '강의자료 다운']
  },
  {
    id: 5,
    title: '서울 도심 카페 탐방',
    description: '서울의 숨겨진 카페들을 함께 탐험해요. 매주 새로운 카페에서 이야기 나눠요.',
    date: '2025년 5월 2일',
    deadline: '2025년 5월 1일 23:59',
    location: '서울 강남구',
    people: '6명 모집 / 6명 신청 완료',
    tags: ['카페', '투어'],
    status: '수강완료',
    image: '/public/myclassList.png',
    bgColor: 'sky',
    buttons: ['결제내역', '문의하기', '후기작성']
  }
];

export default function MyClassList() {
  const [filter, setFilter] = useState('전체');
  const filteredClasses =
    filter === '전체' ? classData : classData.filter((cls) => cls.status === filter);

  return (
    <div className={styles.classPage}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBox}>회원정보</div>
      </aside>

      <main className={styles.classContent}>
        <h2 className={styles.pageTitle}>수강 클래스 목록</h2>

        <div className={styles.tabs}>
          {['전체', '수강확정', '수강예정', '수강완료', '수강취소'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${filter === tab ? styles.active : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.classList}>
          {filteredClasses.map((cls) => (
            <div key={cls.id} className={`${styles.classCard} ${styles[cls.bgColor]}`}>
              <div className={styles.cardLeft}>
                <img src={cls.image} alt={cls.title} className={styles.classImage} />
              </div>
              <div className={styles.cardRight}>
                <div className={styles.cardHeader}>
                  <span className={styles.statusBadge}>{cls.status}</span>
                  <h3 className={styles.classTitle}>{cls.title}</h3>
                </div>
                <p className={styles.description}>{cls.description}</p>
                <div className={styles.infoRow}><CiCalendar /> {cls.date} (신청 마감: {cls.deadline})</div>
                <div className={styles.infoRow}><CiLocationOn /> {cls.location}</div>
                <div className={styles.infoRow}><GoPeople /> {cls.people}</div>
                <div className={styles.tagList}>
                  {cls.tags.map((tag, i) => <span key={i} className={styles.tag}>#{tag}</span>)}
                </div>
                <div className={styles.actions}>
                  {cls.buttons.map((btn, i) => (
                    <button key={i} className={styles.actionBtn}>{btn}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
