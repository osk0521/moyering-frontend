import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from "./Layout";
import './ClassManagementDetail.css';
import './ClassManagement';

import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { myAxios } from '../../config';

const ClassManagementDetail = () => {
  const navigate = useNavigate();
  const { classId } = useParams(); // URL에서 classId 파라미터 가져오기
  const token = useAtomValue(tokenAtom);
  
  const [classData, setClassData] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // 클래스 상세 정보 fetch
  useEffect(() => {
    if (!classId || !token) return;

    const fetchClassDetail = async () => {
      try {
        setLoading(true);
        // 클래스 상세 정보 API 호출
        const classResponse = await myAxios(token).get(`/api/class/${classId}`);
        setClassData(classResponse.data);

        // 수강생 목록 API 호출 (클래스 상세에 포함되어 있을 수도 있음)
        try {
          const studentsResponse = await myAxios(token).get(`/api/class/${classId}/students`);
          setStudentList(studentsResponse.data || []);
        } catch (studentError) {
          console.log('수강생 목록을 불러올 수 없습니다:', studentError);
          setStudentList([]);
        }
      } catch (err) {
        console.error('클래스 정보를 불러오는데 실패했습니다:', err);
        setError('클래스 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetail();
  }, [classId, token]);

  // 클래스 승인
  const handleApprove = async () => {
    if (!window.confirm('클래스를 승인하시겠습니까?')) return;

    try {
      await myAxios(token).put(`/api/class/${classId}/approve`);
      setClassData({ ...classData, processStatus: '모집중' });
      alert('클래스가 승인되었습니다.');
    } catch (err) {
      console.error('승인 처리 중 오류:', err);
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  // 클래스 거절
  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert('거절 사유를 입력해주세요.');
      return;
    }

    try {
      await myAxios(token).put(`/api/class/${classId}/reject`, {
        reason: rejectReason
      });
      setClassData({ ...classData, processStatus: '거절' });
      setShowRejectModal(false);
      setRejectReason('');
      alert('클래스가 거절되었습니다.');
    } catch (err) {
      console.error('거절 처리 중 오류:', err);
      alert('거절 처리 중 오류가 발생했습니다.');
    }
  };

  // 클래스 폐강
  const handleClose = async () => {
    if (!window.confirm('클래스를 폐강하시겠습니까?')) return;

    try {
      await myAxios(token).put(`/api/class/${classId}/close`);
      setClassData({ ...classData, processStatus: '폐강' });
      alert('클래스가 폐강되었습니다.');
    } catch (err) {
      console.error('폐강 처리 중 오류:', err);
      alert('폐강 처리 중 오류가 발생했습니다.');
    }
  };

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

  const handleBack = () => {
    navigate('/admin/class');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>로딩 중...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleBack} className="btn-secondaryHY">
            목록으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  if (!classData) {
    return (
      <Layout>
        <div className="error-container">
          <p>클래스 정보를 찾을 수 없습니다.</p>
          <button onClick={handleBack} className="btn-secondaryHY">
            목록으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-titleHY">
        <button onClick={handleBack} className="back-buttonHY">
          ← 뒤로가기
        </button>
        <h1>클래스 상세 정보</h1>
      </div>

      <div className="detail-containerHY">
        {/* 클래스 정보 섹션 */}
        <div className="class-info-sectionHY">
          <div className="info-gridHY">
            <div className="info-itemHY">
              <span className="info-labelHY">클래스명</span>
              <span className="info-valueHY">{classData.className}</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">강사명</span>
              <span className="info-valueHY">{classData.hostName}</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">강사 ID</span>
              <span className="info-valueHY">{classData.hostUserName}</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">1차 카테고리</span>
              <span className="info-valueHY">{classData.firstCategory}</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">2차 카테고리</span>
              <span className="info-valueHY">{classData.secondCategory}</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">가격</span>
              <span className="info-valueHY price">{classData.price?.toLocaleString()}원</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">최소 인원</span>
              <span className="info-valueHY">{classData.recruitMin}명</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">최대 인원</span>
              <span className="info-valueHY">{classData.recruitMax}명</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">개설일</span>
              <span className="info-valueHY">{classData.regDate}</span>
            </div>
            <div className="info-itemHY">
              <span className="info-labelHY">상태</span>
              <span className={`status-badgeHY ${getStatusClass(classData.processStatus)}`}>
                {classData.processStatus}
              </span>
            </div>
          </div>
        </div>

        {/* 클래스 설명 섹션 */}
        {classData.description && (
          <div className="class-description-sectionHY">
            <h3>클래스 설명</h3>
            <div className="description-contentHY">
              <p>{classData.description}</p>
            </div>
          </div>
        )}

        {/* 수강생 목록 섹션 */}
        <div className="student-list-sectionHY">
          <h3>수강생 목록 ({studentList.length}명)</h3>
          <div className="student-table-containerHY">
            <table className="student-tableHY">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>학생 ID</th>
                  <th>학생명</th>
                  <th>이메일</th>
                  <th>신청일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {studentList.length > 0 ? (
                  studentList.map((student, idx) => (
                    <tr key={student.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{student.userName || student.userId}</td>
                      <td>{student.name || student.studentName}</td>
                      <td>{student.email}</td>
                      <td>{student.enrollDate || student.regDate}</td>
                      <td>
                        <span className={`status-badgeHY ${getStatusClass(student.status || '등록')}`}>
                          {student.status || '등록'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-dataHY">
                      등록된 수강생이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="action-buttonsHY">
          {classData.processStatus === '승인대기' && (
            <>
              <button onClick={handleApprove} className="btn-primaryHY">
                승인
              </button>
              <button onClick={handleReject} className="btn-dangerHY">
                거절
              </button>
            </>
          )}
          {(classData.processStatus === '모집중' || classData.processStatus === '모집마감') && (
            <button onClick={handleClose} className="btn-dangerHY">
              폐강
            </button>
          )}
        </div>
      </div>

      {/* 거절 사유 입력 모달 */}
      {showRejectModal && (
        <div className="modal-overlayHY">
          <div className="reject-modal-contentHY">
            <h3>거절 사유 입력</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="거절 사유를 입력해주세요..."
              rows="4"
              className="reject-textareaHY"
            />
            <div className="reject-modal-actionsHY">
              <button onClick={() => setShowRejectModal(false)} className="btn-secondaryHY">
                취소
              </button>
              <button onClick={handleRejectSubmit} className="btn-dangerHY">
                거절
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClassManagementDetail;