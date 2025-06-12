import React, { useState } from 'react';
import styles from './MyWishlist.module.css';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { GoPeople } from 'react-icons/go';
import { FaHeart } from 'react-icons/fa';

const wishlistData = {
  클래스: [
    {
      id: 1,
      type: '클래스',
      title: '도시카페 원데이 클래스',
      desc: '서울의 숨겨진 카페들을 함께 탐험해요. 새로운 카페에서 매번 이야기 나눠요.',
      date: '2025년 10월 15일',
      location: '서울 강남구 테헤란로 152',
      tags: ['카페', '투어'],
      image: '/public/myclassList.png',
      bgColor: 'mint',
    },
    // ...다른 클래스들
  ],
  게더링: [
    {
      id: 2,
      type: '게더링',
      title: '한강 자전거 라이딩',
      desc: '한강길을 따라 시원한 자전거 라이딩! 초보자도 환영입니다.',
      date: '2025년 7월 12일',
      location: '서울 여의도',
      tags: ['자전거', '야외활동'],
      image: '/public/myclassList.png',
      bgColor: 'yellow',
    },
    // ...다른 게더링들
  ]
};

export default function MyWishlist() {
  const [filter, setFilter] = useState('클래스');
  const items = wishlistData[filter];

  return (
    <div className={styles.wishlistPage}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBox}>회원정보</div>
      </aside>

      <main className={styles.wishlistContent}>
        <h2 className={styles.pageTitle}>찜 목록</h2>

        <div className={styles.tabs}>
          {['클래스', '게더링'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${filter === tab ? styles.active : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.wishlistList}>
          {items.map((item) => (
            <div key={item.id} className={`${styles.card} ${styles[item.bgColor]}`}>
              <div className={styles.cardLeft}>
                <img src={item.image} alt={item.title} className={styles.image} />
              </div>
              <div className={styles.cardRight}>
                <div className={styles.header}>
                  <span className={styles.badge}>{item.type}</span>
                  <h3 className={styles.title}>{item.title}</h3>
                </div>
                <p className={styles.desc}>{item.desc}</p>
                <div className={styles.info}><CiCalendar /> {item.date}</div>
                <div className={styles.info}><CiLocationOn /> {item.location}</div>
                <div className={styles.tags}>
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.heart}>
                <FaHeart color="#f87171" size={20} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
