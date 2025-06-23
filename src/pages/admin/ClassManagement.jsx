import React, { useState } from 'react';
import Layout from "./Layout";
import './ClassManagement.css';

// 모달 사용
import ClassDetailModal from './ClassDetailModal'; // 클래스 상세 페이지 

  
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
  
    // 클래스 데이터 (업데이트된 더미데이터)
    const classData = [
      {
        no: 1, // 일련번호
        category: "운동 > 요가", // 카테고리
        instructorId: "yoga_kim", // 강사 ID
        instructorName: "김요가", // 강사명
        className: "초보자를 위한 하타요가", // 클래스명
        price: "₩80,000", // 가격
        registrationMin: 5, // 등록 최소 인원
        registrationMax: 15, // 등록 최대 인원
        classDate: "2024-03-01", // 개설 요청일
        status: "승인", // 상태
      },
      {
        no: 2,
        category: "운동 > 요가",
        instructorId: "yoga_kim",
        instructorName: "김요가",
        className: "아침 파워요가 클래스",
        price: "₩90,000",
        registrationMin: 8,
        registrationMax: 20,
        classDate: "2024-03-05",
        status: "승인",
      },
      {
        no: 3,
        category: "운동 > 요가",
        instructorId: "yoga_kim",
        instructorName: "김요가",
        className: "임산부 요가",
        price: "₩70,000",
        registrationMin: 3,
        registrationMax: 10,
        classDate: "2024-03-10",
        status: "대기",
      },
      {
        no: 4,
        category: "운동 > 필라테스",
        instructorId: "pilates_park",
        instructorName: "박필라테스",
        className: "매트 필라테스 기초",
        price: "₩85,000",
        registrationMin: 6,
        registrationMax: 12,
        classDate: "2024-03-02",
        status: "승인",
      },
      {
        no: 5,
        category: "운동 > 필라테스",
        instructorId: "pilates_park",
        instructorName: "박필라테스",
        className: "소도구 필라테스",
        price: "₩95,000",
        registrationMin: 4,
        registrationMax: 10,
        classDate: "2024-03-08",
        status: "대기",
      },
      {
        no: 6,
        category: "운동 > 헬스",
        instructorId: "trainer_kim",
        instructorName: "헬스트레이너",
        className: "웨이트 트레이닝 기초",
        price: "₩120,000",
        registrationMin: 5,
        registrationMax: 15,
        classDate: "2024-03-15",
        status: "승인",
      },
      {
        no: 7,
        category: "운동 > 헬스",
        instructorId: "trainer_kim",
        instructorName: "헬스트레이너",
        className: "다이어트 헬스",
        price: "₩100,000",
        registrationMin: 8,
        registrationMax: 20,
        classDate: "2024-03-12",
        status: "대기",
      },
      {
        no: 8,
        category: "운동 > 수영",
        instructorId: "swim_coach",
        instructorName: "수영코치",
        className: "성인 자유형 수영",
        price: "₩110,000",
        registrationMin: 6,
        registrationMax: 12,
        classDate: "2024-03-18",
        status: "승인",
      },
      {
        no: 9,
        category: "운동 > 수영",
        instructorId: "swim_coach",
        instructorName: "수영코치",
        className: "아동 수영 교실",
        price: "₩80,000",
        registrationMin: 5,
        registrationMax: 10,
        classDate: "2024-03-20",
        status: "대기",
      },
      {
        no: 10,
        category: "요리 > 한식",
        instructorId: "chef_lee",
        instructorName: "이셰프",
        className: "집에서 만드는 한식",
        price: "₩90,000",
        registrationMin: 6,
        registrationMax: 12,
        classDate: "2024-03-03",
        status: "승인",
      },
      {
        no: 11,
        category: "요리 > 양식",
        instructorId: "chef_lee",
        instructorName: "이셰프",
        className: "이탈리안 파스타 마스터",
        price: "₩110,000",
        registrationMin: 4,
        registrationMax: 8,
        classDate: "2024-03-07",
        status: "대기",
      },
      {
        no: 12,
        category: "요리 > 베이킹",
        instructorId: "chef_lee",
        instructorName: "이셰프",
        className: "홈베이킹 기초과정",
        price: "₩75,000",
        registrationMin: 8,
        registrationMax: 15,
        classDate: "2024-03-11",
        status: "거절",
      },
      {
        no: 13,
        category: "미술 > 유화",
        instructorId: "artist_choi",
        instructorName: "최화가",
        className: "유화 풍경화 그리기",
        price: "₩120,000",
        registrationMin: 5,
        registrationMax: 10,
        classDate: "2024-03-04",
        status: "승인",
      },
      {
        no: 14,
        category: "미술 > 수채화",
        instructorId: "artist_choi",
        instructorName: "최화가",
        className: "수채화 정물화",
        price: "₩95,000",
        registrationMin: 6,
        registrationMax: 12,
        classDate: "2024-03-14",
        status: "대기",
      },
      {
        no: 15,
        category: "미술 > 디지털아트",
        instructorId: "artist_choi",
        instructorName: "최화가",
        className: "디지털 일러스트",
        price: "₩130,000",
        registrationMin: 4,
        registrationMax: 8,
        classDate: "2024-03-16",
        status: "거절",
      },
      {
        no: 16,
        category: "음악 > 피아노",
        instructorId: "music_teacher",
        instructorName: "음악쌤",
        className: "클래식 피아노 레슨",
        price: "₩150,000",
        registrationMin: 3,
        registrationMax: 6,
        classDate: "2024-03-06",
        status: "승인",
      },
      {
        no: 17,
        category: "음악 > 기타",
        instructorId: "music_teacher",
        instructorName: "음악쌤",
        className: "통기타 기초",
        price: "₩80,000",
        registrationMin: 8,
        registrationMax: 15,
        classDate: "2024-03-13",
        status: "대기",
      },
      {
        no: 18,
        category: "음악 > 보컬",
        instructorId: "music_teacher",
        instructorName: "음악쌤",
        className: "보컬 트레이닝",
        price: "₩100,000",
        registrationMin: 5,
        registrationMax: 10,
        classDate: "2024-03-17",
        status: "거절",
      },
      {
        no: 19,
        category: "언어 > 영어",
        instructorId: "english_teacher",
        instructorName: "영어선생",
        className: "토익 점수 올리기",
        price: "₩120,000",
        registrationMin: 10,
        registrationMax: 20,
        classDate: "2024-03-09",
        status: "승인",
      },
      {
        no: 20,
        category: "언어 > 영어",
        instructorId: "english_teacher",
        instructorName: "영어선생",
        className: "영어회화 초급",
        price: "₩90,000",
        registrationMin: 8,
        registrationMax: 15,
        classDate: "2024-03-19",
        status: "대기",
      },
      {
        no: 21,
        category: "언어 > 일본어",
        instructorId: "english_teacher",
        instructorName: "영어선생",
        className: "일본어 기초 회화",
        price: "₩85,000",
        registrationMin: 6,
        registrationMax: 12,
        classDate: "2024-03-21",
        status: "거절",
      },
      {
        no: 22,
        category: "언어 > 중국어",
        instructorId: "english_teacher",
        instructorName: "영어선생",
        className: "HSK 중국어",
        price: "₩95,000",
        registrationMin: 5,
        registrationMax: 15,
        classDate: "2024-03-22",
        status: "거절",
      },
    ];
  
    // 필터 상태 옵션 (업데이트된 상태명)
    const statusOptions = ['전체', '대기', '승인', '거절'];
  
    // 카테고리 옵션 (업데이트된 카테고리)
    const categoryOptions = [
      '전체 카테고리',
      '운동',
      '요리', 
      '미술',
      '음악',
      '언어'
    ];
  
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
        classItem.category.includes(categoryFilter);
  
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
  
    // 상태별 스타일 클래스 (업데이트된 상태명에 맞춤)
    const getStatusClass = (status) => {
      switch(status) {
        case '대기': return 'status-pendingHY';
        case '승인': return 'status-completedHY';
        case '거절': return 'status-rejectedHY';
        default: return '';
      }
    };
  
    return (
      <Layout>
        {/* 페이지 제목 */}
        <div className="page-titleHY">
          <h1>클래스 관리</h1>
        </div>
  
        {/* 검색 및 필터 영역 */}
        <div className="search-sectionHY">
          {/* 검색 박스 */}
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
  
          <label className="date-labelHY">개설 요청일</label>
          <input
            type="date"
            className="date-inputHY"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="date-separatorHY">~</span>
          <input
            type="date"
            className="date-inputHY"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
  
          <div className="category-sectionHY">
            <select 
              className="category-selectHY"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <br />
        
        {/* 상태 필터 */}
        <div className="filter-sectionHY">
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
        <div className="result-countHY">
          총 <strong>{filteredClasses.length}</strong>건
        </div>
  
        {/* 클래스 테이블 */}
        <div className="table-containerHY">
          <table className="tableHY">
            <thead>
              <tr>
                <th>NO</th>
                <th>카테고리</th>
                <th>강사 ID</th>
                <th>강사명</th>
                <th>클래스명</th>
                <th>가격</th>
                <th>등록 최소 인원</th>
                <th>등록 최대 인원</th>
                <th>개설 요청일</th>
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
                  <td className="text-center">{classItem.registrationMin}명</td>
                  <td className="text-center">{classItem.registrationMax}명</td>
                  <td>{classItem.classDate}</td>
                  <td>
                    <span className={`status-badgeHY ${getStatusClass(classItem.status)}`}>
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
        
      </Layout>
    );
  };

  export default ClassManagement;