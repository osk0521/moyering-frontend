import React, { useState , useEffect} from 'react';
import GatheringCard from '../../components/GatheringCard';
import styles from './GatheringList.module.css';
import DatePicker from 'react-datepicker';
import Header from './Header';
import Footer from './Footer';
import { useNavigate,useLocation } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  gatheringListAtom,
  currentPageAtom,
  totalPagesAtom,
  gatheringFilterAtom,
} from '../../atom/classAtom';
import {fetchGatheringListAtom} from '../../hooks/common/fetchGatheringListAtom';
import { fetchCategoryListAtom } from '../../hooks/common/fetchCategoryListAtom';
import { categoryListAtom } from '../../atom/classAtom';

export default function GatheringList() {
  const location = useLocation();
  const initStartDate = location.state?.today
  ? new Date(location.state.today)
  : null;
  const initCategory1 = location.state?.category1 || '';
  const initCategory2 = location.state?.category2 || '';

  const [selectedDate1, setSelectedDate1] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedCategory1, setSelectedCategory1] = useState('');
  const [selectedCategory2, setSelectedCategory2] = useState('');
  const [selectedMaxAttendees, setSelectedMaxAttendees] = useState('');
  const [selectedMinAttendees, setSelectedMinAttendees] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const navigate = useNavigate();

  const gatheringList = useAtomValue(gatheringListAtom);
  const totalPages = useAtomValue(totalPagesAtom);
  const currentPage = useAtomValue(currentPageAtom);

  const setCurrentPage = useSetAtom(currentPageAtom);
  const setFilter = useSetAtom(gatheringFilterAtom);
  const fetchGatheringList = useSetAtom(fetchGatheringListAtom);
  //카테고리 끌고오기
  const categoryList = useAtomValue(categoryListAtom);
  const fetchCategories = useSetAtom(fetchCategoryListAtom);

  //처음에 클래스 끌고오기
  const filters = useAtomValue(gatheringFilterAtom);
  console.log(categoryList);
  
  // useEffect로 최초 1회 호출
  useEffect(() => {
    fetchCategories();
  }, []);

  // 그 다음 초기 필터 적용
  useEffect(() => {
    // 초기 진입 시 항상 fetchClassList 호출되도록 조건 제거
    setSelectedDate1(initStartDate||null);
    setSelectedDate2(initStartDate||null);
    setFilter((prev) => ({
      ...prev,
      category1: initCategory1,
      category2: initCategory2,
      startDate:initStartDate,
      endDate:initStartDate
    }));
    setCurrentPage(1);
    fetchGatheringList();
  }, []);
  
  const firstCategoryList = Array.from(
    new Map(categoryList.map(item => [item.categoryId, item.categoryName])).entries()
  ).map(([id, name]) => ({ id, name }));

  const secondCategoryList = categoryList.filter(
    (item) => item.categoryId == selectedCategory1
  );



const handleSidoChange = (e) => {
  setSelectedSido(e.target.value);
};
const handleSearch = () => {
setCurrentPage(1); // 페이지 초기화

  setFilter((prev) => ({
    ...prev,
    sido: selectedSido,
    category1: selectedCategory1,
    category2: selectedCategory2,
    startDate: selectedDate1,
    endDate: selectedDate2,
    maxAttendees: selectedMaxAttendees,
    minAttendees: selectedMinAttendees,
    title: selectedTitle,
  }));

  fetchGatheringList(); // 필터 적용 후 새 목록 요청
};

