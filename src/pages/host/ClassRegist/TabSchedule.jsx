import { useState } from 'react';
import './TabSchedule.css';
import 'react-multi-date-picker/styles/colors/teal.css';
import { Calendar } from 'react-multi-date-picker';

const TabSchedule = () => {
    const [dates, setDates] = useState([]);
    const [minPeople, setMinPeople] = useState('');
    const [maxPeople, setMaxPeople] = useState('');

    const korean = {
        name: "gregorian_ko",
        months: [
            ["1월"], ["2월"], ["3월"], ["4월"], ["5월"], ["6월"],
            ["7월"], ["8월"], ["9월"], ["10월"], ["11월"], ["12월"]
        ],
        weekDays: [
            ["일"], ["월"], ["화"], ["수"], ["목"], ["금"], ["토"]
        ],
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        meridiems: [
            ["AM", "오전"],
            ["PM", "오후"]
        ]
    };

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
              value={minPeople}
              onChange={e => setMinPeople(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="숫자만 입력"
              className="KHJ-people-input"
            />
          </label>
          <label>
            최대 인원수:&nbsp;
            <input
              type="text"
              value={maxPeople}
              onChange={e => setMaxPeople(e.target.value.replace(/[^0-9]/g, ''))}
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
              value={dates}
              onChange={setDates}
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
        {dates.length > 0 && (
          <div className="KHJ-selected-dates">
            <strong>선택한 날짜:</strong>
            <ul>
              {dates.map((date, i) => (
                <li key={i}>{date.format("YYYY년 MM월 DD일")}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


export default TabSchedule;
