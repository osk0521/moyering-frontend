import React, { useEffect, useState } from 'react';
import Layout from "./Layout";
import './ClassManagement.css';
import ClassDetailModal from './ClassDetailModal';
import { myAxios } from '../../config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const statusOptions = [
  { label: '전체', value: '' },
  { label: '승인대기', value: '승인대기' },
  { label: '모집중', value: '모집중' },
  { label: '모집마감', value: '모집마감' },
  { label: '거절', value: '거절' },
  { label: '폐강', value: '폐강' }
];

const ClassManagement = () => {
  const token = useAtomValue(tokenAtom);
  // 검색/필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [firstCategory, setFirstCategory] = useState('');
  const [secondCategory, setSecondCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]); // [{firstCategory, secondCategoryList: []}]
  const [secondCategoryList, setSecondCategoryList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 데이터
  const [classList, setClassList] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // 카테고리 데이터 fetch
  useEffect(() => {
    myAxios(token) 
      .get('/categories/suball')
      .then(res => {
        setCategoryList(res.data || []);
      })
      .catch(() => setCategoryList([]));
  }, [token]);

  // 1차 카테고리 변경 시 2차 카테고리 목록 갱신
  useEffect(() => {
    if (!firstCategory) {
      setSecondCategoryList([]);
      setSecondCategory('');
    } else {
      const found = categoryList.find(cat => cat.firstCategory === firstCategory);
      setSecondCategoryList(found ? found.secondCategoryList : []);
      setSecondCategory('');
    }
  }, [firstCategory, categoryList]);

  // 클래스 리스트 fetch
  useEffect(() => {
    const params = {
      page: currentPage,
      size: 20,
      keyword: searchTerm || undefined,
      firstCategory: firstCategory || undefined,
      secondCategory: secondCategory || undefined,
      fromDate: startDate || undefined,
      toDate: endDate || undefined,
      statusFilter: statusFilter || undefined,
    };
    myAxios(token)
      .get('/api/class', { params })
      .then(res => {
        setClassList(res.data.content || []);
        setTotalElements(res.data.totalElements || 0);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => {
        setClassList([]);
        setTotalElements(0);
        setTotalPages(1);
      });
  }, [token, firstCategory, secondCategory, statusFilter, searchTerm, startDate, endDate, currentPage]);

  // 필터/검색 핸들러
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFirstCategory = (e) => setFirstCategory(e.target.value);
  const handleSecondCategory = (e) => setSecondCategory(e.target.value);
  const handleStatus = (value) => setStatusFilter(value);
  const handleStartDate = (e) => setStartDate(e.target.value);
  const handleEndDate = (e) => setEndDate(e.target.value);

  // 테이블 상태 뱃지 스타일
  const getStatusClass = (status) => {
    switch(status) {
      case '모집중': return 'status-recruitingHY';
      case '승인대기': return 'status-pendingHY';
      case '거절': return 'status-rejectedHY';
      case '모집마감': return 'status-fullHY';
      case '폐강': return 'status-cancelledHY';
      default: return '';
    }
  };

  // 모달 오픈/클로즈
  const openClassModal = (classItem) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  // 페이지네이션
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="page-titleHY">
        <h1>클래스 관리</h1>
      </div>
      {/* 검색 및 필터 영역 */}
      <div className="search-sectionHY">
        <div className="search-boxHY">
          <span className="search-iconHY">🔍</span>
          <input
            type="text"
            placeholder="클래스명, 강사명, 강사 ID 검색"
            value={searchTerm}
            onChange={handleSearch}
            className="search-inputHY"
          />
        </div>
        <label className="date-labelHY">개설일</label>
        <input
          type="date"
          className="date-inputHY"
          value={startDate}
          onChange={handleStartDate}
        />
        <span className="date-separatorHY">~</span>
        <input
          type="date"
          className="date-inputHY"
          value={endDate}
          onChange={handleEndDate}
        />
        {/* 1차 카테고리 */}
        <div className="category-sectionHY">
          <select className="category-selectHY" value={firstCategory} onChange={handleFirstCategory}>
            <option value="">1차 카테고리</option>
            {categoryList.map(cat => (
              <option key={cat.firstCategory} value={cat.firstCategory}>{cat.firstCategory}</option>
            ))}
          </select>
        </div>
        {/* 2차 카테고리 */}
        <div className="category-sectionHY">
          <select className="category-selectHY" value={secondCategory} onChange={handleSecondCategory} disabled={!firstCategory}>
            <option value="">2차 카테고리</option>
            {secondCategoryList.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>
   
      
      {/* 상태 필터 */}
      <div className="filter-sectionHY">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            className={`filter-btnHY ${statusFilter === opt.value ? 'active' : ''}`}
            onClick={() => handleStatus(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      총 <strong>{totalElements}</strong>건
      <div className="table-containerHY">
        <table className="tableHY">
          <thead>
            <tr>
              <th>NO</th>
              <th>1차 카테고리</th>
              <th>2차 카테고리</th>
              <th>강사 ID</th>
              <th>강사명</th>
              <th>클래스명</th>
              <th>가격</th>
              <th>등록 최소 인원</th>
              <th>등록 최대 인원</th>
              <th>개설일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {classList.map((item, idx) => (
              <tr key={item.classId}>
                <td>{totalElements - (currentPage * 20) - idx}</td>
                <td>{item.firstCategory}</td>
                <td>{item.secondCategory}</td>
                <td className="instructor-idHY">{item.hostUserName}</td>
                <td>{item.hostName}</td>
                <td className="class-nameHY">
                  <button className="class-name-buttonHY" onClick={() => openClassModal(item)}>
                    {item.className}
                  </button>
                </td>
                <td className="priceHY">{item.price?.toLocaleString()}원</td>
                <td className="text-center">{item.recruitMin}명</td>
                <td className="text-center">{item.recruitMax}명</td>
                <td>{item.regDate}</td>
                <td>
                  <span className={`status-badgeHY ${getStatusClass(item.processStatus)}`}>{item.processStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 페이지네이션 */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>이전</button>
        <span style={{ margin: '0 10px' }}>{currentPage + 1} / {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>다음</button>
      </div>
      <ClassDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        classData={selectedClass}
      />
    </Layout>
  );
};

export default ClassManagement;