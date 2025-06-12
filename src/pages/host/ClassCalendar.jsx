import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './ClassCalendar.css';

const events = [
  { title: "드로잉 클래스", start: "2025-06-11", color: "#ff9f89" },
  { title: "요가 클래스", start: "2025-06-12", color: "#a0d8ef" },
  { title: "베이킹 클래스", start: "2025-06-13", color: "#c3f584" },
  { title: "드로잉 클래스", start: "2025-06-18", color: "#ff9f89" },
  { title: "요가 클래스", start: "2025-06-19", color: "#a0d8ef" },
  { title: "베이킹 클래스", start: "2025-06-20", color: "#c3f584" },
];

const ClassCalendar = () => {
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
        height="auto"
      />
    </div>
  );
};

export default ClassCalendar;
