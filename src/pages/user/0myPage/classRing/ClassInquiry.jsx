import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './ClassInquiry.module.css';

export default function ClassInquiry() {
  const [openId, setOpenId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [answerFilter, setAnswerFilter] = useState('all'); // all | pending | done

  const inquiries = [
    { id: 1, classTitle: '클래스 A', date: '2025-06-22', question: '준비물이 뭔가요?', answer: '' },
    { id: 2, classTitle: '클래스 B', date: '2025-06-20', question: '장소가 어디인가요?', answer: '강남역 근처입니다.' },
    { id: 3, classTitle: '클래스 C', date: '2025-06-18', question: '주차 가능한가요?', answer: '' },
    { id: 4, classTitle: '클래스 D', date: '2025-06-15', question: '강사님은 누구인가요?', answer: '홍길동 강사님입니다.' },
  ];

  const filtered = inquiries
    .filter((item) => {
      const dateObj = new Date(item.date);
      const inRange = (!startDate || dateObj >= startDate) && (!endDate || dateObj <= endDate);
      const answerMatch =
        answerFilter === 'all' ||
        (answerFilter === 'pending' && !item.answer) ||
        (answerFilter === 'done' && item.answer);
      return inRange && answerMatch;
    })
    .sort((a, b) => (b.answer ? 1 : 0) - (a.answer ? 1 : 0));

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <main className={styles.classInquiryLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBox}>회원정보</div>
        <div className={styles.sidebarBox}>마이메뉴</div>
      </aside>

      <section className={styles.classInquiryPage}>
        <h2 className={styles.pageTitle}>클래스링 질문내역</h2>

        <div className={styles.tabFilterRow}>
                    <div className={styles.answerFilterWrap}>
            <button
              className={`${styles.filterButton} ${answerFilter === 'all' ? styles.active : ''}`}
              onClick={() => setAnswerFilter('all')}
            >
              전체
            </button>
            <button
              className={`${styles.filterButton} ${answerFilter === 'pending' ? styles.active : ''}`}
              onClick={() => setAnswerFilter('pending')}
            >
              대기중
            </button>
            <button
              className={`${styles.filterButton} ${answerFilter === 'done' ? styles.active : ''}`}
              onClick={() => setAnswerFilter('done')}
            >
              답변완료
            </button>
          </div>
          <div className={styles.datepickerWrap}>
            
            <label>기간</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="시작일"
              className={styles.datePickerInput}
            />
            <span>~</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="종료일"
              className={styles.datePickerInput}
            />
          </div>
        </div>

        <div className={styles.inquiryList}>
          {filtered.map((item) => (
            <div key={item.id} className={styles.inquiryCard}>
              <div
                className={styles.inquiryHeader}
                onClick={() => item.answer && toggleAccordion(item.id)}
              >
                <div className={styles.inquiryTopRow}>
                  <div className={styles.inquiryTitle}>
                    {item.classTitle} | {item.date}
                  </div>
                  <div>
                    <span
                      className={`${styles.statusBadge} ${
                        item.answer ? styles.done : styles.pending
                      }`}
                    >
                      {item.answer ? '답변 완료' : '답변 대기중'}
                    </span>
                    {item.answer && (
                      <span className={styles.toggleIcon}>
                        {openId === item.id ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.question}>{item.question}</div>
              </div>

              {openId === item.id && item.answer && (
                <div className={styles.inquiryAnswer}>
                  <p className={styles.answerLabel}>답변</p>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
