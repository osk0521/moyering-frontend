import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './ClassCalendar.css';
import React, { useEffect, useState } from 'react'; // 이 한 줄만 추가!
import { myAxios } from '../../config';
import { tokenAtom, userAtom } from '../../atoms';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router';



const ClassCalendar = () => {
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom)
  const [calendarData, setCalendarData] = useState([]);
  const classColorMap = {};
  const navigate = useNavigate();
  const handleEventClick = (info) => {
    const classId = info.event.extendedProps.classId;
    const calendarId = info.event.extendedProps.calendarId;
    navigate(`/host/detail/${classId}/${calendarId}`)
  }

  const getBrightColor = () => {
    const hue = Math.floor(Math.random() * 360);     // 색상 범위 (0~360도)
    const saturation = 70 + Math.random() * 20;      // 채도 70~90%
    const lightness = 60 + Math.random() * 10;       // 밝기 60~70%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getColorByClassId = (classId) => {
    if (!classColorMap[classId]) {
      classColorMap[classId] = getBrightColor();
    }
    return classColorMap[classId];
  }


  const addOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 포맷
  };

  const events = calendarData.map(item => ({
    title: item.name,
    start: item.startDate,
    end: addOneDay(item.startDate),
    backgroundColor: getColorByClassId(item.classId),
    borderColor: getColorByClassId(item.classId),
    allDay: true,
    classId:item.classId,
    calendarId:item.calendarId,
  }))
  useEffect(() => {
    myAxios(token).get(`/host/calendar?hostId=${user.hostId}`)
      .then(res => {
        setCalendarData(res.data);
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [token, user.hostId])

  return (
    <div className="KHJ-class-calendar-wrapper">
      <h3 className="KHJ-class-calendar-title">일정 캘린더</h3>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: ''
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
      />
    </div>
  );
};

export default ClassCalendar;
