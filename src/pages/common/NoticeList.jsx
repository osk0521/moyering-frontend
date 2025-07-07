import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from "../../components/Footer";
import './NoticeList.css';
import logoImage from "/logo.png";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { tokenAtom, userAtom, alarmsAtom } from "../../atoms";
import { myAxios, url } from "../../config";

export default function NoticeList() {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);
  const [loading, setLoading] = useState(false);
  
  const [noticeList, setNoticeList] = useState([]);

  // 페이지네이션 관련 상태
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1
  }); 
  const [page, setPage] = useState(1);
  const handlePageChange = useCallback((page) => {
    setPage(prev => ({ ...prev, page }));
  }, []);
  // 데이터 로딩 함수
const loadNoticeList = useCallback(async (page) => {
  setLoading(true);
  try {
      const requestData = {
        page: page,
      };

      const response = await myAxios().post('/noticeList', requestData);
  
    const data = response.data;
    
    // 응답 데이터 검증
    if (data && typeof data === 'object') {
      setNoticeList(data.alarmList || []);
      setPageInfo(data.pageInfo || {
        curPage: 1,
        allPage: 1,
        startPage: 1,
        endPage: 1
      });
    } else {
      console.warn('예상하지 못한 응답 형태:', data);
      setNoticeList([]);
    }
    
  } catch (error) {
    console.error('공지사항 로딩 실패:', error);
    
    // 에러 상세 정보 로깅
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    
    setNoticeList([]);
    setPageInfo({
      curPage: 1,
      allPage: 1,
      startPage: 1,
      endPage: 1
    });
    
  } finally {
    setLoading(false);
  }
}, [page]); // 의존성 배열에 필요한 값들 추가

  // 컴포넌트 마운트 시 첫 페이지 로딩
  useEffect(() => {
    loadNoticeList(1);
  }, [loadNoticeList]);


  // 공지사항 클릭 핸들러
  const handleNoticeClick = (noticeId) => {
    navigate(`/notice/${noticeId}`);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 페이지 번호 배열 생성
  const generatePageNumbers = () => {
    const pages = [];
    for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 고정 공지 표시 함수
  const renderTitle = (notice) => {
    return (
      <span className={notice.pinYn ? 'NoticeList_pinned_osk' : ''}>
        {notice.pinYn && <span className="NoticeList_pin_icon_osk">[공지] </span>}
        {notice.title || ''}
      </span>
    );
  };

  return (
    <div className="NoticeList_container_osk">
      <Header />
      
      <main className="NoticeList_main_osk">
        <div className="NoticeList_content_osk">
          <h1 className="NoticeList_title_osk">공지사항</h1>
          
          {loading && (
            <div className="NoticeList_loading_osk">로딩 중...</div>
          )}
          
          <div className="NoticeList_table_wrapper_osk">
            <table className="NoticeList_table_osk">
              <thead className="NoticeList_thead_osk">
                <tr>
                  <th className="NoticeList_th_number_osk">번호</th>
                  <th className="NoticeList_th_title_osk">제목</th>
                  <th className="NoticeList_th_date_osk">작성일</th>
                </tr>
              </thead>
              <tbody className="NoticeList_tbody_osk">
                {noticeList.length > 0 ? (
                  noticeList.map((notice, index) => (
                    <tr 
                      key={notice.noticeId} 
                      className={`NoticeList_tr_osk ${notice.pinYn ? 'NoticeList_tr_pinned_osk' : ''}`}
                      onClick={() => handleNoticeClick(notice.noticeId)}
                    >
                      <td className="NoticeList_td_number_osk">
                        {notice.pinYn ? '📌' : notice.noticeId}
                      </td>
                      <td className="NoticeList_td_title_osk">
                        {renderTitle(notice)} 
                      </td>
                      <td className="NoticeList_td_date_osk">
                        {formatDate(notice.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  !loading && (
                    <tr>
                      <td colSpan="3" className="NoticeList_no_data_osk">
                        등록된 공지사항이 없습니다.
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {pageInfo.allPage > 1 && (
            <div className="NoticeList_pagination_osk">
              {pageInfo.curPage > 1 && (
                <button
                  className="NoticeList_pagination_btn_osk NoticeList_pagination_prev_osk"
                  onClick={() => handlePageChange(pageInfo.curPage - 1)}
                  disabled={loading}
                >
                  〈
                </button>
              )}
              {generatePageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  className={`NoticeList_pagination_btn_osk ${
                    pageNum === pageInfo.curPage ? 'NoticeList_pagination_active_osk' : ''
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              ))}
              {pageInfo.curPage < pageInfo.allPage && (
                <button
                  className="NoticeList_pagination_btn_osk NoticeList_pagination_next_osk"
                  onClick={() => handlePageChange(pageInfo.curPage + 1)}
                  disabled={loading}
                >
                  〉
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}