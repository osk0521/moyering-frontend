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
  //취소내역 모달  
  const [modalOpen2, setModalOpen2] = useState(false);
  const [modalData2, setModalData2] = useState(null);

  //결제 취소
  const handleCancelClass = async (cls) => {
    const confirmCancel = window.confirm(`'${cls.classTitle}' 수강을 정말 취소하시겠습니까? 쿠폰은 환불되지 않습니다.`);
    if (!confirmCancel) return;

    try {
      const res = await myAxios(token, setToken).put(`/user/class/cancel/${cls.paymentId}`);
      alert('수강이 취소되었습니다.');
      fetchWishlist(); // 목록 새로고침
    } catch (error) {
      console.error('수강 취소 실패', error);
      alert('수강 취소 중 오류가 발생했습니다.');
    }
  };
  const isCancelable = (startDateStr) => {
    const today = new Date();
    const classDate = new Date(startDateStr); // e.g., "2025-07-18"
    
    // 수업일로부터 2일 전 자정
    const cancelDeadline = new Date(classDate);
    cancelDeadline.setDate(cancelDeadline.getDate() - 2);
    cancelDeadline.setHours(0, 0, 0, 0);

    return today < cancelDeadline;
  };
  
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
                  ) : cls.paymentStatus === "취소됨" ? (
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
                    {cls.paymentStatus==="결제완료" ? (
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
                    ) : (
                      <button
                        className={styles.actionBtn}
                        onClick={e => {
                          e.stopPropagation();
                          setModalData2(cls);
                          setModalOpen2(true);
                        }}
                      >
                        취소내역
                      </button>
                    )}

                    {cls.paymentStatus==="결제완료"&& isCancelable(cls.startDate) && (
                      <button
                        className={styles.actionBtn2}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelClass(cls);
                        }}
                      >
                        수강취소
                      </button>
                    )}
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
      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>×</button>
            <h3 className={styles.modalTitle}>결제 내역</h3>
            
            <div className={styles.modalRow}>
              <span>클래스명</span>
              <span>{modalData.classTitle}</span>
            </div>
            <div className={styles.modalRow}>
              <span>결제 시간</span>
              <span>{new Date(modalData.paidAt).toLocaleString()}</span>
            </div>
            <div className={styles.modalRow}>
              <span>결제 정보</span>
              <span>{modalData.paymentType}</span>
            </div>

            <hr className={styles.modalDivider}/>


            {modalData.couponName!=="쿠폰없음" && (
              <>
              <div className={styles.modalRow}>
                <span>상품 금액</span>
                <span className={styles.blue}>₩{modalData.classPrice?.toLocaleString() || '—'}원</span>
              </div>
              <div className={styles.modalRow}>
                <span>할인 ({modalData.couponName} 쿠폰 적용)</span>
                <span className={styles.red}>
                  -₩
                  {(
                    (modalData.classPrice ?? 0) - (modalData.amount ?? 0)
                  ).toLocaleString()}원
                </span>
              </div>
              </>
            )}


            <hr className={styles.modalDivider}/>

            <div className={`${styles.modalRow} ${styles.totalRow}`}>
              <span>최종 결제 금액</span>
              <span className={styles.bold}>₩{modalData.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}


      {modalOpen2 && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen2(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalOpen2(false)}>×</button>
            <h3 className={styles.modalTitle}>결제 및 취소 내역</h3>
            
            <div className={styles.modalRow}>
              <span>클래스명</span>
              <span>{modalData2.classTitle}</span>
            </div>
            <div className={styles.modalRow}>
              <span>결제 시간</span>
              <span>{new Date(modalData2.paidAt).toLocaleString()}</span>
            </div>
            <div className={styles.modalRow}>
              <span>취소 시간</span>
              <span>{new Date(modalData2.canceledAt).toLocaleString()}</span>
            </div>
            <div className={styles.modalRow}>
              <span>결제 정보</span>
              <span>{modalData2.paymentType}</span>
            </div>

            <hr className={styles.modalDivider}/>

            {modalData2.couponName!=="쿠폰없음" && (
              <>
              <div className={styles.modalRow}>
                <span>상품 금액</span>
                <span className={styles.blue}>₩{modalData2.classPrice?.toLocaleString() || '—'}원</span>
              </div>
              <div className={styles.modalRow}>
                <span>할인 ({modalData2.couponName} 쿠폰 적용)</span>
                <span className={styles.red}>
                  -₩
                  {(
                    (modalData2.classPrice ?? 0) - (modalData2.amount ?? 0)
                  ).toLocaleString()}원
                </span>
              </div>
              </>
            )}


            <hr className={styles.modalDivider}/>

            <div className={`${styles.modalRow} ${styles.totalRow}`}>
              <span>최종 결제 금액</span>
              <span>₩{modalData2.amount.toLocaleString()}</span>
            </div>
            <div className={`${styles.modalRow} ${styles.totalRow}`}>
              <span>최종 환불 금액</span>
              <span className={styles.bold}>₩{modalData2.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
