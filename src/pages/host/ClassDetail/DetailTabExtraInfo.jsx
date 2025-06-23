import './DetailTabExtraInfo.css';
import React, { useEffect } from 'react';

const DetailTabExtraInfo = ({ scheduleDetails, classData, registerValidator, isEditMode }) => {
  const {
    materialName,
    incluision,
    preparation,
    keywords,
    caution,
    portfolioName,
    classCalendars = []
  } = classData || {};


  useEffect(() => {
    registerValidator(3, () => true); // 검증 로직이 필요하다면 여기에 추가
  }, []);

  return (
    <div className="KHJ-extra-info-container">
      <h2 className="KHJ-section-title">클래스 부가정보</h2>

      {/* 스케줄 정보 */}
      {scheduleDetails.length > 0 ? (
        <section className="KHJ-schedule-block">
          <table className="KHJ-schedule-table">
            <thead>
              <tr>
                <th>일정 시작</th>
                <th>일정 종료</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {scheduleDetails.map((schedule, idx) => (
                <tr key={idx}>
                  <td>{schedule.startTime}</td>
                  <td>{schedule.endTime}</td>
                  <td>{schedule.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <p style={{ marginTop: "1rem", color: "#888" }}>등록된 스케줄이 없습니다.</p>
      )}

      {/* 강의자료 */}
      <div className="KHJ-info-row">
        <div className="KHJ-info-label">클래스 강의자료</div>
        <div className="KHJ-info-value">{materialName || '없음'}</div>
      </div>

      {/* 포함 사항 */}
      <div className="KHJ-info-row">
        <div className="KHJ-info-label">포함 사항(선택)</div>
        <div className="KHJ-info-tag">{incluision || '없음'}</div>
      </div>

      {/* 준비물 */}
      <div className="KHJ-info-row">
        <div className="KHJ-info-label">클래스 준비물(선택)</div>
        <div className="KHJ-info-tag">{preparation || '없음'}</div>
      </div>

      {/* 검색 키워드 */}
      <div className="KHJ-info-row">
        <div className="KHJ-info-label">검색 키워드(선택)</div>
        <div className="KHJ-info-tag">{keywords || '없음'}</div>
      </div>

      {/* 유의사항 */}
      <div className="KHJ-info-row KHJ-notice-section">
        <div className="KHJ-info-label">신청 시 유의사항</div>
        <div className="KHJ-notice-box">
          {caution ? (
            <p>{caution}</p>
          ) : (
            <p style={{ color: '#888' }}>유의사항 없음</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailTabExtraInfo;
