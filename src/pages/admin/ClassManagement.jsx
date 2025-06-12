// src/components/pages/ClassManagement.jsx
import React, { useState } from 'react';
import Layout from "./Layout";
import './ClassManagement.css';
// 모달 사용
import ClassDetailModal from './ClassDetailModal'; // 클래스 상세 모달 컴포넌트

const ClassManagement = () => {
  // 검색어 => 사용자가 입력한 검색어 저장
  const [searchTerm, setSearchTerm] = useState(''); 

  // 카테고리 필터링
  const [categoryFilter, setCategoryFilter] = useState('전체 카테고리');
  // 날짜 필터링 (클래스 개설일 범위)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 상태 필터링 
  // 배열로 여러 상태를 동시에 선택하여 보여주기
  const [selectedStatuses, setSelectedStatuses] = useState(['전체']);

// 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);


  // 클래스 데이터
  const classData = [
    {
      no: 1, // 일련번호
      category: "언어톡 > 회화", // 카테고리
      instructorId: "user1", // 강사 ID
      instructorName: "김서현", // 강사명
      className: "언어톡-그룹토론", // 클래스명
      price: "₩150,000", // 가격
      classDate: "2023-06-10", // 클래스 개설일
      progress: { current: 0, total: 20 }, // 수강 인원
      status: "등록 요청", // 상태
    },
    {
      no: 2,
      category: "언어톡 > 회화",
      instructorId: "user2",
      instructorName: "송예진",
      className: "일본어로 일상회화를",
      price: "₩180,000",
      classDate: "2023-06-10",
      progress: { current: 12, total: 15 },
      status: "등록 요청",
    },
    {
      no: 3,
      instructorId: "user3",
      instructorName: "박나나",
      className: "한국의 역사이해",
      price: "₩200,000",
      classDate: "2023-06-10",
      category: "문화 > 역사",
      progress: { current: 20, total: 25 },
      status: "모집중",
    },
    {
      no: 4,
      category: "예술GT > 도입기",
      instructorId: "user4",
      instructorName: "서강",
      className: "예술 놀이치료 도입기",
      price: "₩120,000",
      classDate: "2023-06-10",
      progress: { current: 25, total: 30 },
      status: "모집중",
    },
    {
      no: 5,
      category: "소통톡 > 회화",
      instructorId: "user5",
      instructorName: "김예빈",
      className: "일상대화-혜택톡너리",
      price: "₩150,000",
      classDate: "2023-06-10",
      progress: { current: 15, total: 20 },
      status: "모집마감",
    },
    {
      no: 6,
      category: "계급 > 자격",
      instructorId: "user6",
      instructorName: "김예빈",
      className: "엑셀대화 명강의",
      price: "₩120,000",
      classDate: "2023-05-10",
      progress: { current: 0, total: 20 },
      status: "모집중",
    },
    {
      no: 7,
      category: "계급 > 흐름",
      instructorId: "user7",
      instructorName: "하승우",
      className: "그림톡 명강의",
      price: "₩150,000",
      classDate: "2023-05-10",
      progress: { current: 20, total: 20 },
      status: "모집마감",
    },
    {
      no: 8,
      category: "움직 > 요양",
      instructorId: "user8",
      instructorName: "박혜빈",
      className: "라이브업 명강의",
      price: "₩100,000",
      classDate: "2023-05-10",
      progress: { current: 25, total: 30 },
      status: "종료",
    },
    {
      no: 9,
      category: "비즈니스 > 마케팅",
      instructorId: "user9",
      instructorName: "안민수",
      className: "디지털 마케팅 기초",
      price: "₩200,000",
      classDate: "2023-04-15",
      progress: { current: 5, total: 15 },
      status: "거절됨",
    },
    {
      no: 10,
      category: "비즈니스 > 창업",
      instructorId: "user10",
      instructorName: "정혜진",
      className: "진로 모색하는 물론",
      price: "₩180,000",
      classDate: "2023-03-01",
      progress: { current: 2, total: 20 },
      status: "폐강",
    },
  ];

  // 필터 상태 옵션
  const statusOptions = ['전체', '등록 요청', '모집마감', '모집중', '폐강', '종료', '거절됨'];

  // 클래스 상세 모달 열기
  const openClassModal = (classItem) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };


  
  // 상태 체크 핸들러 함수 => 전체와 개별상태
  const handleStatusChange = (status) => {
    if (status === '전체') {
      // "전체"를 클릭 시 다른 모든 선택 해제하고 "전체"만 선택
      setSelectedStatuses(['전체']); 
    } else {
      // 개별 상태를 클릭 시
      setSelectedStatuses(prev => {
        // 현재 선택된 상태들에서 "전체" 제거
        const withoutAll = prev.filter(s => s !== '전체');
    
        if (withoutAll.includes(status)) {
          // 이미 선택된 상태라면 -> 제거
          const newStatuses = withoutAll.filter(s => s !== status);
          // 아무것도 선택되지 않았다면 "전체"로 되돌리기
          return newStatuses.length === 0 ? ['전체'] : newStatuses;
        } else {
          // 선택되지 않은 상태라면 -> 추가
          return [...withoutAll, status];
        }
      });
    }
  };

  // 필터링 로직
  const filteredClasses = classData.filter((classItem) => {
    // 검색어 필터링
    // 클래스명, 강사명, 강사ID 중 하나라도 검색어를 포함하면 true
    const matchesSearch = 
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.instructorId.toLowerCase().includes(searchTerm.toLowerCase());

    // 상태 필터링
    // "전체"가 선택되었거나, 선택된 상태 목록에 현재 클래스의 상태가 포함되어 있으면 true
    const matchesStatus = 
      selectedStatuses.includes('전체') || 
      selectedStatuses.includes(classItem.status);

    // 카테고리 필터링
    // "전체 카테고리"이거나, 카테고리가 일치하면 true
    const matchesCategory = 
      categoryFilter === '전체 카테고리' || 
      classItem.category.includes(categoryFilter.replace('전체 ', ''));

    // 날짜 필터링
    const classDate = new Date(classItem.classDate); // 문자열을 Date 객체로 변환
    const start = startDate ? new Date(startDate) : null; // 시작일이 있으면 Date 객체로 변환
    const end = endDate ? new Date(endDate) : null; // 종료일이 있으면 Date 객체로 변환

    const matchesDate = 
      (!start || classDate >= start) && // 시작일이 없거나, 클래스일이 시작일 이후
      (!end || classDate <= end); // 종료일이 없거나, 클래스일이 종료일 이전

    // 모든 조건을 만족하는 클래스만 보여주기
    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

    // 검색어 입력받아서 상태에 저장 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  // 상태별 스타일 클래스
  const getStatusClass = (status) => {
    switch(status) {
      case '등록 요청': return 'status-pending';
      case '모집중': return 'status-recruiting';
      case '모집마감': return 'status-full';
      case '종료': return 'status-completed';
      case '폐강': return 'status-cancelled';
      case '거절됨': return 'status-rejected';
      default: return '';
    }
  };

  // 진행률 계산
  const getProgressPercentage = (current, total) => {
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  // 진행률 색상
  const getProgressColor = (percentage) => {
    if (percentage === 0) return '#9CA3AF';
    if (percentage <= 30) return '#EF4444';
    if (percentage <= 60) return '#F59E0B';
    if (percentage <= 90) return '#3B82F6';
    return '#10B981';
  };

  return (
    <Layout>
      <div className="managementHYHY">
        {/* 페이지 제목 */}
        <div className="page-titleHYHY">
          <h1>클래스 관리</h1>
        </div>


      {/* 검색 및 필터 영역 */}
        <div className="controls-sectionHYHY">
          <div className="search-sectionHYHY">
            {/* 검색 박스 */}
            <div className="search-boxHYHY">
              <span className="search-iconHYHY">🔍</span>
              <input
                type="text"
                placeholder="클래스명, 강사명, 강사 ID 검색"
                value={searchTerm}
                onChange={handleSearch}
                className="search-inputHYHY"
              />
            </div>
    
              <label className="date-labelHYHY">클래스 개설일</label>
              <input
                type="date"
                className="date-inputHYHY"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="date-separatorHYHY">~</span>
              <input
                type="date"
                className="date-inputHYHY"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
        

            <div className="category-sectionHYHY">
              <select 
                className="category-selectHYHY"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="전체 카테고리">전체 카테고리</option>
                <option value="언어톡">언어톡</option>
                <option value="문화">문화</option>
                <option value="예술GT">예술GT</option>
                <option value="소통톡">소통톡</option>
                <option value="계급">계급</option>
                <option value="비즈니스">비즈니스</option>
              </select>
            </div>
          </div>
        </div>
        {/* 상태 필터 */}
        <div className="filter-sectionHYHY">
          {statusOptions.map((status) => (
            <button 
              key={status}
              className={`filter-btnHY ${selectedStatuses.includes(status) ? 'active' : ''}`}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <br />

        {/* 검색 결과 수 */}
        <div className="result-countHYHY">
          총 <strong>{filteredClasses.length}</strong>건
        </div>

        {/* 클래스 테이블 */}
        <div className="table-containerHYHY">
          <table className="tableHYHY">
            <thead>
              <tr>
                <th>NO</th>
                <th>카테고리</th>
                <th>강사 ID</th>
                <th>강사명</th>
                <th>클래스명</th>
                <th>가격</th>
                <th>수강 인원</th>
                <th>클래스 개설일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map(classItem => (
                <tr key={classItem.no}>
                  <td>{classItem.no}</td>
                  <td>{classItem.category}</td>
                  <td className="instructor-idHY">{classItem.instructorId}</td>
                  <td>{classItem.instructorName}</td>
                  <td className="class-nameHY">
                    {/* 클래스명 누르면 상세 모달창으로  */}
                <button 
                  className="class-name-buttonHY"
                  onClick={() => openClassModal(classItem)}
                >
                  {classItem.className}
                </button>
              </td>
                  <td className="priceHY">{classItem.price}</td>
                  <td className="progress-cellHY">
                    <div className="progress-infoHY">
                      <span 
                        className="progress-textHY"
                        style={{ color: getProgressColor(getProgressPercentage(classItem.progress.current, classItem.progress.total)) }}
                      >
                        {classItem.progress.current}/{classItem.progress.total}
                      </span>
                      <span className="progress-percentageHY">
                        ({getProgressPercentage(classItem.progress.current, classItem.progress.total)}%)
                      </span>
                    </div>
                  </td>
                  <td>{classItem.classDate}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(classItem.status)}`}>
                      {classItem.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
           <ClassDetailModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        classData={selectedClass}
      />
      </div>
    </Layout>
  );
};

export default ClassManagement;