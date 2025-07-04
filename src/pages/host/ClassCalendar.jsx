import React, { useEffect, useState } from 'react';
import './ClassCalendar.css';
import { myAxios } from '../../config';
import { tokenAtom, userAtom } from '../../atoms';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router';

const ClassCalendar = () => {
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState([]);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  useEffect(() => {
    if (!token || !user.hostId) return;
    myAxios(token)
      .get(`/host/calendar?hostId=${user.hostId}`)
      .then((res) => setCalendarData(res.data))
      .catch((err) => console.error(err));
  }, [token, user.hostId]);

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

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${isPM ? '오후' : '오전'} ${formattedHour}:${m}`;
  };

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let d = 1; d <= lastDate; d++) dates.push(d);

  const mStr = String(month + 1).padStart(2, '0');

  return (
    <div className="KHJ-class-calendar-wrapper">
      <h3 className="KHJ-class-calendar-title">일정 캘린더</h3>

      <div className="calendar-header">
        <button className="calendar-header-btn" onClick={handlePrev}>〈</button>
        <span className="calendar-month-label">{year}년 {month + 1}월</span>
        <button className="calendar-header-btn" onClick={handleNext}>〉</button>
      </div>

      <div className="calendar-grid">
        {days.map((day, idx) => (
          <div key={idx} className="calendar-day">{day}</div>
        ))}

        {dates.map((date, idx) => {
          if (date === null) return <div key={idx} className="calendar-cell empty"></div>;

          const dStr = String(date).padStart(2, '0');
          const fullDate = `${year}-${mStr}-${dStr}`;
          const daySchedules = calendarData.filter(item => item.startDate === fullDate);

          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === date;

          return (
            <div
              key={idx}
              className={`calendar-cell ${isToday ? 'today-cell' : ''}`}
            >
              <div className="date-num">{date}</div>
              {daySchedules.map((item, i) => (
                <div
                  key={i}
                  className="schedule-box"
                  onClick={() => navigate(`/host/detail/${item.classId}/${item.calendarId}`)}
                >
                  {item.name}
                  <br />
                  {formatTime(item.startTime)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassCalendar;