const handlePageChange = (page) => {
  setCurrentPage(page);
  fetchGatheringList(); // 새 페이지로 서버 요청
      window.scrollTo({ top: 0, behavior: 'smooth' });
};
//초기화
const handleReset = () => {
  setSelectedSido('');
  setSelectedCategory1('');
  setSelectedCategory2('');
  setSelectedDate1(null);
  setSelectedDate2(null);
  setSelectedMaxAttendees('');
  setSelectedMinAttendees('');
  setSelectedTitle('');
  setCurrentPage(1);
  setFilter({
    sido: '',
    category1: '',
    category2: '',
    startDate: null,
    endDate: null,
    maxAttendees: '',
    minAttendees:'',
    title:'',
  });
  fetchGatheringList();
};


  return (
    <>
    <Header/>
    <main className={styles.page}>
      <h2 className={styles.sectionTitle}>게더링</h2>
      <p className={styles.sectionSub}>지금 당장 게더링~</p>
      <div className={styles.searchFormContainer}>
            <div className={styles.formGrid}>
              {/* 지역 */}
              <div className={styles.formGroup}>
                <label>지역</label>
                <select className={styles.datePickerInput} value={selectedSido} onChange={handleSidoChange}>
                  <option value="">전체</option>
                  <option value="서울">서울</option>
                  <option value="부산">부산</option>
                  <option value="대구광역시">대구광역시</option>
                  <option value="인천광역시">인천광역시</option>
                  <option value="광주광역시">광주광역시</option>
                  <option value="대전광역시">대전광역시</option>
                  <option value="울산광역시">울산광역시</option>
                  <option value="세종특별자치시">세종특별자치시</option>
                  <option value="경기도">경기도</option>
                  <option value="강원특별자치도">강원특별자치도</option>
                  <option value="충청북도">충청북도</option>
                  <option value="충청남도">충청남도</option>
                  <option value="전라북도">전라북도</option>
                  <option value="전라남도">전라남도</option>
                  <option value="경상북도">경상북도</option>
                  <option value="경상남도">경상남도</option>
                  <option value="제주특별자치도">제주특별자치도</option>
                </select>
              </div>

              {/* 카테고리 */}
              <div className={`${styles.formGroup} ${styles.categoryGroup}`}>
                <label>카테고리</label>
                <div className={styles.range}>
                  <select
                    className={styles.datePickerInput}
                    value={selectedCategory1}
                    onChange={(e) => setSelectedCategory1(e.target.value)}
                  >
                    <option value="">1차 카테고리</option>
                    {firstCategoryList.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    className={styles.datePickerInput}
                    value={selectedCategory2}
                    onChange={(e) => setSelectedCategory2(e.target.value)}
                  >
                    <option value="">2차 카테고리</option>
                    {secondCategoryList.map((sub) => (
                      <option key={sub.subCategoryId} value={sub.subCategoryId}>
                        {sub.subCategoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* 제목 */}
              <div className={styles.formGroup}>
                <label>제목</label>
                <div className={styles.range}>
                  <input type="text" placeholder="제목" className={styles.datePickerInput}
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}/>   
                </div>
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
      
              {/* 인원 */}
              <div className={styles.formGroup}>
                <label>인원</label>
                <div className={styles.range}>
                  <input type="number" placeholder="최소인원" className={styles.datePickerInput}
                  value={selectedMinAttendees}
                  onChange={(e) => setSelectedMinAttendees(e.target.value)}/>
                  <span>~</span>
                  <input type="number" placeholder="최대인원" className={styles.datePickerInput}
                  value={selectedMaxAttendees}
                  onChange={(e) => setSelectedMaxAttendees(e.target.value)}
                  />    
                </div>
              </div>
      
              {/* 하단 버튼 */}
              <div className={styles.formGroup}>
                <label>&nbsp;</label>
                <button className={styles.resetBtn} onClick={handleReset}>초기화</button>
                <button className={styles.submitBtn} onClick={handleSearch}>검색하기</button>
              </div>
            </div>
          </div>

      <section className={styles.sectionBlock}>
        <div className={styles.cardList}>
          {gatheringList.length === 0 ? (
            <p>조건에 맞는 게더링이 없습니다.</p>
          ) : (
            gatheringList.map((gatherInfo, idx) => (
            <GatheringCard
              key={idx}
              gatherInfo={gatherInfo}
              onClick={() => navigate(`/gatheringDetail/${gatherInfo.gatheringId}`)}
            />
          )))}
        </div>
      </section>

      <div className={styles.pagination}>
        <button className={styles.pageBtn} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>〈</button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ""}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button className={styles.pageBtn}  onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>〉</button>
      </div>
    </main>
    <Footer/>
    </>
  );
}
