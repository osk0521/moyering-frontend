// 읽음 상태 토글 함수 (추후 ajax 연결 예정)
  const handleReadStatusToggle = async (id) => {
    try {
      // TODO: 추후 백엔드 API 호출
      // const response = await fetch(`/api/alarms/${id}/toggle-read`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const updatedAlarm = await response.json();
      
      // 현재는 로컬 상태 업데이트만
      setAlarmData(prev => 
        prev.map(alarm => 
          alarm.id === id ? { ...alarm, isRead: !alarm.isRead } : alarm
        )
      );
    } catch (error) {
      console.error('읽음 상태 변경 실패:', error);
    }
  };import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MyAlarmList.css';

import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from "./Sidebar";
export default function MyAlarmList() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [alarmType, setAlarmType] = useState('전체');
  const [readStatus, setReadStatus] = useState('전체');
  const [selectedAlarms, setSelectedAlarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [alarmData, setAlarmData] = useState([
    {
      id: 1,
      type: '게더링',
      title: '게더링 알림 제목',
      content: '알림 내용 5일니다. 알림 내용 5일니다',
      sender: '닉네임',
      date: '2025.04.04',
      isRead: false
    },
    {
      id: 2,
      type: '커뮤니티',
      title: '커뮤니티 알림 제목',
      content: '알림 내용 5일니다. 알림 내용 5일니다',
      sender: '닉네임',
      date: '2025.04.04',
      isRead: false
    },
    {
      id: 3,
      type: '클래스',
      title: '클래스 알림 제목',
      content: '알림 내용 5일니다. 알림 내용 5일니다',
      sender: '닉네임',
      date: '2025.04.04',
      isRead: true
    },
    {
      id: 4,
      type: '게더링',
      title: '게더링 알림 제목',
      content: '알림 내용 5일니다. 알림 내용 5일니다 닉네임님닉네임닉네임...',
      sender: '닉네임',
      date: '2025.04.04',
      isRead: false
    },
    {
      id: 5,
      type: '커뮤니티',
      title: '커뮤니티 알림 제목',
      content: '알림 내용 5일니다. 알림 내용 5일니다',
      sender: '닉네임',
      date: '2025.04.04',
      isRead: false
    },
    {
      id: 6,
      type: '클래스',
      title: '클래스 알림 제목',
      content: '알림 내용 5일니다. 알림 내용 5일니다',
      sender: '닉네임',
      date: '2025.04.04',
      isRead: false
    },
    {
      id: 7,
      type: '게더링',
      title: '게더링 알림 제목',
      content: '알림 내용 5일니다. 알림 내용 5일니다',
      sender: '닉네임',
      date: '2025.04.04',
      isRead: false
    },
    {
      id: 8,
      type: '클래스',
      title: '클래스 알림 제목',
      content: '알림 내용 5일니다. 알림 내용 5일니다',
      sender: '닉네임',
      date: '2025.04.04',
      isRead: false
    }
  ]);

  // 날짜 범위를 문자열로 포맷하는 함수
  const formatDateRange = () => {
    if (!selectedDate && !endDate) {
      return '';
    }
    if (selectedDate && !endDate) {
      return selectedDate.toLocaleDateString('ko-KR');
    }
    if (selectedDate && endDate) {
      return `${selectedDate.toLocaleDateString('ko-KR')} ~ ${endDate.toLocaleDateString('ko-KR')}`;
    }
    return '';
  };

  const handleAlarmSelect = (id) => {
    setSelectedAlarms(prev => 
      prev.includes(id) 
        ? prev.filter(alarmId => alarmId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlarms.length === alarmData.length) {
      setSelectedAlarms([]);
    } else {
      setSelectedAlarms(alarmData.map(alarm => alarm.id));
    }
  };

  // 선택된 알림들의 읽음 상태 일괄 변경 함수
  const handleBulkReadStatusChange = async () => {
    if (selectedAlarms.length === 0) {
      alert('변경할 알림을 선택해주세요.');
      return;
    }

    try {
      // TODO: 추후 백엔드 API 호출
      // const response = await fetch('/api/alarms/bulk-toggle-read', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ alarmIds: selectedAlarms })
      // });
      // const updatedAlarms = await response.json();
      
      // 현재는 로컬 상태 업데이트만 - 선택된 알림들의 읽음 상태를 토글
      setAlarmData(prev => 
        prev.map(alarm => 
          selectedAlarms.includes(alarm.id) 
            ? { ...alarm, isRead: !alarm.isRead } 
            : alarm
        )
      );
      
      // 선택 해제
      setSelectedAlarms([]);
    } catch (error) {
      console.error('일괄 읽음 상태 변경 실패:', error);
    }
  };

  return (
    <main className="MyAlarmList_content_osk">
      <h1 className="MyAlarmList_page_title_osk">알림 내역</h1>
      
      {/* Filter Section */}
      <div className="MyAlarmList_filter_section_osk">
        <div className="MyAlarmList_filter_row_osk">
          <div className="MyAlarmList_filter_group_osk">
            <label className="MyAlarmList_filter_label_osk">알림 종류</label>
            <select 
              value={alarmType} 
              onChange={(e) => setAlarmType(e.target.value)}
              className="MyAlarmList_filter_select_osk"
            >
              <option value="전체">전체</option>
              <option value="게더링">게더링</option>
              <option value="커뮤니티">커뮤니티</option>
              <option value="클래스">클래스</option>
            </select>
          </div>
          
          <div className="MyAlarmList_filter_group_osk">
            <label className="MyAlarmList_filter_label_osk">날짜</label>
            <div className="MyAlarmList_date_range_container_osk">
              <DatePicker
                selected={selectedDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setSelectedDate(start);
                  setEndDate(end);
                }}
                startDate={selectedDate}
                endDate={endDate}
                selectsRange
                placeholderText="날짜를 선택하세요"
                dateFormat="yyyy.MM.dd"
                className="MyAlarmList_datepicker_osk"
                customInput={
                  <input 
                    type="text" 
                    className="MyAlarmList_datepicker_input_osk"
                    placeholder='날짜를 선택하세요' 
                    value={formatDateRange()}
                    readOnly
                  />
                }
              />
            </div>
          </div>

          <div className="MyAlarmList_filter_group_osk">
            <label className="MyAlarmList_filter_label_osk">읽음 여부</label>
            <select 
              value={readStatus} 
              onChange={(e) => setReadStatus(e.target.value)}
              className="MyAlarmList_filter_select_osk"
            >
              <option value="전체">전체</option>
              <option value="읽음">읽음</option>
              <option value="안읽음">안읽음</option>
            </select>
          </div>

          <div className="MyAlarmList_filter_actions_osk">
            <button className="MyAlarmList_search_action_button_osk">검색</button>
            <button 
              className="MyAlarmList_search_action_button_osk"
              onClick={handleBulkReadStatusChange}
            >
              선택 상태 변경
            </button>
          </div>
        </div>
      </div>

      {/* Alarm Table */}
      <div className="MyAlarmList_table_container_osk">
        <table className="MyAlarmList_table_osk">
          <thead className="MyAlarmList_table_head_osk">
            <tr>
              <th className="MyAlarmList_table_header_osk">
                <input 
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedAlarms.length === alarmData.length}
                  className="MyAlarmList_checkbox_osk"
                />
              </th>
              <th className="MyAlarmList_table_header_osk">알림 유형</th>
              <th className="MyAlarmList_table_header_osk">알림 제목</th>
              <th className="MyAlarmList_table_header_osk">알림 내용</th>
              <th className="MyAlarmList_table_header_osk">보낸 시간</th>
              <th className="MyAlarmList_table_header_osk">날짜</th>
              <th className="MyAlarmList_table_header_osk">읽음 여부</th>
            </tr>
          </thead>
          <tbody className="MyAlarmList_table_body_osk">
            {alarmData.map((alarm) => (
              <tr key={alarm.id} className="MyAlarmList_table_row_osk">
                <td className="MyAlarmList_table_cell_osk">
                  <input 
                    type="checkbox"
                    checked={selectedAlarms.includes(alarm.id)}
                    onChange={() => handleAlarmSelect(alarm.id)}
                    className="MyAlarmList_checkbox_osk"
                  />
                </td>
                <td className="MyAlarmList_table_cell_osk">{alarm.type}</td>
                <td className="MyAlarmList_table_cell_osk">{alarm.title}</td>
                <td className="MyAlarmList_table_cell_osk">{alarm.content}</td>
                <td className="MyAlarmList_table_cell_osk">{alarm.sender}</td>
                <td className="MyAlarmList_table_cell_osk">{alarm.date}</td>
                <td className="MyAlarmList_table_cell_osk">
                  <button 
                    className={`MyAlarmList_status_badge_osk ${alarm.isRead ? 'MyAlarmList_status_read_osk' : 'MyAlarmList_status_unread_osk'}`}
                    onClick={() => handleReadStatusToggle(alarm.id)}
                  >
                    {alarm.isRead ? '읽음' : '안읽음'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="MyAlarmList_pagination_osk">
        <button 
          className="MyAlarmList_pagination_button_osk"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          ‹
        </button>
        <button className="MyAlarmList_pagination_button_osk MyAlarmList_pagination_active_osk">1</button>
        <button className="MyAlarmList_pagination_button_osk">2</button>
        <button className="MyAlarmList_pagination_button_osk">3</button>
        <button 
          className="MyAlarmList_pagination_button_osk"
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          ›
        </button>
      </div>
    </main>
  );
}