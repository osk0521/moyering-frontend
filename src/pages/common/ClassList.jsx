import React, { useState } from 'react';
import ClassCard from '../../components/ClassCard';
import styles from './ClassList.module.css';
import DatePicker from 'react-datepicker';


export default function ClassList() {
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);

  return (
    <main className={styles.page}>
      <div className={styles.searchFormContainer}>
            <h2 className={styles.formTitle}>클래스링 검색</h2>
      
            <div className={styles.formGrid}>
              {/* 지역 */}
              <div className={styles.formGroup}>
                <label>지역</label>
                <select className={styles.datePickerInput}>
                  <option>전체</option>
                  <option>서울</option>
                  <option>경기</option>
                  <option>부산</option>
                </select>
              </div>
      
              {/* 카테고리 */}
              <div className={`${styles.formGroup} ${styles.categoryGroup}`}>
                <label>카테고리</label>
                <div className={styles.range}>
                  <select className={styles.datePickerInput}>
                    <option>1차 카테고리</option>
                    <option>서울</option>
                    <option>경기</option>
                    <option>부산</option>
                  </select>
                  <select className={styles.datePickerInput}>
                    <option>2차 카테고리</option>
                    <option>서울</option>
                    <option>경기</option>
                    <option>부산</option>
                  </select>
                </div>
              </div>
      
              {/* 인원 */}
              <div className={styles.formGroup}>
                <label>인원</label>
                <select className={styles.datePickerInput}>
                  <option>1인</option>
                  <option>2인</option>
                  <option>3인 이상</option>
                </select>
              </div>
      
              {/* 날짜 */}
              <div className={styles.formGroup}>
                <label>날짜</label>
                <div className={styles.range}>
                  <DatePicker
                    selected={selectedDate1}
                    onChange={(date) => setSelectedDate1(date)}
                    dateFormat="yyyy.MM.dd"
                    placeholderText="날짜"
                    className={styles.datePickerInput}
                  />
                  <span>~</span>
                  <DatePicker
                    selected={selectedDate2}
                    onChange={(date) => setSelectedDate2(date)}
                    dateFormat="yyyy.MM.dd"
                    placeholderText="날짜"
                    className={styles.datePickerInput}
                  />
                </div>
              </div>
      
              {/* 시간 */}
              <div className={styles.formGroup}>
                <label>시간</label>
                <div className={styles.range}>
                  <input type="time" defaultValue="00:00" className={styles.datePickerInput}/>
                  <span>~</span>
                  <input type="time" defaultValue="24:00" className={styles.datePickerInput}/>
                </div>
              </div>
      
              {/* 금액 */}
              <div className={styles.formGroup}>
                <label>금액</label>
                <div className={styles.range}>
                  <input type="text" placeholder="0원" className={styles.datePickerInput}/>
                  <span>~</span>
                  <input type="text" placeholder="1,000,000원" className={styles.datePickerInput}/>
                </div>
              </div>
      
              {/* 하단 버튼 */}
              <div className={styles.formActions}>
                <button className={styles.resetBtn}>초기화</button>
                <button className={styles.submitBtn}>검색하기</button>
              </div>
            </div>
          </div>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>당신의 취향 저격!</h2>
        <p className={styles.sectionSub}>모여링이 추천해주는 맞춤 클래스</p>
        <div className={styles.cardList}>
          {[...Array(8)].map((_, idx) => (
            <ClassCard key={idx} />
          ))}
        </div>
      </section>

      <div className={styles.pagination}>
        <button className={styles.pageBtn}>〈</button>
        <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
        <button className={styles.pageBtn}>2</button>
        <button className={styles.pageBtn}>3</button>
        <button className={styles.pageBtn}>〉</button>
      </div>
    </main>
  );
}
