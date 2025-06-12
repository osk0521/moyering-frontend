// src/components/modals/ClassDetailModal.jsx
import React from 'react';
import Layout from "./Layout";
import './ClassDetailModal.css';

const ClassDetailModal = ({ isOpen, onClose, classData }) => {
  if (!isOpen || !classData) return null;

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

  return (
    <div className="modal-overlayHY" onClick={onClose}>
      <div className="modal-contentHY" onClick={(e) => e.stopPropagation()}>
        <div className="modal-headerHY">
          <h2>클래스 상세 정보</h2>
          <button className="modal-closeHY" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-bodyHY">
          {/* 클래스 기본 정보 */}
          <div className="class-info-sectionHY">
            <div className="info-gridHY">
              <div className="info-itemHY">
                <span className="info-labelHY">강사명</span>
                <span className="info-valueHY">{classData.instructorName}</span>
              </div>
              
              <div className="info-itemHY">
                <span className="info-labelHY">강사 ID</span>
                <span className="info-valueHY">{classData.instructorId}</span>
              </div>
              
              <div className="info-itemHY">
                <span className="info-labelHY">카테고리</span>
                <span className="info-valueHY">{classData.category}</span>
              </div>
              
              <div className="info-itemHY">
                <span className="info-labelHY">클래스명</span>
                <span className="info-valueHY">{classData.className}</span>
              </div>
              
              <div className="info-itemHY">
                <span className="info-labelHY">가격</span>
                <span className="info-value priceHY">{classData.price}</span>
              </div>
              
              <div className="info-itemHY">
                <span className="info-labelHY">개설일</span>
                <span className="info-valueHY">{classData.classDate}</span>
              </div>
              
              <div className="info-itemHY">
                <span className="info-labelHY">수강 인원</span>
                <span className="info-valueHY">
                  {classData.progress.current}/{classData.progress.total}명 
                  ({getProgressPercentage(classData.progress.current, classData.progress.total)}%)
                </span>
              </div>
              
              <div className="info-itemHY">
                <span className="info-labelHY">상태</span>
                <span className={`status-badge ${getStatusClass(classData.status)}`}>
                  {classData.status}
                </span>
              </div>
            </div>
          </div>

          {/* 클래스 설명 */}
          <div className="class-description-sectionHY">
            <h3>클래스 설명</h3>
            <div className="description-contentHY">
              <p>이 클래스는 {classData.category} 분야의 전문 강의입니다.</p>
              <p>강사 {classData.instructorName}님이 진행하는 고품질 교육 프로그램으로, 
                 체계적인 커리큘럼과 실무 중심의 내용을 제공합니다.</p>
              <p>수강료: {classData.price}</p>
            </div>
          </div>

          {/* 수강생 목록 */}
          <div className="student-list-sectionHY">
            <h3>수강생 목록 ({classData.progress.current}명)</h3>
            <div className="student-table-containerHY">
              <table className="student-tableHY">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>학생명</th>
                    <th>연락처</th>
                    <th>이메일</th>
                    <th>등록일</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 실제 데이터가 있을 때는 map으로 렌더링 */}
                  {classData.progress.current > 0 ? (
                    Array.from({ length: Math.min(classData.progress.current, 5) }, (_, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>수강생{index + 1}</td>
                        <td>010-{String(1234 + index).padStart(4, '0')}-5678</td>
                        <td>student{index + 1}@example.com</td>
                        <td>2023-04-{String(25 + index).padStart(2, '0')}</td>
                        <td><span className="status-badge status-recruitingHY">수강중</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-dataHY">등록된 수강생이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="modal-footerHY">
          <button className="btn-secondaryHY" onClick={onClose}>닫기</button>
          <button className="btn-primaryHY">수정</button>
          <button className="btn-dangerHY">삭제</button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailModal;