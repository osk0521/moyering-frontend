import React, { useEffect, useState } from 'react';
import './StudentSearch.css';
import { myAxios } from './../../config';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from './../../atoms';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [token,setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);

  const [students, setStudents] = useState([]);
   
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(()=>{
    token&&myAxios(token,setToken).get("/host/studentList",{
      params:{
        hostId : user.hostId,
      }
    })
    .then(res=>{
      console.log(res.data)
      setStudents(res.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[token])

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
          <h4>검색 결과 : {(Array.isArray(students) ? students.length : 0)}건</h4>
          {students.map((student) => (
            <div key={student.id} className="KHJ-student-item">
              <div className="KHJ-student-info" /*onClick={() => handleStudentClick(student)}*/>
                <div className="KHJ-student-details">
                  <span className="KHJ-student-name">{student.name}</span>
                  <span>전화번호: {student.tel}</span>
                  <span>이메일: {student.email}</span>
                  <span>내 강의 수: 1</span>
                </div>
              </div>
              {/* {selectedStudent === student.id && (
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
              )} */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentSearch;
