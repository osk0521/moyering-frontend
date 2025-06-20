import './DetailTabDescription.css';
import React from 'react'; // 이 한 줄만 추가!
const DetailTabDescription = () => {
  return (
    <div className="KHJ-description-tab-container">
      <h2 className="KHJ-description-section-title">클래스 설명</h2>

      {/* 대표 이미지 */}
      <div className="KHJ-description-image-section">
        <div className="KHJ-description-image-label">대표 이미지</div>
        <div className="KHJ-description-image-list">
          <img src="./detail1.png" alt="대표 이미지1" />
          <img src="./detail2.png" alt="대표 이미지2" />
        </div>
      </div>

      <div className="KHJ-description-divider" />

      {/* 상세 설명 */}
      <div className="KHJ-description-detail-section">
        <div className="KHJ-description-detail-label">클래스 상세설명</div>
        <div className="KHJ-description-detail-content KHJ-description-box">
          <div className="KHJ-description-detail-content">
            <p className="KHJ-description-paragraph">안녕하세요!</p>
            <p className="KHJ-description-paragraph">티켓을 결제해주시면 문자로 반차장을 보내드릴게요!</p>
            <p className="KHJ-description-paragraph">여러 품목의 수업이 선착순으로 진행됩니다.</p>
            <p className="KHJ-description-paragraph">타임에 같은 수업으로 진행되오니 양해바랍니다.</p>

            <p className="KHJ-description-paragraph"><strong>예)</strong></p>
            <ul className="KHJ-description-list">
              <li className="KHJ-description-list-item">모두 가능 = 모든 수업 가능</li>
              <li className="KHJ-description-list-item">품목이 정해져있는 수업 = 해당 수업만 진행</li>
            </ul>

            <p className="KHJ-description-paragraph">공방 수업 시간이 한눈에 보일 수 있도록 스케줄을 오픈합니다.</p>
            <p className="KHJ-description-paragraph">주말 수업은 보통 4-5주 전에 마감됩니다.</p>
            <p className="KHJ-description-paragraph">매달 1일, 다음달 예약이 시작됩니다.</p>

            <p className="KHJ-description-paragraph"><strong>[빠른 예약방법]</strong></p>
            <ol className="KHJ-description-list KHJ-description-ordered">
              <li className="KHJ-description-list-item">예약할 날짜를 확인한다.</li>
              <li className="KHJ-description-list-item">[문자로 전송] 성함 / 인원수 / 연락처 / 수업명 / 날짜, 요일, 시간</li>
              <li className="KHJ-description-list-item">예약이 확정되었습니다. 다른 문자를 반드시 확인해주세요.</li>
            </ol>

            <p className="KHJ-description-paragraph">스콘에 진심인 1인~5인에게 스폰만큼 만들어드려요! 레시피만 10개가 넘어요~ 😋</p>
            <p className="KHJ-description-hashtags">#제이바나롤링리조트 #베이킹 #손맛 #요리카네이션</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTabDescription;
