import React, { useEffect, useState, useCallback } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MyAlarmList.css';
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../../../atoms";
import { myAxios, url } from "../../../../config";

import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from "./Sidebar";
const handleReadStatusToggle = async (id) => {
  try {
    setAlarmList(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, isRead: !alarm.isRead } : alarm
      )
    );
  } catch (error) {
    console.error('읽음 상태 변경 실패:', error);
  }
};
export default function MyAlarmList() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [alarmType, setAlarmType] = useState('전체');
  const [readStatus, setReadStatus] = useState('전체');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlarms, setSelectedAlarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [alarmList, setAlarmList] = useState([]);
  const [alarmCnt, setAlarmCnt] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1
  });
  const [pageNums, setPageNums] = useState([]);
  const [search, setSearch] = useState({
    page: 1,
    status: "",
    startDate: "",
    endDate: ""
  });
  const handlePageChange = useCallback((page) => {
    setSearch(prev => ({ ...prev, page }));
  }, []);
  const getAlarmTypeLabel = (alarmType) => {
    switch (alarmType) {
      case 1:
        return '시스템/관리자';
      case 2:
        return '클래스링';
      case 3:
        return '게더링';
      case 4:
        return '소셜링';
      default:
        return '기타';
    }
  };
  useEffect(() => {
    if (user || token) {
      search.page = search.page;
      if (readStatus !== null) {
        search.isConfirmed = readStatus;
      }
      if (startDate) {
        search.startDate = startDate.toISOString().split('T')[0];
      }
      if (endDate) {
        search.endDate = endDate.toISOString().split('T')[0];
      }
      console.log("search : ", search);
      token && myAxios(token, setToken).post(`/user/alarmList`, search)
        .then((res) => {
          console.log("API Response:", res.data);
          setAlarmCnt(res.data.alarmCnt);
          if (res.data.alarmCnt > 0) {
            // 페이지 정보 설정
            let resPageInfo = res.data.pageInfo;
            setPageInfo(resPageInfo);
            let pages = [];
            for (let i = resPageInfo.startPage; i <= resPageInfo.endPage; i++) {
              pages.push(i);
            }
            setPageNums([...pages]);
            const transformedData = res.data.alarmList.map((item) => ({
              alarmId: item.alarmId,
              type: getAlarmTypeLabel(item.alarmType),
              title: item.title,
              content: item.content,
              senderNickname: item.senderNickname,
              senderId: item.senderId,
              receiverId: item.receiverId,
              alarmDate: item.alarmDate,
              isRead: item.confirm,
            }));


            console.log("Transformed Data:", transformedData);
            setAlarmList(transformedData);
          } else {
            setAlarmList([]);
          }
        })
        .catch((err) => {
          console.error("데이터 로딩 오류:", err);
        });
    } else {
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/userlogin");
      } else {
        window.history.back();
        return;
      }
    }
  }, [token, search]);
  // 날짜 범위를 문자열로 포맷하는 함수
  const formatDateRange = () => {
    if (!startDate && !endDate) {
      return '';
    }
    if (startDate && !endDate) {
      return startDate.toLocaleDateString('ko-KR');
    }
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('ko-KR')} ~ ${endDate.toLocaleDateString('ko-KR')}`;
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
    if (selectedAlarms.length === alarmList.length) {
      setSelectedAlarms([]);
    } else {
      setSelectedAlarms(alarmList.map(alarm => alarm.id));
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
      setAlarmList(prev =>
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
    <div>
      <Header />
      <main className="MyGatherPage_container ">
        <Sidebar />
        <section className=' MyAlarmList_content_osk'>
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
                  <option>전체</option>
                  <option value="1">시스템/관리자</option>
                  <option value="2">클래스링</option>
                  <option value="3">게더링</option>
                  <option value="4">소셜링</option>
                </select>
              </div>

              <div className="MyAlarmList_filter_group_osk">
                <label className="MyAlarmList_filter_label_osk">날짜</label>
                <div className="MyAlarmList_date_range_container_osk">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(dates) => {
                      const [start, end] = dates;
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    placeholderText="날짜를 선택하세요"
                    dateFormat="yyyy.MM.dd"
                    className="MyAlarmList_datepicker_osk"
                    locale={ko}
                    maxDate={new Date()}
                    shouldCloseOnSelect={false}
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
                <button className="MyAlarmList_search_action_button_osk" onClick={handleBulkReadStatusChange}>검색</button>
                <button
                  className="MyAlarmList_search_action_button_osk"
                  onClick={handleBulkReadStatusChange}
                >
                  선택 상태 변경
                </button>
              </div>
            </div>
          </div>
          <div className="MyAlarmList_table_container_osk">
            <table className="MyAlarmList_table_osk">
              <thead className="MyAlarmList_table_head_osk">
                <tr>
                  <th className="MyAlarmList_table_header_osk">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedAlarms.length === alarmList.length}
                      className="MyAlarmList_checkbox_osk"
                    />
                  </th>
                  <th className="MyAlarmList_table_header_osk">알림 유형</th>
                  <th className="MyAlarmList_table_header_osk">알림 제목</th>
                  <th className="MyAlarmList_table_header_osk">알림 내용</th>
                  <th className="MyAlarmList_table_header_osk">발송인</th>
                  <th className="MyAlarmList_table_header_osk">발송일</th>
                  <th className="MyAlarmList_table_header_osk">읽음 여부</th>
                </tr>
              </thead>
              <tbody className="MyAlarmList_table_body_osk">
                {alarmList.map((alarm) => (
                  <tr key={alarm.id} className="MyAlarmList_table_row_osk">
                    <td className="MyAlarmList_table_cell_osk">
                      <input
                        type="checkbox"
                        checked={selectedAlarms.includes(alarm.alarmId)}
                        onChange={() => handleAlarmSelect(alarm.alarmId)}
                        className="MyAlarmList_checkbox_osk"
                      />
                    </td>
                    <td className="MyAlarmList_table_cell_osk">{alarm.type}</td>
                    <td className="MyAlarmList_table_cell_osk">{alarm.title}</td>
                    <td className="MyAlarmList_table_cell_osk">{alarm.content}</td>
                    <td className="MyAlarmList_table_cell_osk">{alarm.senderNickname}</td>
                    <td className="MyAlarmList_table_cell_osk">{alarm.alarmDate}</td>
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
          {pageInfo.allPage > 1 && (
            <div className="MyAlarmList_pagination_osk">
              {pageInfo.curPage > 1 && (
                <button
                  className="MyAlarmList_pagination_button_osk"
                  onClick={() => handlePageChange(pageInfo.curPage - 1)}
                  disabled={loading}
                >
                  〈
                </button>
              )}
              {pageNums.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={
                    pageInfo.curPage === pageNum
                      ? "MyAlarmList_pagination_button_osk MyAlarmList_pagination_active_osk"
                      : "MyAlarmList_pagination_button_osk"
                  }
                  disabled={loading}
                >
                  {pageNum}
                </button>
              ))}
              {pageInfo.curPage < pageInfo.allPage && (
                <button
                  className="MyAlarmList_pagination_button_osk"
                  onClick={() => handlePageChange(pageInfo.curPage + 1)}
                  disabled={loading}
                >
                  〉
                </button>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}