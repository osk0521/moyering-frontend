import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from "../../components/Footer";
import './NoticeDetail.css';
import { myAxios, url } from "../../config";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { tokenAtom, userAtom, alarmsAtom } from "../../atoms";

export default function NoticeDetail() {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);

  // 공지사항 상세 데이터 로딩
  const loadNoticeDetail = useCallback(async () => {
    if (!noticeId) {
      setError('공지사항 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // GET 요청으로 쿼리 파라미터 전달
      const response = await myAxios().get(`/detailNotice?noticeId=${noticeId}`);
      const data = response.data;
      
      // 응답 데이터 검증
      if (data && typeof data === 'object' && data.result) {
        setNotice(data.result);
      } else {
        throw new Error('공지사항 데이터를 불러올 수 없습니다.');
      }
      
    } catch (err) {
      console.error('공지사항 로딩 실패:', err);
      
      // 에러 상세 정보 로깅
      if (err.response) {
        console.error('Response error:', err.response.status, err.response.data);
        
        // 401 에러 처리 (토큰 만료)
        if (err.response.status === 401) {
          setToken(null);
          setUser(null);
          navigate('/login');
          return;
        }
        
        // 404 에러 처리 (공지사항 없음)
        if (err.response.status === 404) {
          setError('존재하지 않는 공지사항입니다.');
        } else if (err.response.status === 400) {
          setError('잘못된 요청입니다.');
        } else {
          setError('서버 오류가 발생했습니다.');
        }
      } else if (err.request) {
        console.error('Request error:', err.request);
        setError('네트워크 연결을 확인해주세요.');
      } else {
        console.error('Error:', err.message);
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      }
      
      setNotice(null);
    } finally {
      setLoading(false);
    }
  }, [noticeId, setToken, setUser, navigate]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadNoticeDetail();
  }, [loadNoticeDetail]);

  // 목록으로 돌아가기 핸들러
  const handleBackToList = useCallback(() => {
    navigate('/noticeList');
  }, [navigate]);

  // 날짜 포맷팅 함수
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // 공지사항 제목 렌더링
  const renderTitle = useCallback((notice) => {
    return (
      <>
        {notice.pinYn && <span className="NoticeDetail_pin_badge_osk">[공지] </span>}
        {notice.title || '제목 없음'}
      </>
    );
  }, []);

  // 공지사항 내용 렌더링
  const renderContent = useCallback((content) => {
    if (!content) return <div>내용이 없습니다.</div>;
    
    return content.split('\n').map((line, index) => (
      <div key={index} className="NoticeDetail_content_line_osk">
        {line || '\u00A0'} {/* 빈 줄 처리 */}
      </div>
    ));
  }, []);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="NoticeDetail_container_osk">
        <Header />
        <main className="NoticeDetail_main_osk">
          <div className="NoticeDetail_content_osk">
            <div className="NoticeDetail_loading_osk">
              <div className="NoticeDetail_loading_spinner_osk"></div>
              <span>로딩 중...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <>
      <Header />
        <div className="NoticeDetail_container_osk">
          <main className="NoticeDetail_main_osk">
            <div className="NoticeDetail_content_osk">
              <div className="NoticeDetail_error_osk">
                <div className="NoticeDetail_error_icon_osk">⚠️</div>
                <h2 className="NoticeDetail_error_title_osk">오류가 발생했습니다</h2>
                <p className="NoticeDetail_error_message_osk">{error}</p>
                <div className="NoticeDetail_error_actions_osk">
                  <button 
                    className="NoticeDetail_retry_button_osk" 
                    onClick={loadNoticeDetail}
                  >
                    다시 시도
                  </button>
                  <button 
                    className="NoticeDetail_back_button_osk" 
                    onClick={handleBackToList}
                  >
                    목록으로 돌아가기
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      <Footer />
      </>
    );
  }

  // 공지사항이 없을 때
  if (!notice) {
    return (
      <div className="NoticeDetail_container_osk">
        <Header />
        <main className="NoticeDetail_main_osk">
          <div className="NoticeDetail_content_osk">
            <div className="NoticeDetail_error_osk">
              <div className="NoticeDetail_error_icon_osk">📋</div>
              <h2 className="NoticeDetail_error_title_osk">공지사항을 찾을 수 없습니다</h2>
              <p className="NoticeDetail_error_message_osk">
                요청하신 공지사항이 존재하지 않거나 삭제되었을 수 있습니다.
              </p>
              <button 
                className="NoticeDetail_back_button_osk" 
                onClick={handleBackToList}
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    
      <>
      <Header />
    <div className="NoticeDetail_container_osk">

      <main className="NoticeDetail_main_osk">
        <div className="NoticeDetail_content_osk">
          {/* 헤더 섹션 */}
          <div className="NoticeDetail_header_section_osk">
            {/* <div className="NoticeDetail_breadcrumb_osk">
              <span onClick={handleBackToList} className="NoticeDetail_breadcrumb_link_osk">
                공지사항
              </span>
              <span className="NoticeDetail_breadcrumb_separator_osk"> &gt; </span>
              <span className="NoticeDetail_breadcrumb_current_osk">상세보기</span>
            </div> */}
            <h1 className="NoticeDetail_title_osk">
              {renderTitle(notice)}
            </h1>
            <div className="NoticeDetail_meta_osk">
              <div className="NoticeDetail_date_info_osk">
                <span className="NoticeDetail_date_label_osk">작성일:</span>
                <span className="NoticeDetail_date_value_osk">
                  {formatDate(notice.createdAt)}
                </span>
              </div>
              {notice.updatedAt && notice.updatedAt !== notice.createdAt && (
                <div className="NoticeDetail_date_info_osk">
                  <span className="NoticeDetail_date_label_osk">수정일:</span>
                  <span className="NoticeDetail_date_value_osk">
                    {formatDate(notice.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 공지사항 카드 */}
          <div>
            <div className="NoticeDetail_card_header_osk">
              <div className="NoticeDetail_brand_osk">모여링</div>
              <div className="NoticeDetail_main_title_osk">공지사항</div>
            </div>

            <div className="NoticeDetail_message_osk">
              <div className="NoticeDetail_message_main_osk">{notice.title || '제목 없음'}</div>
              <div className="NoticeDetail_message_sub_osk">
                {formatDate(notice.createdAt)} 작성
              </div>
            </div>
          </div>
          {/* 내용 섹션 */}
          <div className="NoticeDetail_content_section_osk">
            <div className="NoticeDetail_content_box_osk">
              <div className="NoticeDetail_content_text_osk">
                {renderContent(notice.content)}
              </div>
            </div>
          </div>

          {/* 숨김 처리된 공지사항인 경우 경고 표시 */}
          {notice.isHidden && (
            <div className="NoticeDetail_hidden_warning_osk">
              <div className="NoticeDetail_warning_icon_osk">⚠️</div>
              <p className="NoticeDetail_warning_text_osk">
                이 공지사항은 현재 숨김 처리된 상태입니다.
              </p>
            </div>
          )}

          {/* 버튼 컨테이너 */}
          <div className="NoticeDetail_button_container_osk">
            <button 
              className="NoticeDetail_back_button_osk" 
              onClick={handleBackToList}
            >
              목록
            </button>
          </div>
        </div>
      </main>

    </div>
      <Footer />
      </>
  );
}