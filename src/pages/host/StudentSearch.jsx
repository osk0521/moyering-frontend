import React, { useState } from 'react';
import './StudentSearch.css';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([
    {
      id: 1,
      name: '홍구',
      phone: '010-1234-5678',
      email: '홍구@example.com',
      classStatus: '수강 중',
      totalStudents: 12,
      currentStudents: 8,
      classTime: '금, 14:00-16:00',
      classes: [
        {
          className: '운동 클래스 1',
          classTime: '금, 14:00-16:00',
          status: '수강 중',
        },
        {
          className: '운동 클래스 2',
          classTime: '일, 10:00-12:00',
          status: '수강 대기',
        },
      ],
    },
    {
      id: 2,
      name: '영구',
      phone: '010-8765-4321',
      email: '영구@example.com',
      classStatus: '수강 대기',
      totalStudents: 12,
      currentStudents: 2,
      classTime: '토, 10:00-12:00',
      classes: [
        {
          className: '운동 클래스 3',
          classTime: '토, 10:00-12:00',
          status: '수강 대기',
        },
      ],
    },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearch = () => {
    console.log('검색어:', searchQuery);
  };

  const handleReset = () => {
    setSearchQuery('');
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student.id === selectedStudent ? null : student.id);
  };

 return (
    <>
      <div className="KHJ-class-search-container">
        <h3>수강생 조회</h3>

        <div className="KHJ-search-section">
          <label>검색어</label>
          <div className="KHJ-search-input-container">
            <input
              type="text"
              placeholder="클래스명을 입력하세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>
            <button onClick={handleReset}>초기화</button>
          </div>
        </div>
      </div>

      <div className="KHJ-class-result-container">
        <div className="KHJ-class-results">
          <h4>검색 결과 : {students.length}건</h4>
          {students.map((student) => (
            <div key={student.id} className="KHJ-student-item">
              <div className="KHJ-student-info" onClick={() => handleStudentClick(student)}>
                <div className="KHJ-student-details">
                  <span className="KHJ-student-name">{student.name}</span>
                  <span>전화번호: {student.phone}</span>
                  <span>이메일: {student.email}</span>
                  <span>내 강의 수: {student.classes.length}</span>
                </div>
              </div>
              {selectedStudent === student.id && (
                <div className="KHJ-dropdown-classes">
                  {student.classes.map((classItem, index) => (
                    <div key={index} className="KHJ-class-item">
                      <div className="KHJ-class-info">
                        <p>{classItem.className}</p>
                        <p>{classItem.classTime}</p>
                        <p>{classItem.status}</p>
                      </div>
                      <button className="KHJ-attendance-button">출석 체크</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentSearch;
