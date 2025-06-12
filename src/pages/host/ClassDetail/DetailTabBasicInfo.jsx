import './DetailTabBasicInfo.css';

const DetailTabBasicInfo = () => {
  return (
    <div className="KHJ-class-detail-container">
      <div className="KHJ-detail-basic-section">
        <h3 className="KHJ-detail-basic-title">기본정보</h3>

        <div className="KHJ-detail-basic-row">
          <div className="KHJ-detail-basic-category-box">
            <div className="KHJ-detail-basic-category-item">
              <label className="KHJ-detail-basic-label">1차 카테고리</label>
              <input className="KHJ-detail-basic-input" value="음식" readOnly />
            </div>
            <div className="KHJ-detail-basic-category-item">
              <label className="KHJ-detail-basic-label">2차 카테고리</label>
              <input className="KHJ-detail-basic-input" value="베이킹" readOnly />
            </div>
          </div>
        </div>

        <div className="KHJ-detail-basic-row">
          <label className="KHJ-detail-basic-label">클래스 명</label>
          <input className="KHJ-detail-basic-full-input" value="밤을 굽자" readOnly />
        </div>

        <div className="KHJ-detail-basic-row">
          <label className="KHJ-detail-basic-label">장소</label>
          <div className="KHJ-detail-basic-location-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>장소명</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>주소</td>
                  <td>서울 강남구 논현로123길 4-1</td>
                </tr>
                <tr>
                  <td>좌표</td>
                  <td>위도: 12.3456 경도: 12.3456</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTabBasicInfo;
