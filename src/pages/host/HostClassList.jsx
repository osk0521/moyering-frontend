import { useEffect, useState } from 'react';
import './HostClassList.css';
import { useNavigate } from 'react-router-dom';
import React from 'react'; // 이 한 줄만 추가!
import { myAxios } from '../../config';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';

const ClassList = () => {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const [classData,setClassData] = useState([]);

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

  

  const navigate = useNavigate();
  const [dropdownIndex, setDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(()=>{
    myAxios(token).get(`/host/HostclassList?hostId=${user.hostId}`)
    .then(res=>{
      setClassData(res.data);
      console.log("==데이터==")
      console.log(res.data);
      console.log("======")
    })
    .catch(err=>{
      console.log("token"+token)
      console.log(err);
    })
  },[token,user.hostId])


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
                
              />
              <span className="KHJ-date-tilde">~</span>
              <input
                type="date"
               
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
                
              />
              등록중
            </label>
            <label>
              <input
                type="checkbox"
                name="upcoming"
                
              />
              오픈대기
            </label>
            <label>
              <input
                type="checkbox"
                name="completed"
                
              />
              오픈
            </label>
          </div>
        </div>
      </div>

      <div className="KHJ-class-result-container">
        <div className="KHJ-result-section">
          <h4>검색 결과: {classData.length} 건</h4>
          {classData.map((result, index) => (
            <div key={index} className="KHJ-result-item">
              <div className="KHJ-result-image">
                <img
                  src={result.imgName1}
                  alt={result.className}
                />
              </div>
              <div className="KHJ-result-info">
                <h5>{result.imgName1}</h5>
                <p><strong>클래스 종료일:</strong> {result.startDate}</p>
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
        </div>
      </div>
    </>
  );
};

export default ClassList;
