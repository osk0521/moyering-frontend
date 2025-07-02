import { useState, useEffect } from 'react';
import './UpdateTabSchedule.css';
import 'react-multi-date-picker/styles/colors/teal.css';
import { Calendar, DateObject } from 'react-multi-date-picker';
import React from 'react';

const UpdateTabSchedule = ({ classData, setClassData }) => {
  const { schedule } = classData;

  // 최초 마운트 시 스케줄 디테일 1개 기본값 세팅
  useEffect(() => {
    if (!schedule.scheduleDetail || schedule.scheduleDetail.length === 0) {
      setClassData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          scheduleDetail: [
            { startTime: '00:00', endTime: '00:00', content: '' }
          ]
        }
      }));
    }
  }, []);

  useEffect(() => {
    console.log("👀 schedule 초기값 확인:", schedule.dates);
  }, []);

  const addScheduleDetail = () => {
    const newDetails = [...(schedule.scheduleDetail || [])];
    newDetails.push({ startTime: '00:00', endTime: '00:00', content: '' });
    setClassData(prev => ({
      ...prev,
      schedule: {
        ...schedule,
        scheduleDetail: newDetails
      }
    }));
  };

  const removeScheduleDetail = (index) => {
    const newDetails = [...(schedule.scheduleDetail || [])];
    newDetails.splice(index, 1);
    setClassData(prev => ({
      ...prev,
      schedule: {
        ...schedule,
        scheduleDetail: newDetails
      }
    }));
  };

  const updateScheduleDetail = (index, field, value) => {
    const newDetails = [...(schedule.scheduleDetail || [])];
    newDetails[index][field] = value;
    setClassData(prev => ({
      ...prev,
      schedule: {
        ...schedule,
        scheduleDetail: newDetails
      }
    }));
  };

  const handleCruitMinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setClassData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        recruitMin: value
      }
    }));
  };

  const handleCruitMaxChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setClassData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        recruitMax: value
      }
    }));
  };

  const handleDatesChange = (dates) => {
    const formattedDates = dates.map((d) => ({
      calendarId: null, // 신규 날짜는 아직 ID 없음
      classId: classData.classId,
      startDate: d.format("YYYY-MM-DD"),
      endDate: d.format("YYYY-MM-DD"),
      status: "임시저장",
      registeredCount: 0
    }));

    setClassData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: formattedDates
      }
    }));
  };

  const korean = {
    name: "gregorian_ko",
    months: [["1월"], ["2월"], ["3월"], ["4월"], ["5월"], ["6월"], ["7월"], ["8월"], ["9월"], ["10월"], ["11월"], ["12월"]],
    weekDays: [["일"], ["월"], ["화"], ["수"], ["목"], ["금"], ["토"]],
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    meridiems: [["AM", "오전"], ["PM", "오후"]]
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
        <div className="schedule-wrapper">
          <label className="KHJ-schedule-label"><span>*</span>상세스케쥴</label>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>일정 시작</th>
                <th>일정 종료</th>
                <th>상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(schedule.scheduleDetail || []).map((entry, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="time"
                      value={entry.startTime}
                      onChange={(e) => updateScheduleDetail(index, 'startTime', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={entry.endTime}
                      onChange={(e) => updateScheduleDetail(index, 'endTime', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={entry.content}
                      placeholder="일정 내용"
                      onChange={(e) => updateScheduleDetail(index, 'content', e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="entry-remove-btn" onClick={() => removeScheduleDetail(index)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="add-entry" onClick={addScheduleDetail}>+ 내용 추가하기</div>
        </div>

        {/* <div className="KHJ-inline-form-row">
          <label className="KHJ-people-label"><span>*</span>일정설정</label>
          <div className="KHJ-date-picker-container">
            <Calendar
              multiple
              value={(schedule.dates || []).map(item => new DateObject(item.startDate))}
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
                    style: { color: "#ccc", cursor: "not-allowed", textDecoration: "line-through" }
                  };
                }
              }}
            />
          </div>
        </div> */}

        {/* {schedule.dates.length > 0 && (
          <div className="KHJ-selected-dates">
            <strong>선택한 날짜:</strong>
            <ul>
              {schedule.dates.map((date, i) => (
                <li key={i}>{date}</li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default UpdateTabSchedule;
