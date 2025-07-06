import React, { useState, useEffect } from 'react';
import styles from './MyWishlist.module.css';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { GoPeople } from 'react-icons/go';
import { FaHeart } from 'react-icons/fa';
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from '../common/Sidebar';
import { tokenAtom, userAtom } from "../../../../atoms";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { myAxios,url } from "../../../../config";
import { IoTimeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


export default function MyWishlist() {
  const TABS = [
    { label: '클래스링', value: 'classRing' },
    { label: '게더링', value: 'gathering' },
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
    setLoading(true);
    try {
      const res = token && await myAxios(token, setToken).get('/user/mypage/wishlist', {
        params: { tab, page, size, keywords },
      });
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
      console.error('찜 목록 조회 실패', err);
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
  return (
    <>
      <Header />
      <main className={styles.wishlistPage}>
        <aside className={styles.sidebarArea}>
          <Sidebar />
        </aside>

          <section className={styles.wishlistContent}>
            <h2 className={styles.pageTitle}>찜 목록</h2>

            {/* 탭 */}
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
              {/* 검색창 */}
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
            

            {/* 로딩 표시 */}
            {loading && <div>불러오는 중…</div>}

            {/* 리스트 */}
            <div className={styles.wishlistList}>
              {items.map(item => (
                <div key={item.id} className={styles.card}
                              onClick={() => navigate(`/class/classRingDetail/${item.typeId}`)}>
                  <div className={styles.cardLeft}>
                    <img
                      src={`${url}/image?filename=${item.imageUrl}`}
                      alt={item.title}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.cardRight}>
                    <div className={styles.header}>
                      <h3 className={styles.title}>{item.title}</h3>
                    </div>
                    { items.type === "classRing" ? (
                      <>
                        <div className={styles.info}>
                        <CiCalendar /> [가장 빠른 수업일]  {item.date}
                        </div>
                        <div className={styles.info}>
                          <IoTimeOutline /> [수업시간]
                          {item.startTime && item.endTime && (
                            ` ${item.startTime.slice(0,5)}~${item.endTime.slice(0,5)}`
                          )}                    </div>
                        <div className={styles.info}>
                          <CiLocationOn /> [장소] {item.addr}{item.detail_addr && `, ${item.detail_addr}`}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.info}>
                        <CiCalendar /> [모임일자]  {item.date}
                        </div>
                        <div className={styles.info}>
                          <IoTimeOutline /> [모임시간]
                          {item.startTime && item.endTime && (
                            ` ${item.startTime.slice(0,5)}~${item.endTime.slice(0,5)}`
                          )}                    </div>
                        <div className={styles.info}>
                          <CiLocationOn /> [장소] {item.addr}{item.detail_addr && `, ${item.detail_addr}`}
                        </div>
                      </>
                    )}
                    
                  </div>
                  <div className={styles.heart}>
                    <FaHeart color="#f87171" size={25} />
                  </div>
                </div>
              ))}
              {(items.length === 0) && 
              <div className={styles.noneDiv}>
                <div className={styles.classNone}>
                  <h4 className={styles.classH4}>조회된 목록이 없습니다</h4>
                  <p>검색 조건을 변경하거나 새로운 찜을 눌러보세요. 꾹~!</p>
                </div>
              </div>
              }
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
    </>
  );
}
