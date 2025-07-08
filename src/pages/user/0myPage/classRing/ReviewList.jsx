import React, { useState, useEffect } from 'react';
import styles from './ReviewList.module.css';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from '../common/Sidebar';
import { tokenAtom, userAtom } from "../../../../atoms";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { myAxios,url } from "../../../../config";


export default function ReviewList() {
  const [activeTab, setActiveTab] = useState('writable');
  const [writablePage, setWritablePage] = useState(1);
  const [donePage, setDonePage] = useState(1);
  const [token, setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);

  const [writableReviews, setWritableReviews] = useState([]);
  const [doneReviews, setDoneReviews] = useState([]);
  const [writableTotalPages, setWritableTotalPages] = useState(1);
  const [doneTotalPages, setDoneTotalPages] = useState(1);

  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [openReviewId, setOpenReviewId] = useState(null);
  const [ratings, setRatings] = useState({});
  const [contents, setContents] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      const page = activeTab === 'writable' ? writablePage : donePage;
      try {
        const res = token && await myAxios(token, setToken).post(`/user/mypage/reviewList/${activeTab}`, {
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

        if (activeTab === 'writable') {
          setWritableReviews(res.data.content || []);
          setWritableTotalPages(res.data.totalPages || 1);
        } else {
          setDoneReviews(res.data.content || []);
          setDoneTotalPages(res.data.totalPages || 1);
        }

      } catch (err) {
        console.error('후기 불러오기 실패:', err);
      }
    };

    fetchReviews();
  }, [activeTab, writablePage, donePage, minDate, maxDate,token]);

  const handlePageChange = (newPage) => {
    if (activeTab === 'writable') {
      setWritablePage(newPage);

    } else {
      setDonePage(newPage);
    }
  };

  const toggleAccordion = (id) => {
    setOpenReviewId((prev) => (prev === id ? null : id));
  };

  const handleRating = (id, value) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
  };

  const data = activeTab === 'writable' ? writableReviews : doneReviews;
  const dateKey = activeTab === 'writable' ? 'classDate' : 'reviewDate';
  const totalPages = activeTab === 'writable' ? writableTotalPages : doneTotalPages;

  const [previewImages, setPreviewImages] = useState({});
  const handleImageChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({
          ...prev,
          [id]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 후기등록 (사진과 함께~)
  const handleSubmitReview = async(item) => {
    const formData = new FormData();
    formData.append("content", contents[item.calendarId] || "");
    formData.append("star", ratings[item.calendarId]);
    formData.append("calendarId", item.calendarId);
    formData.append("hostId", item.hostId);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    if (images[item.calendarId]) {
      formData.append("reviewImg", images[item.calendarId]);
    }

    try {
      token && await myAxios(token, setToken).post("/user/mypage/write-review", formData);
      setActiveTab("done");
      setDonePage(1);
      } catch (err) {
        console.error("후기 등록 실패:", err);
      }
    };
    

  

  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <aside className={styles.sidebarArea}>
          <Sidebar />
        </aside>
        <section className={styles.section}>
          <h2 className={styles.title}>클래스 후기</h2>
          <div className={styles.tabDiv}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'writable' ? styles.tabButtonActive : ''}`}
              onClick={() => {
                setActiveTab('writable');
                setWritablePage(1);
              }}
            >
              작성 가능한 후기
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'done' ? styles.tabButtonActive : ''}`}
              onClick={() => {
                setActiveTab('done');
                setDonePage(1);
              }}
            >
              작성 완료한 후기
            </button>
          </div>

          <div className={styles.filterRow}>
            <label className={styles.label}>수강일</label>
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
            <label className={styles.label}>~</label>
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
                setWritablePage(1);
                setDonePage(1);
              }}
            >
              초기화
            </button>
          </div>
          </div>

          <div>
            {data.length === 0 && <p className={styles.noneCoupon}>후기 내역이 없습니다.</p>}
            {data.map((item) => (
              <div
                key={item.reviewId || item.calendarId}
                className={`${styles.reviewBox} ${activeTab === 'done' ? styles.reviewBoxDone : ''}`}
              >

                {activeTab==='done' ? (
                  <>
                  <div className={styles.accordionHeader} onClick={() => { if (item.teacherReply) toggleAccordion(item.reviewId || item.calendarId);}}>
                    <p>
                      <strong>{item.classTitle}</strong> | 수강일: {item[dateKey]}
                    </p>
                    {item.teacherReply && (<span>{openReviewId === (item.reviewId || item.calendarId) ? '▲' : '▼'}</span>)}
                  </div>
                  <div className={styles.reviewDone}>
                    <img src={`${url}/image?filename=${encodeURIComponent(item.reviewImgName)}`} alt="후기 이미지" className={styles.mainImage} />
                    <div className={styles.reviewBB}>
                      <div className={styles.starDisplay}>
                        {[...Array(5)].map((_, i) =>
                          i < item.star ? (
                            <FaStar key={i} className={styles.star} />
                          ) : (
                            <FaRegStar key={i} className={styles.star} />
                          )
                        )}
                      </div>
                      <p className={styles.reviewContent}>{item.content}</p>
                    </div>
                  </div>
                  </>
                ) : (<>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion(item.reviewId || item.calendarId)}>
                    <p>
                      <strong>{item.classTitle}</strong> | 수강일: {item[dateKey]}
                    </p>
                    <span>{openReviewId === (item.reviewId || item.calendarId) ? '▲' : '▼'}</span>
                  </div>
                </>)}

                {openReviewId === (item.reviewId || item.calendarId) && (
                  <div className={styles.accordionBody}>
                    {activeTab === 'writable' ? (
                    <>
                      <div className={styles.contentForm}>
                      {previewImages[item.calendarId] && (
                          <img
                            src={previewImages[item.calendarId]}
                            alt="미리보기"
                            className={styles.imagePreview}
                          />
                        )}
                      <textarea
                        placeholder="이 클래스는 어땠나요? 후기를 남겨주세요 😊"
                        className={styles.textarea}
                        required
                        value={contents[item.calendarId] || ""}
                        onChange={(e) =>
                          setContents((prev) => ({ ...prev, [item.calendarId]: e.target.value }))
                        }
                      />
                      </div>
                      <div className={styles.reviewUploadRow}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            setImages((prev) => ({ ...prev, [item.calendarId]: e.target.files[0] }));
                            handleImageChange(e, item.calendarId);
                          }}
                          className={styles.fileInput}
                        />
                      </div>
                      <div className={styles.starRating}>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <span
                            key={num}
                            onClick={() => handleRating(item.calendarId, num)}
                            className={styles.star}
                          >
                            {ratings[item.calendarId] >= num ? <FaStar /> : <FaRegStar />}
                          </span>
                        ))}
                      </div>
                      <button className={styles.submitButton} onClick={()=>handleSubmitReview(item)}>등록</button>
                    </>
                  ) : (
                      <>

                        {item.teacherReply && (
                          <div className={styles.teacherReply}>
                            <p><strong>강사답변</strong> ({item.responseDate})</p>
                            <p>{item.teacherReply}</p>
                          </div>
                        )}
                      </>
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
    return activeTab === 'writable' ? writablePage : donePage;
  }
}
