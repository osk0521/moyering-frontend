import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import Layout from "./Layout";
import { tokenAtom } from "../../atoms";
import "./ClassManagementDetail.css";

const ClassManagementDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const setToken = useSetAtom(tokenAtom);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchClassDetail = async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const dummy = {
        classId: Number(classId),
        className: "도자기 공예 원데이클래스",
        hostName: "김도자",
        processStatus: "등록요청",
        currentCount: 0,
        recruitMax: 20,
        firstCategory: "DIY공예",
        secondCategory: "도자기",
        price: 150000,
        startDate: "2024-05-12",
        endDate: "2024-06-12",
        location: "서울 강남구 논현로 123길 4-1",
        description: "",
        schedule: ["스케줄 1"],
        extraInfo: [{ label: "베이킹비용", value: "앞치마" }],
        keywords: ["베이킹"],
        students: [
          { id: 1, userId: "user1", name: "홍길동", phone: "010-1234-5678", email: "hong@example.com", regDate: "2023-04-25", status: "수강중" },
          { id: 2, userId: "user1", name: "김철수", phone: "010-2345-6789", email: "kim@example.com", regDate: "2023-04-26", status: "수강중" },
          { id: 3, userId: "user1", name: "이영희", phone: "010-3456-7890", email: "lee@example.com", regDate: "2023-04-27", status: "수강중" }
        ]
      };
      setClassData(dummy);
    } catch (error) {
      console.error("클래스 상세 데이터 로딩 실패:", error);
      alert("클래스 정보를 불러오는데 실패했습니다.");
      navigate("/admin/class");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => alert("승인 버튼 클릭 (더미)");
  const handleReject = () => alert("거절 버튼 클릭 (더미)");

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner">데이터를 불러오는 중...</div>
        </div>
      </Layout>
    );
  }

  if (!classData) {
    return (
      <Layout>
        <div className="error-container">
          <div className="error-message">클래스 정보를 찾을 수 없습니다.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="class-detail-container">
        <div className="header">
          <h2>{classData.hostName}께 땡기시죠?</h2>
          <div className="action-buttons">
            <button className="btn-approve" onClick={handleApprove}>승인</button>
            <button className="btn-reject" onClick={handleReject}>거절</button>
            <button className="btn-close" onClick={() => navigate("/admin/class")}>닫기</button>
          </div>
        </div>

        <div className="download-links">
          <div>포트폴리오 <a href="#">다운로드</a></div>
          <div>강의자료 <a href="#">다운로드</a></div>
        </div>

        <div className="class-summary">
          <div><strong>카테고리:</strong> {classData.firstCategory} &gt; {classData.secondCategory}</div>
          <div><strong>가격:</strong> {classData.price.toLocaleString()} 원</div>
          <div><strong>클래스 일자:</strong> {classData.startDate} ~ {classData.endDate}</div>
          <div><strong>장소:</strong> {classData.location}</div>
          <div><strong>인원:</strong> {classData.currentCount} / {classData.recruitMax}</div>
          <div><strong>상태:</strong> <span className="badge">{classData.processStatus}</span></div>
        </div>

        <h3>&lt; 클래스 정보 &gt;</h3>
        <table className="info-table">
          <thead>
            <tr><th>카테고리</th><th>클래스명</th><th>장소명</th><th>주소</th><th>시작일</th><th>종료일</th><th>대표 이미지</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{classData.firstCategory}&gt;{classData.secondCategory}</td>
              <td>{classData.className}</td>
              <td>장소명</td>
              <td>{classData.location}</td>
              <td>{classData.startDate}</td>
              <td>{classData.endDate}</td>
              <td>{classData.currentCount}</td>
            </tr>
          </tbody>
        </table>

        <h3>&lt; 상세 설명 &gt;</h3>
        <div className="description-box">{classData.description || "(내용 없음)"}</div>

        <div className="bottom-section">
          <div className="schedule-section">
            <h4>&lt; 스케줄 &gt;</h4>
            {classData.schedule.map((s, i) => (
              <div key={i} className="schedule-item">{s} <span style={{ float: 'right' }}>X</span></div>
            ))}
          </div>

          <div className="extra-info-section">
            <h4>&lt; 부가정보 &gt;</h4>
            <table>
              <thead><tr><th>포함 사항</th><th>준비물</th><th>검색 키워드</th></tr></thead>
              <tbody>
                <tr>
                  <td>{classData.extraInfo.map(i => i.label).join(", ")}</td>
                  <td>{classData.extraInfo.map(i => i.value).join(", ")}</td>
                  <td>{classData.keywords.join(", ")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3>&lt; 수강생 목록 &gt;</h3>
        <table className="students-table">
          <thead>
            <tr>
              <th>회원 ID</th>
              <th>이름</th>
              <th>연락처</th>
              <th>이메일</th>
              <th>등록일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {classData.students.map((s, idx) => (
              <tr key={idx}>
                <td>{s.userId}</td>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.email}</td>
                <td>{s.regDate}</td>
                <td><span className="badge success">{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="note">등록요청 전에 대해서는 수강생 목록 없음<br/>모집중, 모집마감, 폐강, 종료된 경우에만 있음</p>
      </div>
    </Layout>
  );
};

export default ClassManagementDetail;
