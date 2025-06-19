import { useState } from 'react';
import './TabSchedule.css';
import 'react-multi-date-picker/styles/colors/teal.css';
import { Calendar } from 'react-multi-date-picker';
import React from 'react'; // 이 한 줄만 추가!

const TabSchedule = ({classData,setClassData}) => {
    const {schedule} = classData;
    const korean = {
        name: "gregorian_ko",
        months: [
            ["1월"], ["2월"], ["3월"], ["4월"], ["5월"], ["6월"],
            ["7월"], ["8월"], ["9월"], ["10월"], ["11월"], ["12월"]
        ],
        weekDays: [
            ["일"], ["월"], ["화"], ["수"], ["목"], ["금"], ["토"]
        ],
        digits: ["0", "1" , "2", "3", "4", "5", "6", "7", "8", "9"],
        meridiems: [
            ["AM", "오전"],
            ["PM", "오후"]
        ]
    };

    const handleCruitMinChange = (e) => {
      const value = e.target.value.replace(/[^0-9]/g,'');
      setClassData((prev)=>({
        ...prev,
        schedule:{
          ...prev.schedule,
          recruitMin:value,
        }
      }));
    }

    const handleCruitMaxChange = (e) => {
      const value = e.target.value.replace(/[^0-9]/g,'');
      setClassData((prev)=>({
        ...prev,
        schedule:{
          ...prev.schedule,
          recruitMax:value,
        }
      }));
    }

    const handleDatesChange = (dates) => {
      const formmattedDates = dates.map((d)=>d.format("YYYY-MM-DD"));
      setClassData((prev)=>({
        ...prev,
        schedule:{
          ...prev.schedule,
          dates:formmattedDates,
        }
      }))
    }


   return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">클래스 일정</h3>
      <div className="KHJ-form-section">
        <label className="KHJ-people-label"><span>*</span>모집인원</label>
        <div className="KHJ-people-inputs">
          <label>
            최소 인원수:&nbsp;
            <input
              type="text"
              value={schedule.recruitMin || ''}
              onChange={handleCruitMinChange}
              placeholder="숫자만 입력"
              className="KHJ-people-input"
            />
          </label>
          <label>
            최대 인원수:&nbsp;
            <input
              type="text"
              value={schedule.recruitMax || ''}
              onChange={handleCruitMaxChange}
              placeholder="숫자만 입력"
              className="KHJ-people-input"
            />
          </label>
        </div>
        <hr />
        <div className="KHJ-inline-form-row">
          <label className="KHJ-people-label"><span>*</span>일정설정</label>
          <div className="KHJ-date-picker-container">
            <Calendar
              multiple
              value={schedule.dates}
              onChange={handleDatesChange}
              format="YYYY-MM-DD"
              locale={korean}
              className="teal"
              onlyCalendar
              shadow={false}
              style={{ width: "100%" }}
              mapDays={({ date }) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const minSelectable = new Date(today);
                minSelectable.setDate(minSelectable.getDate() + 2);
                if (date.toDate() < minSelectable) {
                  return {
                    disabled: true,
                    style: { color: "#ccc", cursor: "not-allowed", textDecoration: "line-through" },
                    onClick: () => {},
                  };
                }
              }}
            />
          </div>
        </div>
        {schedule.dates.length > 0 && (
          <div className="KHJ-selected-dates">
            <strong>선택한 날짜:</strong>
            <ul>
              {schedule.dates.map((date, i) => (
                <li key={i}>{date}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


export default TabSchedule;
