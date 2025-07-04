import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './ClassInquiry.module.css';
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from '../common/Sidebar';
import { tokenAtom, userAtom } from "../../../../atoms";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { myAxios,url } from "../../../../config";

export default function ClassInquiry() {
  const [activeTab, setActiveTab] = useState('pending');
  const [completedPage, setCompletedPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [token, setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);

  const [completedInquries, setCompletedInquries] = useState([]);
  const [pendindInquries, setPendingInquries] = useState([]);
  const [completedTotalPages, setCompletedTotalPages] = useState(1);
  const [pendindTotalPages, setPendindTotalPages] = useState(1);
  
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [keywords, setkeywords] = useState(null);
  const [openInquiryId, setOpenInquiryId] = useState(null);
  const [contents, setContents] = useState({});

  useEffect(() => {
    const fetchInquries = async () => {
      const page = activeTab === 'pending' ? pendingPage : completedPage;
      try {
        const res = token && await myAxios(token, setToken).post(`/user/mypage/inquiry-list/${activeTab}`, {
          tab: activeTab,
          page: page - 1,
          size: 5,
          startDate: minDate,
          endDate: maxDate,
        });

        if (!res || !res.data) {
          console.error("응답이 없습니다.");
          return;
        }

        console.log("응답 확인:", res.data); // 디버깅 로그 추가

        if (activeTab === 'pending') {
          setPendingInquries(res.data.content || []);
          setPendindTotalPages(res.data.totalPages || 1);
        } else {
          setCompletedInquries(res.data.content || []);
          setCompletedTotalPages(res.data.totalPages || 1);
        }

      } catch (err) {
        console.error('질문 불러오기 실패:', err);
      }
    };

    fetchInquries();
  }, [activeTab, pendingPage, completedPage, minDate, maxDate,token,keywords]);

  const data = activeTab === 'pending' ? pendindInquries : completedInquries;
  const totalPages = activeTab === 'pending' ? pendindTotalPages : completedTotalPages;

  const inquiries = [
    { id: 1, classTitle: '클래스 A', date: '2025-06-22', question: '준비물이 뭔가요?', answer: '' },
    { id: 2, classTitle: '클래스 B', date: '2025-06-20', question: '장소가 어디인가요?', answer: '강남역 근처입니다.' },
    { id: 3, classTitle: '클래스 C', date: '2025-06-18', question: '주차 가능한가요?', answer: '' },
    { id: 4, classTitle: '클래스 D', date: '2025-06-15', question: '강사님은 누구인가요?', answer: '홍길동 강사님입니다.' },
  ];

  
  const toggleAccordion = (id) => {
    setOpenInquiryId((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (newPage) => {
    if (activeTab === 'pending') {
      setPendingPage(newPage);

    } else {
      setCompletedPage(newPage);
    }
  };
  return (
    <>
      <Header />
      <main className={styles.classInquiryLayout}>
          <aside className={styles.sidebarArea}>
            <Sidebar />
          </aside>

        <section className={styles.classInquiryPage}>
          <h2 className={styles.pageTitle}>클래스 질문내역</h2>

          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'pending' ? styles.tabButtonActive : ''}`}
              onClick={() => {
                setActiveTab('pending');
                setPendingPage(1);
              }}
            >
              답변 대기 중인 질문
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'completed' ? styles.tabButtonActive : ''}`}
              onClick={() => {
                setActiveTab('completed');
                setCompletedPage(1);
              }}
            >
              답변된 질문
            </button>
          </div>
            <div className={styles.datepickerWrap}>
              
            <label className={styles.label}>시작일:</label>
            <input
              type="date"
              value={minDate}
              onChange={(e) => {
                setMinDate(e.target.value);
                setWritablePage(1);
                setDonePage(1);
              }}
              className={styles.dateInput}
            />
            <label className={styles.label}>종료일:</label>
            <input
              type="date"
              value={maxDate}
              onChange={(e) => {
                setMaxDate(e.target.value);
                setWritablePage(1);
                setDonePage(1);
              }}
              className={styles.dateInput}
            />
            <button
              className={styles.resetButton}
              onClick={() => {
                setMinDate(null);
                setMaxDate(null);
                setPendingPage(1);
                setCompletedPage(1);
              }}
            >
              초기화
            </button>
            </div>
              <div>
                {data.map((item) => (
                  <div
                    key={item.inquiryId}
                    className={`${styles.reviewBox} ${activeTab === 'compeleted' ? styles.reviewBoxDone : ''}`}
                  >
    
                    <>
                      <div className={styles.accordionHeader} onClick={() => toggleAccordion(item.inquiryId)}>
                        <p>
                          <strong>{item.className}</strong> | 문의일: {item.inquiryDate}
                        </p>
                        <span>{openInquiryId === item.inquiryId ? '▲' : '▼'}</span>
                      </div>
                      <div>
                        <p className={styles.inContent}>{item.content}</p>
                      </div>
                    </>
    
                    {openInquiryId === item.inquiryId && (
                      <div className={styles.accordionBody}>
                        {item.iqResContent ? (
                          <div className={styles.teacherReply}>
                            <p><strong>{item.hostName}</strong> ({item.responseDate})</p>
                            <p>{item.iqResContent}</p>
                          </div>
                        ) : (<div className={styles.penindMsg}>
                                답변을 대기 중입니다.
                            </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
    
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(getCurrentPage() - 1)}
                disabled={getCurrentPage() === 1}
              >
                &lt;
              </button>

              {
                (() => {
                  const pageGroup = Math.floor((getCurrentPage() - 1) / 5); // 0부터 시작
                  const startPage = pageGroup * 5 + 1;
                  const endPage = Math.min(startPage + 4, totalPages);
                  const buttons = [];

                  for (let i = startPage; i <= endPage; i++) {
                    buttons.push(
                      <button
                        key={i}
                        className={`${styles.pageBtn} ${getCurrentPage() === i ? styles.pageBtnActive : ""}`}
                        onClick={() => handlePageChange(i)}
                        disabled={getCurrentPage() === i}
                      >
                        {i}
                      </button>
                    );
                  }

                  return buttons;
                })()
              }

              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(getCurrentPage() + 1)}
                disabled={getCurrentPage() === totalPages}
              >
                &gt;
              </button>
            </div>
    
              </div>                    
        </section>
      </main>
      <Footer />
    </>
  );

  function getCurrentPage() {
    return activeTab === 'pending' ? pendingPage : completedPage;
  }
}
