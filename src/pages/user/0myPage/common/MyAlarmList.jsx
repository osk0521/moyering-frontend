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
    alarmType: "전체",
    readStatus: "전체",
    startDate: "",
    endDate: "",
  });

  const getAlarmTypeLabel = (alarmType) => {
    switch (alarmType) {
      case 1:
        return '관리자';
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

  // 알림 데이터 로딩 - useEffect 방식으로 변경
  useEffect(() => {
    if (user || token) {
      setLoading(true);
      setError(null);

      let requestBody = {
        page: parseInt(search.page),
      };
      if (search.alarmType !== '전체') {
        requestBody.alarmType = parseInt(search.alarmType);
      }
      if (search.readStatus === '전체' || search.readStatus === null) {
        requestBody.isConfirmed = null;
      } else if (search.readStatus === 'true') {
        requestBody.isConfirmed = true;
      } else if (search.readStatus === 'false') {
        requestBody.isConfirmed = false;
      }

      // 날짜 파라미터 처리
      if (search.startDate && search.startDate.trim() !== "") {
        requestBody.startDate = search.startDate;
      }
      if (search.endDate && search.endDate.trim() !== "") {
        requestBody.endDate = search.endDate;
      }

      console.log("Request Body:", requestBody);

      token && myAxios(token, setToken).post(`/user/alarmList`, requestBody)
        .then((res) => {
          console.log("API Response:", res.data);
          setAlarmCnt(res.data.alarmCnt);
          if (res.data.alarmCnt > 0) {
            const resPageInfo = res.data.pageInfo;
            setPageInfo(resPageInfo);
            const pages = [];
            for (let i = resPageInfo.startPage; i <= resPageInfo.endPage; i++) {
              pages.push(i);
            }
            setPageNums(pages);

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
            setAlarmList(transformedData);
          } else {
            setAlarmList([]);
            setPageInfo({
              curPage: 1,
              allPage: 1,
              startPage: 1,
              endPage: 1
            });
            setPageNums([]);
          }
        })
        .catch((err) => {
          console.error("데이터 로딩 오류:", err);
          if (err.response?.status === 401) {
            setError("인증이 만료되었습니다. 다시 로그인해주세요.");
            setToken(null);
            if (window.confirm("로그인이 만료되었습니다. 로그인 페이지로 이동하시겠습니까?")) {
              navigate("/userlogin");
            }
          } else {
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
        navigate("/userlogin");
      } else {
        window.history.back();
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAlarms(alarmList.map(alarm => alarm.alarmId));
    } else {
      setSelectedAlarms([]);
    }
  };
  const handleConfirmAlarmStatus = async (alarmId) => {
    try {
      // 백엔드 API 호출
      const response = await myAxios(token, setToken).post(`/confirm/${alarmId}`);

      if (response.data) {
        // API 호출 성공 시 상태 업데이트
        setAlarmList(prev =>
          prev.map(alarm =>
            alarm.alarmId === alarmId ? { ...alarm, isRead: !alarm.isRead } : alarm
          )
        );
      } else {
        alert('읽음 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('읽음 상태 변경 실패:', error);

      // 401 에러 처리
      if (error.response?.status === 401) {
        setToken(null);
        if (window.confirm("로그인이 만료되었습니다. 로그인 페이지로 이동하시겠습니까?")) {
          navigate("/userlogin");
        }
      } else {
        alert('읽음 상태 변경 중 오류가 발생했습니다.');
      }
    }
  };

  const handleBulkConfirmAlarms = async () => {
    if (selectedAlarms.length === 0) {
      alert('변경할 알림을 선택해주세요.');
      return;
    }
    try {
      const requestBody = {
        alarmList: selectedAlarms
      };
      const response = await myAxios(token, setToken).post('/confirmAll', requestBody);
      if (response.data) {
        // API 호출 성공 시 상태 업데이트
        setAlarmList(prev =>
          prev.map(alarm =>
            selectedAlarms.includes(alarm.alarmId)
              ? { ...alarm, isRead: true } // 일괄 처리는 모두 읽음으로 처리
              : alarm
          )
        );
        setSelectedAlarms([]);
        alert('선택된 알림이 읽음 처리되었습니다.');
      } else {
        alert('일괄 읽음 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('일괄 읽음 상태 변경 실패:', error);
      // 401 에러 처리
      if (error.response?.status === 401) {
        setToken(null);
        if (window.confirm("로그인이 만료되었습니다. 로그인 페이지로 이동하시겠습니까?")) {
          navigate("/userlogin");
        }
      } else {
        alert('일괄 읽음 처리 중 오류가 발생했습니다.');
      }
    }
  };

  // 알림 종류 변경 핸들러
  const handleAlarmTypeChange = (e) => {
    const value = e.target.value;
    setAlarmType(value);
    setSearch(prev => ({
      ...prev,
      alarmType: value,
      page: 1
    }));
  };

  // 읽음 상태 변경 핸들러
  const handleReadStatusChange = (e) => {
    const value = e.target.value;
    setReadStatus(value);
    setSearch(prev => ({
      ...prev,
      readStatus: value,
      page: 1
    }));
  };

  // 날짜 변경 핸들러
  const onChange = useCallback((dates) => {
    const [start, end] = dates;
    if (start && end) {
      if (end < start) {
        setStartDate(start);
        setEndDate(start);
        return;
      }
    }
    setStartDate(start);
    setEndDate(end);
    setSearch(prev => ({
      ...prev,
      startDate: start ? start.toISOString().split('T')[0] : '',
      endDate: end ? end.toISOString().split('T')[0] : '',
      page: 1
    }));
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setSearch(prev => ({ ...prev, page }));
  };
  const clearDates = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);


  return (
    <div>
      <Header />
      <main className="MyGatherPage_container">
        <aside>
          <Sidebar />
        </aside>
        <section className='MyAlarmList_content_osk'>
          <h1 className="MyAlarmList_page_title_osk">알림 내역</h1>

          {/* Filter Section */}
          <div className="MyAlarmList_filter_section_osk">
            <div className="MyAlarmList_filter_row_osk">
              <div className="MyAlarmList_filter_group_osk">
                <label className="MyAlarmList_filter_label_osk">알림 종류</label>
                <select
                  value={alarmType}
                  onChange={handleAlarmTypeChange}
                  className="MyAlarmList_filter_select_osk"
                >
                  <option value="전체">전체</option>
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
                    onChange={onChange}
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
                  {(startDate || endDate) && (
                    <button
                      type="button"
                      className="MyAlarmList_clear-button_osk"
                      onClick={clearDates}
                      aria-label="Clear dates"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="MyAlarmList_filter_group_osk">
                <label className="MyAlarmList_filter_label_osk">읽음 여부</label>
                <select
                  value={readStatus}
                  onChange={handleReadStatusChange}
                  className="MyAlarmList_filter_select_osk"
                >
                  <option value="전체">전체</option>
                  <option value="true">읽음</option>
                  <option value="false">안읽음</option>
                </select>
              </div>

              <div className="MyAlarmList_filter_actions_osk">
                <button
                  className="MyAlarmList_search_action_button_osk"
                  onClick={handleBulkConfirmAlarms}
                  disabled={loading}
                >
                  선택 읽음 처리
                </button>
              </div>
            </div>
          </div>

          {/* Loading/Error States */}
          {loading && <div className="MyAlarmList_loading_osk">데이터를 불러오는 중...</div>}
          {error && <div className="MyAlarmList_error_osk">{error}</div>}

          {/* Table */}
          <div className="MyAlarmList_table_container_osk">
            <table className="MyAlarmList_table_osk">
              <thead className="MyAlarmList_table_head_osk">
                <tr>
                  <th className="MyAlarmList_table_header_osk">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={alarmList.length > 0 && selectedAlarms.length === alarmList.length}
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
                {alarmList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="MyAlarmList_empty-table_cell_osk MyAlarmList_table_cell_osk">
                      <h4>조회된 알림이 없습니다.</h4>
                      <p>검색 조건을 변경하여 검색해보세요.</p>
                    </td>
                  </tr>
                ) : (
                  alarmList.map((alarm) => (
                    <tr key={alarm.alarmId} className="MyAlarmList_table_row_osk">
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
                        <button className={`MyAlarmList_status_badge_osk ${alarm.isRead ? 'MyAlarmList_status_read_osk' : 'MyAlarmList_status_unread_osk'}`}
                          onClick={() => handleConfirmAlarmStatus(alarm.alarmId)}
                          disabled={alarm.isRead}
                        >
                          {alarm.isRead ? '읽음' : '안읽음'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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