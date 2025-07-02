import React, { useState, useEffect } from 'react';
import styles from './MySchedule.module.css';
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from './Sidebar';
import { tokenAtom, userAtom } from "../../../../atoms";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { myAxios } from "../../../../config";
import { useNavigate } from "react-router";

export default function MySchedule() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [classList, setClassList] = useState([]);
  const [gatheringList, setGatheringList] = useState([]);
  const [token, setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = token && await myAxios(token, setToken).get('/user/mypage/schedule');
        setClassList(res.data.classSchedules);       // ✅ 수정됨
        setGatheringList(res.data.gatheringSchedules); // ✅ 수정됨
      } catch (e) {
        console.error('일정 가져오기 실패', e);
      }
    };
    fetchSchedule();
  }, [token]); // ✅ 의존성 정리

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const isPM = h >= 12;
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${isPM ? '오후' : '오전'} ${displayHour}:${minute}`;
  };

  const schedules = [
    ...(Array.isArray(classList) ? classList : []).map((c) => ({
      id: c.calendarId,
      type: 'class',
      title: c.className,
      location: c.locName,
      date: typeof c.startDate === 'string' ? c.startDate.slice(0, 10) : '',
      time: formatTime(c.startTime),
    })),
    ...(Array.isArray(gatheringList) ? gatheringList : []).map((g) => ({
      id: g.gatheringId,
      type: 'gather',
      name: g.title,
      host: g.nickName,
      memberCount: g.memberCount,
      date: typeof g.meetingDate === 'string' ? g.meetingDate.slice(0, 10) : '',
      time: formatTime(g.startTime),
    })),
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
    <>
      <Header />
      <main className={styles.page}>
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
                if (date === null) {
                  return <div key={idx} className={styles.calendarCell}></div>;
                }

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
                    <div className={styles.dateNum}>{date}</div>
                    {daySchedules.map((item, i) => (
                      <div
                        key={i}
                        className={`${styles.scheduleBox} ${
                          item.type === 'class' ? styles.classType : styles.gatherType
                        }`}
                        onClick={() => {
                          if (item.type === 'class') {
                            navigate(`/user/mypage/MyClassRegistList`);
                          } else if (item.type === 'gather') {
                            navigate(`/user/mypage/myGatheringingApplyList`);
                          }
                        }}                      
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
      </main>
      <Footer />
    </>
  );
}
