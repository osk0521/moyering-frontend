import { useEffect, useState } from 'react';
import './HostClassList.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { myAxios, url } from '../../config';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';

const ClassList = () => {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const [classData, setClassData] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [classStatus, setClassStatus] = useState({ ongoing: false, upcoming: false, completed: false });
  const [dropdownIndex, setDropdownIndex] = useState(null);

  const navigate = useNavigate();

  const fetchClassListWithDates = (customStartDate, customEndDate, page = 1) => {
    console.log("날짜 필터 요청:", {
      startDate: customStartDate,
      endDate: customEndDate,
    });
    const statusFilter = Object.keys(classStatus).filter(k => classStatus[k]);

    myAxios(token)
      .post(`/host/class/list`, {
        hostId: user.hostId,
        page,
        size: 5,
        keyword: searchQuery,
        category1: '',
        category2: '',
        status: statusFilter.length > 0 ? statusFilter[0] : '',
        startDate: customStartDate || '',
        endDate: customEndDate || '',
      })
      .then(res => {
        setClassData(res.data.content);
        setPageInfo(res.data.pageInfo);
      })
      .catch(err => console.log(err));
  };

  const fetchClassList = (page = 1) => {
    fetchClassListWithDates(startDate, endDate, page);
  };

  useEffect(() => {
    if (user?.hostId) fetchClassList(1);
  }, [user]);

  const handleDateFilterClick = (label) => {
    const today = new Date();
    let newStart = new Date(today);
    let newEnd = new Date(today);

    switch (label) {
      case '오늘': break;
      case '1개월': newStart.setMonth(today.getMonth() - 1); break;
      case '3개월': newStart.setMonth(today.getMonth() - 3); break;
      case '6개월': newStart.setMonth(today.getMonth() - 6); break;
      case '1년': newStart.setFullYear(today.getFullYear() - 1); break;
      case '전체': newStart = ''; newEnd = ''; break;
    }

    const formattedStart = newStart ? newStart.toISOString().split('T')[0] : '';
    const formattedEnd = newEnd ? newEnd.toISOString().split('T')[0] : '';

    setStartDate(formattedStart);
    setEndDate(formattedEnd);
    setDateFilter(label);

    // 바로 날짜 기준으로 요청
    fetchClassListWithDates(formattedStart, formattedEnd, 1);
  };

  const handleSearch = () => fetchClassList(1);

  const handleReset = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setClassStatus({ ongoing: false, upcoming: false, completed: false });
    setDateFilter('');
    fetchClassList(1);
  };

  const toggleDropdown = (index) => setDropdownIndex(dropdownIndex === index ? null : index);
  const handleNavigate = (path) => navigate(path);

  return (
    <>
      <div className="KHJ-class-search-container">
        <h3>클래스 조회</h3>
        <div className="KHJ-search-section">
          <label>검색어</label>
          <div className="KHJ-search-input-container">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="클래스명을 입력하세요." />
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="KHJ-search-filter">
              <option value="name">이름</option>
              <option value="category">카테고리</option>
            </select>
            <button onClick={handleSearch}>검색</button>
            <button onClick={handleReset}>초기화</button>
          </div>
        </div>

        <div className="KHJ-date-section">
          <div className="KHJ-date-range-wrapper">
            <label>조회기간</label>
            <div className="KHJ-date-range">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="KHJ-date-tilde">~</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="KHJ-date-buttons">
            {['오늘', '1개월', '3개월', '6개월', '1년', '전체'].map(label => (
              <button key={label} onClick={() => handleDateFilterClick(label)} className={dateFilter === label ? 'active' : ''}>{label}</button>
            ))}
          </div>
        </div>

        <div className="KHJ-status-section">
          <label>클래스 상태</label>
          <div className="KHJ-checkbox-group">
            {['검수중', '검수완료', '모집중'].map(key => (
              <label key={key}>
                <input type="checkbox" checked={classStatus[key]} onChange={() => setClassStatus({ ...classStatus, [key]: !classStatus[key] })} />
                {key === '검수중' ? '검수중' : key === '검수완료' ? '검수완료' : key === '모집중'?'모집중' :  '오픈'}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="KHJ-class-result-container">
        <div className="KHJ-result-section">
          <h4>검색 결과: {classData.length} 건 / 총 {pageInfo.allPage} 페이지</h4>
          {classData.map((result, index) => (
            <div key={index} className="KHJ-result-item">
              <div className="KHJ-result-image">
                <img src={`${url}/iupload/${result.imgName1}`} alt={result.name} />
              </div>
              <div className="KHJ-result-info">
                <h5>{result.name}</h5>
                <p><strong>클래스 시작일:</strong> {result.startDate}</p>
                <p><strong>카테고리:</strong> {result.category1}</p>
                <p><strong>상태:</strong> {result.status}</p>
              </div>
              <div className="KHJ-result-actions">
                <button onClick={() => toggleDropdown(index)}>더 보기</button>
                {dropdownIndex === index && (
                  <div className="KHJ-dropdown-menu">
                    <button onClick={() => handleNavigate('/host/inquiry')}>문의 관리</button>
                    <button onClick={() => handleNavigate('/host/classReview')}>리뷰 관리</button>
                    <button onClick={() => handleNavigate(`/host/detail/${result.classId}/${result.calendarId}`)}>상품 상세</button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {pageInfo.allPage > 1 && (
            <div className="KHJ-pagination">
              {(() => {
                const totalPage = pageInfo.allPage;
                const currentPage = pageInfo.curPage;
                const maxButtons = 5;

                let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                let end = start + maxButtons - 1;

                if (end > totalPage) {
                  end = totalPage;
                  start = Math.max(1, end - maxButtons + 1);
                }

                const pages = [];

                if (currentPage > 1) {
                  pages.push(
                    <button key="prev" onClick={() => fetchClassList(currentPage - 1)} className="KHJ-page-button">
                      ◀ 이전
                    </button>
                  );
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => fetchClassList(i)}
                      className={`KHJ-page-button ${i === currentPage ? 'active' : ''}`}
                    >
                      {i}
                    </button>
                  );
                }

                if (currentPage < totalPage) {
                  pages.push(
                    <button key="next" onClick={() => fetchClassList(currentPage + 1)} className="KHJ-page-button">
                      다음 ▶
                    </button>
                  );
                }

                return pages;
              })()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassList;
