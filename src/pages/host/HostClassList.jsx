import { useState } from 'react';
import './HostClassList.css';
import { useNavigate } from 'react-router-dom';

const ClassList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [classStatus, setClassStatus] = useState({
    ongoing: false,
    upcoming: false,
    completed: false,
  });

  const [searchResults, setSearchResults] = useState([
    {
      className: '클래스 명',
      classEndDate: '2026-05-25 23:59',
      category: '운동',
      status: '등록중',
    },
    {
      className: '클래스 명 2',
      classEndDate: '2026-05-30 23:59',
      category: '음악',
      status: '오픈대기',
    },
  ]);

  const [dateFilter, setDateFilter] = useState('');

  const handleSearch = () => {
    console.log('검색:', searchQuery);
    console.log('조회기간:', startDate, endDate);
    console.log('클래스 상태:', classStatus);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setClassStatus({
      ongoing: false,
      upcoming: false,
      completed: false,
    });
    setDateFilter('');
  };

  const handleDateFilterClick = (months) => {
    const today = new Date();
    let newStartDate = new Date(today);
    let newEndDate = new Date(today);

    switch (months) {
      case '오늘':
        newStartDate = newEndDate = today;
        break;
      case '1개월':
        newStartDate.setMonth(today.getMonth() - 1);
        break;
      case '3개월':
        newStartDate.setMonth(today.getMonth() - 3);
        break;
      case '6개월':
        newStartDate.setMonth(today.getMonth() - 6);
        break;
      case '1년':
        newStartDate.setFullYear(today.getFullYear() - 1);
        break;
      case '전체':
        newStartDate = '';
        newEndDate = '';
        break;
      default:
        break;
    }

    setStartDate(newStartDate ? newStartDate.toISOString().split('T')[0] : '');
    setEndDate(newEndDate ? newEndDate.toISOString().split('T')[0] : '');
    setDateFilter(months);
  };

  const handleClassStatusChange = (e) => {
    const { name, checked } = e.target;
    setClassStatus((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const navigate = useNavigate();
  const [dropdownIndex, setDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="KHJ-class-search-container">
        <h3>클래스 조회</h3>

        <div className="KHJ-search-section">
          <label>검색어</label>
          <div className="KHJ-search-input-container">
            <input
              type="text"
              placeholder="클래스명을 입력하세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="KHJ-search-filter">
              <option value="">필터</option>
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
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="KHJ-date-tilde">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="KHJ-date-buttons">
            {['오늘', '1개월', '3개월', '6개월', '1년', '전체'].map((label) => (
              <button
                key={label}
                onClick={() => handleDateFilterClick(label)}
                className={dateFilter === label ? 'active' : ''}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="KHJ-status-section">
          <label>클래스 상태</label>
          <div className="KHJ-checkbox-group">
            <label>
              <input
                type="checkbox"
                name="ongoing"
                checked={classStatus.ongoing}
                onChange={handleClassStatusChange}
              />
              등록중
            </label>
            <label>
              <input
                type="checkbox"
                name="upcoming"
                checked={classStatus.upcoming}
                onChange={handleClassStatusChange}
              />
              오픈대기
            </label>
            <label>
              <input
                type="checkbox"
                name="completed"
                checked={classStatus.completed}
                onChange={handleClassStatusChange}
              />
              오픈
            </label>
          </div>
        </div>
      </div>

      <div className="KHJ-class-result-container">
        <div className="KHJ-result-section">
          <h4>검색 결과: {searchResults.length} 건</h4>
          {searchResults.map((result, index) => (
            <div key={index} className="KHJ-result-item">
              <div className="KHJ-result-image">
                <img
                  src={result.imageUrl}
                  alt={result.className}
                />
              </div>
              <div className="KHJ-result-info">
                <h5>{result.className}</h5>
                <p><strong>클래스 종료일:</strong> {result.classEndDate}</p>
                <p><strong>카테고리:</strong> {result.category}</p>
                <p><strong>상태:</strong> {result.status}</p>
              </div>
              <div className="KHJ-result-actions">
                <button onClick={() => toggleDropdown(index)}>더 보기</button>
                {dropdownIndex === index && (
                  <div className="KHJ-dropdown-menu">
                    <button onClick={() => handleNavigate('/inquiry')}>문의 관리</button>
                    <button onClick={() => handleNavigate('/classReview')}>리뷰 관리</button>
                    <button onClick={() => handleNavigate('/detail')}>상품 상세</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClassList;
