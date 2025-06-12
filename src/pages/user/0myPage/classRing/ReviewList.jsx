import React, { useState } from 'react';
import styles from './ReviewList.module.css';
import { FaStar, FaRegStar } from 'react-icons/fa';

export default function ReviewList() {
  const [activeTab, setActiveTab] = useState('writable');
  const [selectedDate, setSelectedDate] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [openReviewId, setOpenReviewId] = useState(null);
  const [ratings, setRatings] = useState({});

  const writableReviews = [
    { id: 1, classTitle: '도자기 클래스', date: '25.06.22', user: 'USERNAME' },
    { id: 2, classTitle: '보컬 클래스', date: '25.06.21', user: 'USERNAME' },
  ];

  const doneReviews = [
    {
      id: 3,
      classTitle: '보컬 클래스',
      writeDate: '25.06.20',
      user: 'USERNAME',
      content: '정말 즐거웠어요~ 감사합니다!',
      teacherReply: '참여해주셔서 감사해요! 또 만나요 ☺️',
      rating: 4,
      replyDate: '25.06.21',
    },
    {
      id: 4,
      classTitle: '공예 클래스',
      writeDate: '25.06.19',
      user: 'USERNAME',
      content: '만족스러웠어요~',
      teacherReply: '칭찬 감사합니다 💕',
      rating: 5,
      replyDate: '25.06.20',
    },
  ];

  const data = activeTab === 'writable' ? writableReviews : doneReviews;
  const dateKey = activeTab === 'writable' ? 'date' : 'writeDate';
  const filteredData =
    selectedDate === '전체'
      ? data
      : data.filter((r) => r[dateKey] === selectedDate);

  const reviewsPerPage = 2;
  const totalPages = Math.ceil(filteredData.length / reviewsPerPage);
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = filteredData.slice(indexOfFirst, indexOfLast);

  const toggleAccordion = (id) => {
    setOpenReviewId((prev) => (prev === id ? null : id));
  };

  const handleRating = (id, value) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <main className={styles.pageWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBox}>회원정보</div>
        <div className={styles.sidebarBox}>마이메뉴</div>
      </aside>

      <section className={styles.section}>
        <h2 className={styles.title}>리뷰 내역</h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'writable' ? styles.tabButtonActive : ''}`}
            onClick={() => {
              setActiveTab('writable');
              setSelectedDate('전체');
              setCurrentPage(1);
            }}
          >
            작성 가능한 리뷰
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'done' ? styles.tabButtonActive : ''}`}
            onClick={() => {
              setActiveTab('done');
              setSelectedDate('전체');
              setCurrentPage(1);
            }}
          >
            작성 완료한 리뷰
          </button>
        </div>

        <div className={styles.filterRow}>
          <label>날짜 필터:</label>
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.select}
          >
            <option value="전체">전체</option>
            {[...new Set(data.map((r) => r[dateKey]))].map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div>
          {currentReviews.map((item) => (
            <div
              key={item.id}
              className={`${styles.reviewBox} ${activeTab === 'done' ? styles.reviewBoxDone : ''}`}
            >
              <div className={styles.accordionHeader} onClick={() => toggleAccordion(item.id)}>
                <p>
                  <strong>{item.classTitle}</strong> | 수강일: {item[dateKey]}
                </p>
                <span>{openReviewId === item.id ? '▲' : '▼'}</span>
              </div>

              {openReviewId === item.id && (
                <div className={styles.accordionBody}>
                  {activeTab === 'writable' ? (
                    <>
                      <textarea
                        placeholder="이 클래스는 어땠나요? 리뷰를 남겨주세요 😊"
                        className={styles.textarea}
                      />
                      <div className={styles.starRating}>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <span
                            key={num}
                            onClick={() => handleRating(item.id, num)}
                            className={styles.star}
                          >
                            {ratings[item.id] >= num ? <FaStar /> : <FaRegStar />}
                          </span>
                        ))}
                      </div>
                      <button className={styles.submitButton}>등록</button>
                    </>
                  ) : (
                    <>
                      <div className={styles.starDisplay}>
                        {[...Array(5)].map((_, i) =>
                          i < item.rating ? (
                            <FaStar key={i} className={styles.star} />
                          ) : (
                            <FaRegStar key={i} className={styles.star} />
                          )
                        )}
                      </div>
                      <p className={styles.reviewContent}>{item.content}</p>
                      <div className={styles.teacherReply}>
                        <p>
                          <strong>강사답변</strong> ({item.replyDate})
                        </p>
                        <p>{item.teacherReply}</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className={styles.pagination}>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`${styles.pageButton} ${
                  currentPage === idx + 1 ? styles.pageButtonActive : ''
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
