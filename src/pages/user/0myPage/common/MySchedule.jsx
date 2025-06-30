import React, { useState } from 'react';
import styles from './MySchedule.module.css';
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from './Sidebar';

export default function MySchedule() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const schedules = [
    {
      id: 101,
      type: 'class',
      title: '도자기클래스',
      location: '서울 강남구',
      date: '2025-06-03',
      time: '오후 2:00',
    },
    {
      id: 102,
      type: 'gather',
      name: '악기입문모임',
      host: '이모여',
      memberCount: 12,
      date: '2025-06-14',
      time: '오후 8:00',
    },
    {
      id: 103,
      type: 'class',
      title: '보컬클래스',
      location: '서울 용산구',
      date: '2025-06-26',
      time: '오전 11:00',
    },
    {
      id: 104,
      type: 'gather',
      name: '보컬모임',
      host: '김소리',
      memberCount: 10,
      date: '2025-06-26',
      time: '오전 11:00',
    },
  ];

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const handlePrev = () => {
    if (month === 0) {
      setYear((prev) => prev - 1);
      setMonth(11);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setYear((prev) => prev + 1);
      setMonth(0);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let d = 1; d <= lastDate; d++) dates.push(d);

  return (
    <main className={styles.page}>
      <Header />
      <aside className={styles.sidebarArea}>
        <Sidebar />
      </aside>

      <section className={styles.calendarArea}>
        <h2>모여링 일정</h2>

        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button className={styles.calendarHeaderBtn} onClick={handlePrev}>〈</button>
            <span>{year}년 {month + 1}월</span>
            <button className={styles.calendarHeaderBtn} onClick={handleNext}>〉</button>
          </div>

          <div className={styles.calendarGrid}>
            {days.map((day) => (
              <div key={day} className={styles.calendarDay}>{day}</div>
            ))}
            {dates.map((date, idx) => {
              const m = String(month + 1).padStart(2, '0');
              const d = String(date).padStart(2, '0');
              const fullDate = `${year}-${m}-${d}`;
              const daySchedules = schedules.filter((s) => s.date === fullDate);
              const isToday =
                year === today.getFullYear() &&
                month === today.getMonth() &&
                date === today.getDate();

              return (
                <div
                  key={idx}
                  className={`${styles.calendarCell} ${isToday ? styles.todayCell : ''}`}
                >
                  {date && <div className={styles.dateNum}>{date}</div>}
                  {daySchedules.map((item, i) => (
                    <div
                      key={i}
                      className={`${styles.scheduleBox} ${
                        item.type === 'class' ? styles.classType : styles.gatherType
                      }`}
                    >
                      {item.type === 'class' ? item.title : item.name}
                      <br />
                      {item.time}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
