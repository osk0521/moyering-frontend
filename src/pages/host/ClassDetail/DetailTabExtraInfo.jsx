import './DetailTabExtraInfo.css';
import React from 'react'; // 이 한 줄만 추가!
const DetailTabExtraInfo = () => {
  return (
    <div className="KHJ-extra-info-container">
      <h2 className="KHJ-section-title">클래스 부가정보</h2>

      {/* 스케줄 */}
      <section className="KHJ-schedule-block">
        <div className="KHJ-schedule-title">스케줄</div>
        <table className="KHJ-schedule-table">
          <thead>
            <tr>
              <th colSpan="2">스케줄 1</th>
            </tr>
            <tr>
              <th>스케줄명</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>00:00~00:00</td>
              <td>일정 내용</td>
            </tr>
            <tr>
              <td>00:00~00:00</td>
              <td>일정 내용</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 강의자료 */}
      <div className="KHJ-info-row">
        <div className="KHJ-info-label">클래스 강의자료</div>
        <div className="KHJ-info-value">빵굽는법.pdf</div>
      </div>

      {/* 태그 정보 */}
      <div className="KHJ-info-row">
        <div className="KHJ-info-label">포함 사항(선택)</div>
        <div className="KHJ-info-tag">베이킹도구</div>
      </div>

      <div className="KHJ-info-row">
        <div className="KHJ-info-label">클래스 준비물(선택)</div>
        <div className="KHJ-info-tag">앞치마</div>
      </div>

      <div className="KHJ-info-row">
        <div className="KHJ-info-label">검색 키워드(선택)</div>
        <div className="KHJ-info-tag">베이킹</div>
      </div>

      {/* 유의사항 */}
      <div className="KHJ-info-row KHJ-notice-section">
        <div className="KHJ-info-label">신청 시 유의사항</div>
        <div className="KHJ-notice-box">
          <p><strong>[신청 시 유의사항]</strong></p>
          <p>· 최소 인원 미달로 인해 진행이 취소될 경우, 신청 마감 일시에 진행 취소 안내를 드리며 참가비는 전액 환불해 드립니다.</p>
        </div>
      </div>
    </div>
  );
};

export default DetailTabExtraInfo;
