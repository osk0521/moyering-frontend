import { useState, useEffect } from 'react';
import './TabSchedule.css';
import 'react-multi-date-picker/styles/colors/teal.css';
import { Calendar } from 'react-multi-date-picker';
import React from 'react';

const TabSchedule = ({ classData, setClassData }) => {
  const { schedule } = classData;

  // 최초 마운트 시 스케줄 1개 기본값 세팅
  useEffect(() => {
    if (!schedule.scheduleBlocks || schedule.scheduleBlocks.length === 0) {
      setClassData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          scheduleBlocks: [
            { name: '스케줄 1', entries: [] }
          ]
        }
      }));
    }
  }, []);

  const addEntryToBlock = (blockIndex) => {
    const newSchedules = [...(schedule.scheduleBlocks || [])];
    newSchedules[blockIndex].entries.push({
      startTime: '00:00',
      endTime: '00:00',
      content: ''
    });
    setClassData(prev => ({
      ...prev,
      schedule: {
        ...schedule,
        scheduleBlocks: newSchedules
      }
    }));
  };

  const removeEntryFromBlock = (blockIndex, entryIndex) => {
    const newSchedules = [...(schedule.scheduleBlocks || [])];
    newSchedules[blockIndex].entries.splice(entryIndex, 1);
    setClassData(prev => ({
      ...prev,
      schedule: {
        ...schedule,
        scheduleBlocks: newSchedules
      }
    }));
  };

  const updateEntry = (blockIndex, entryIndex, field, value) => {
    const newSchedules = [...(schedule.scheduleBlocks || [])];
    newSchedules[blockIndex].entries[entryIndex][field] = value;
    setClassData(prev => ({
      ...prev,
      schedule: {
        ...schedule,
        scheduleBlocks: newSchedules
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
    const formattedDates = dates.map((d) => d.format("YYYY-MM-DD"));
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
          <h3>스케줄</h3>
          {(schedule.scheduleBlocks || []).map((block, blockIndex) => (
            <div key={blockIndex} className="schedule-block">
              <div className="schedule-header">
                <strong>{block.name}</strong>
              </div>
              <div className="schedule-table">
                {block.entries.map((entry, entryIndex) => (
                  <div key={entryIndex} className="schedule-entry">
                    <input
                      type="time"
                      value={entry.startTime}
                      onChange={(e) => updateEntry(blockIndex, entryIndex, 'startTime', e.target.value)}
                    />
                    <span> - </span>
                    <input
                      type="time"
                      value={entry.endTime}
                      onChange={(e) => updateEntry(blockIndex, entryIndex, 'endTime', e.target.value)}
                    />
                    <input
                      type="text"
                      value={entry.content}
                      placeholder="일정 내용"
                      onChange={(e) => updateEntry(blockIndex, entryIndex, 'content', e.target.value)}
                      className="content-input"
                    />
                    <button
                      className="entry-remove-btn"
                      onClick={() => removeEntryFromBlock(blockIndex, entryIndex)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <div className="add-entry" onClick={() => addEntryToBlock(blockIndex)}>+ 내용 추가하기</div>
              </div>
            </div>
          ))}
        </div>

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
                    style: { color: "#ccc", cursor: "not-allowed", textDecoration: "line-through" }
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
