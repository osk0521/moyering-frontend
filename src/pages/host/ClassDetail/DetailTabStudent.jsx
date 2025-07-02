import { useEffect, useState } from "react";
import './DetailTabStudent.css';
import React from 'react'; // 이 한 줄만 추가!
import { myAxios } from "../../../config";
import { useAtom } from "jotai";
import { tokenAtom } from "../../../atoms";
const DetailTabStudent = ({classData}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [token,setToken] = useAtom(tokenAtom);
  const [students,setStudents] = useState([]);


  useEffect(()=>{
    token && myAxios(token,setToken).get("/host/classStudentList",{
      params:{
        calendarId : classData.calendarId,
      }
    })
    .then(res=>{
      console.log("학생~")
      console.log(res.data)
      setStudents(res.data);
    })
    .catch(err=>{
      console.log(err);
    })
  },[token])


  const toggleStudent = (id) => {
    setSelectedStudentId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="KHJ-student-class-container">
      <h3>수강생 정보</h3>

      {students.map((student, index) => (
        <div key={student.id} className="KHJ-student-card">
          <div
            className="KHJ-student-basic"
            onClick={() => toggleStudent(student.id)}
          >
            <div>No. {index + 1}</div>
            <div className="KHJ-student-name KHJ-clickable">{student.name}</div>
            <div>{student.tel}</div>
            <div>{student.email}</div>
          </div>

          {/* {selectedStudentId === student.id && (
            <div className="KHJ-class-section">
              <div className="KHJ-class-block">
                <p className="KHJ-class-title"></p>
                <div className="KHJ-progress-container">
                  <span>출석 진행</span>
                  <div className="KHJ-progress-bar-bg">
                    <div
                      className="KHJ-progress-bar-fill"
                      style={{
                        width: `${(student.attendance.current / student.attendance.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="KHJ-class-count">
                    {student.attendance.current} / {student.attendance.total}회
                  </div>
                </div>
                <div className="KHJ-today-status">
                  오늘 출석 상태: {student.attendance.todayStatus}
                </div>
                <div className="KHJ-attendance-button-wrapper">
                  <button className="KHJ-attendance-button">출석 체크</button>
                </div>
              </div>
            </div>
          )} */}
        </div>
      ))}
    </div>
  );
};

export default DetailTabStudent;
