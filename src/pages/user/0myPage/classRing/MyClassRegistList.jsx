import React, { useState, useEffect } from 'react';
import styles from './MyClassRegistList.module.css';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { GoPeople } from 'react-icons/go';
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from '../common/Sidebar';
import { tokenAtom, userAtom } from "../../../../atoms";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { myAxios,url } from "../../../../config";
import { useNavigate } from 'react-router-dom';

export default function MyClassList() {
  const TABS = [
    { label: '전체', value: 'all' },
    { label: '수강', value: 'ing' },
    { label: '종료', value: 'fin' },
    { label: '취소', value: 'cancled' },
    { label: '폐강', value: 'closed'}
  ];

  const navigate = useNavigate();
  const [tab, setTab] = useState(TABS[0].value);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useAtom(tokenAtom);
  const [keywords, setKeywords] = useState('');  // 검색어 상태


  const fetchWishlist = async () => {
      try {
        const res = token && await myAxios(token, setToken).get('/user/mypage/myClassRegistList', {
          params: { tab, page, size, keywords },
        });
        console.log('[요청 파라미터]', { tab, page, size, keywords });

        const payload = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : res.data?.content ?? [];
        setItems(payload);
        const tp = res.data?.totalPages;
        setTotalPages(
          tp != null
            ? tp
            : Math.ceil(payload.length / size)
        );
      } catch (err) {
        console.error('결제 목록 조회 실패', err);
          if (err.response) {
            console.error('응답 데이터:', err.response.data);
            console.error('응답 상태:', err.response.status);
          }
      } finally {
        setLoading(false);
      }
    };
    // 탭, 페이지, 검색어가 바뀔 때마다 재조회
    useEffect(() => {
      fetchWishlist();
  }, [token, tab, page]);

    // 현재 페이지 가져오기 (state.page 는 0-based라면 +1 처리)
  const getCurrentPage = () => page + 1;

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    // 범위 체크
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage - 1); // state.page 는 0-based
  };
    // 검색 버튼 핸들러
  const handleSearchClick = () => {
    setPage(0);
    fetchWishlist();
  };

  //결제내역 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  return (
    <>
      <Header />

      <main className={styles.classContent}>
        <aside className={styles.sidebarArea}>
          <Sidebar />
        </aside>
        <section className={styles.calendarArea}>
        <h2 className={styles.pageTitle}>수강 클래스 목록</h2>

            <div className={styles.tabs}>
              <div className={styles.tabsDiv}>
              {TABS.map(t => (
                <button
                  key={t.value}
                  className={`${styles.tab} ${tab === t.value ? styles.active : ''}`}
                  onClick={() => { setTab(t.value); setPage(0); setKeywords(''); }}
                >
                  {t.label}
                </button>
              ))}
              </div>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="제목으로 검색"
                  value={keywords}
                  onChange={e => { setKeywords(e.target.value); setPage(0); }}
                  className={styles.searchInput}
                />
                <button
                  type="button"
                  className={styles.searchBtn}
                  onClick={handleSearchClick}
                >
                  검색
                </button>
              </div>
            </div>
        <div className={styles.classList}>
          {(items.length === 0) && 
          <div className={styles.noneDiv}>
            <div className={styles.classNone}>
              <h4 className={styles.classH4}>조회된 목록이 없습니다</h4>
              <p>검색 조건을 변경해보세요.</p>
            </div>
          </div>
          }
          {items.map((cls) => (
            <div key={cls.paymentId} className={`${styles.classCard} ${styles[cls.bgColor]}`}>
              <div className={styles.cardLeft}>
                <img src={`${url}/image?filename=${cls.imageUrl}`} alt={cls.classTitle} className={styles.classImage} />
              </div>
              <div className={styles.cardRight} 
                  onClick={ 
                    () => navigate(`/class/classRingDetail/${cls.hostClassId}`)
                    }
              >
                <div className={styles.cardHeader}>
                  {cls.paymentStatus === "결제완료" && cls.status === "모집중" ? (
                    <span className={styles.statusBadge}>모집중</span>
                  ) : cls.paymentStatus === "결제완료" && cls.status === "모집마감" ? (
                    <span className={styles.statusBadge}>개강확정</span>
                  ) : cls.paymentStatus === "결제완료" && cls.status === "폐강" ? (
                    <span className={styles.statusBadge}>폐강</span>
                  ) : cls.paymentStatus === "결제완료" && cls.status === "종료" ? (
                    <span className={styles.statusBadge}>종료</span>
                  ) : cls.paymentStatus === "취소" ? (
                    <span className={styles.statusBadge}>수강취소</span>
                  ) : null}
                  <h3 className={styles.classTitle}>{cls.classTitle}</h3>
                </div>
                <div className={styles.infoRow}><CiCalendar /> [수업일] {cls.startDate} {cls.scheduleStart && cls.scheduleEnd && (
                            ` ${cls.scheduleStart.slice(0,5)}~${cls.scheduleEnd.slice(0,5)}`
                          )} </div>
                <div className={styles.infoRow}><CiLocationOn /> [장소] {cls.addr} {cls.locName}</div>
                <div className={styles.infoRow}><GoPeople /> [인원] {cls.regCnt}/{cls.max}명 (최소인원 {cls.min}명)</div>
                <div className={styles.tagList}>
                </div>
                <div className={styles.actions}>
                  {cls?.itemsName && (
                      <a
                        href={`${url}/filedown?filename=${cls.itemsName}`}
                        download
                        className={styles.actionBtn}
                        onClick={e => {
                          e.stopPropagation();   // 상위 onClick 전파 방지
                        }}
                      >
                        강의자료 다운
                      </a>
                    )}
                    <button
                      className={styles.actionBtn}
                      onClick={e => {
                        e.stopPropagation();
                        setModalData(cls);
                        setModalOpen(true);
                      }}
                    >
                      결제내역
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          {/* 이전 그룹 혹은 이전 페이지로 */}
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(getCurrentPage() - 1)}
            disabled={getCurrentPage() === 1}
          >
            &lt;
          </button>

          {/* 페이지 숫자 그룹 (5개씩) */}
          {(() => {
            const current = getCurrentPage();
            const groupIndex = Math.floor((current - 1) / 5);
            const startPage = groupIndex * 5 + 1;
            const endPage = Math.min(startPage + 4, totalPages);
            const buttons = [];

            for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
              buttons.push(
                <button
                  key={pageNum}
                  className={`${styles.pageBtn} ${
                    current === pageNum ? styles.pageBtnActive : ''
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={current === pageNum}
                >
                  {pageNum}
                </button>
              );
            }

            return buttons;
          })()}

          {/* 다음 그룹 혹은 다음 페이지로 */}
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(getCurrentPage() + 1)}
            disabled={getCurrentPage() === totalPages}
          >
            &gt;
          </button>
        </div>
        
      </section>
      </main>
      <Footer />
      {/* ===== inline Modal ===== */}
      {modalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <h3>결제 내역</h3>
            <ul className={styles.modalList}>
              <li>상품명: {modalData.classTitle}</li>
              <li>결제일시: {new Date(modalData.paidAt).toLocaleString()}</li>
              <li>결제금액: {modalData.amount.toLocaleString()}원</li>
              <li>결제수단: {modalData.paymentType}</li>
              <li>주문번호: {modalData.orderNo}</li>
              {modalData.canceledAt && (
                <li>취소일시: {new Date(modalData.canceledAt).toLocaleString()}</li>
              )}
              {/* 필요시 쿠폰/할인 정보 등 추가 */}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
