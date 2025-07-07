import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    const loadNoticeDetail = async () => {
      if (!noticeId) {
        setError('공지사항 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await myAxios().get(`/detailNotice?noticeId=${noticeId}`);
        if (!response.ok) {
          throw new Error('공지사항을 불러올 수 없습니다.');
        }

        const data = await response.data;
        setNotice(data.result);
        setError(null);
      } catch (err) {
        console.error('공지사항 로딩 실패:', err);
        setError(err.message);
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };

    loadNoticeDetail();
  }, [noticeId]);

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


  // 로딩 중일 때
  if (loading) {
    return (
      <div className="NoticeDetail_container_osk">
        <Header />
        <main className="NoticeDetail_main_osk">
          <div className="NoticeDetail_content_osk">
            <div className="NoticeDetail_loading_osk">로딩 중...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="NoticeDetail_container_osk">
        <Header />
        <main className="NoticeDetail_main_osk">
          <div className="NoticeDetail_content_osk">
            <div className="NoticeDetail_error_osk">
              <h2>오류가 발생했습니다</h2>
              <p>{error}</p>
              <button className="NoticeDetail_back_button_osk" onClick={navigate('/noticeList')}>
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
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
              <h2>공지사항을 찾을 수 없습니다</h2>
              <button className="NoticeDetail_back_button_osk" onClick={navigate('/noticeList')}>
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
    <div className="NoticeDetail_container_osk">
      <Header />

      <main className="NoticeDetail_main_osk">
        <div className="NoticeDetail_content_osk">
          <div className="NoticeDetail_header_osk">
            <h1 className="NoticeDetail_title_osk">
              {notice.pinYn && <span className="NoticeDetail_pin_badge_osk">[공지] </span>}
              {notice.title}
            </h1>
            <div className="NoticeDetail_meta_osk">
              <div className="NoticeDetail_date_osk">{formatDate(notice.createdAt)}</div>
              {notice.updatedAt && (
                <div className="NoticeDetail_updated_osk">
                  (수정: {formatDate(notice.updatedAt)})
                </div>
              )}
            </div>
          </div>

          <div className="NoticeDetail_notice_card_osk">
            <div className="NoticeDetail_card_header_osk">
              <div className="NoticeDetail_brand_osk">모여링</div>
              <div className="NoticeDetail_main_title_osk">공지사항</div>
              <div className="NoticeDetail_subtitle_osk">
                {notice.pinYn ? '중요 공지사항' : '일반 공지사항'}
              </div>
            </div>

            <div className="NoticeDetail_icon_container_osk">
              <div className="NoticeDetail_notice_icon_osk">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <ellipse cx="40" cy="40" rx="38" ry="38" fill="#6B9BD6" stroke="#4A7BA7" strokeWidth="2" />
                  {notice.pinYn ? (
                    // 고정 공지사항용 아이콘
                    <path d="M35 25L45 25C46.1 25 47 25.9 47 27L47 35L49 37L49 39L31 39L31 37L33 35L33 27C33 25.9 33.9 25 35 25ZM35 41L45 41L45 43C45 44.1 44.1 45 43 45L37 45C35.9 45 35 44.1 35 43L35 41ZM38 47L42 47L42 50L38 50L38 47Z" fill="white" />
                  ) : (
                    // 일반 공지사항용 아이콘
                    <path d="M30 30L50 30C51.1 30 52 30.9 52 32L52 48C52 49.1 51.1 50 50 50L30 50C28.9 50 28 49.1 28 48L28 32C28 30.9 28.9 30 30 30ZM30 35L50 35M33 38L47 38M33 42L47 42M33 46L42 46" stroke="white" strokeWidth="2" fill="none" />
                  )}
                </svg>
              </div>
            </div>

            <div className="NoticeDetail_message_osk">
              <div className="NoticeDetail_message_main_osk">{notice.title}</div>
              <div className="NoticeDetail_message_sub_osk">
                {formatDate(notice.createdAt)} 작성
              </div>
            </div>
          </div>

          <div className="NoticeDetail_content_box_osk">
            <div className="NoticeDetail_content_text_osk">
              {notice.content.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>

          {/* 숨김 처리된 공지사항인 경우 경고 표시 */}
          {notice.isHidden && (
            <div className="NoticeDetail_hidden_warning_osk">
              <p>⚠️ 이 공지사항은 현재 숨김 처리된 상태입니다.</p>
            </div>
          )}

          <div className="NoticeDetail_button_container_osk">
            <button className="NoticeDetail_back_button_osk" onClick={navigate('/noticeList')}>
              목록
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}