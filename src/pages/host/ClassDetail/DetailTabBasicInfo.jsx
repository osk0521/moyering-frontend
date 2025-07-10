import KakaoMap from '../../common/KakaoMap';
import './DetailTabBasicInfo.css';
import React, { useEffect } from 'react';

const DetailTabBasicInfo = ({ classData, registerValidator, isEditMode }) => {
  const {
    category1,
    category2,
    name,
    locName,
    addr,
    detailAddr,
    latitude,
    longitude,
  } = classData || {};

  useEffect(() => {
    registerValidator(0, () => {
      if (!name || !addr) {
        alert("클래스명과 주소는 필수입니다.");
        return false;
      }
      return true;
    });
  }, [classData]);

  return (
    <div className="KHJ-class-detail-container">
      <div className="KHJ-detail-basic-row">
        <label className="KHJ-detail-basic-label">장소</label>
        <div className="KHJ-detail-basic-location-table">
          <table>
            <thead>
              <tr>
                <th>장소명</th>
                <td>{locName}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>주소</th>
                <td>{addr} {detailAddr}</td>
              </tr>
              <tr>
                <th>좌표</th>
                <td>위도: {latitude} 경도: {longitude}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="KHJ-detail-basic-row">
        <KakaoMap
          latitude={latitude}
          longitude={longitude}
          address={`${addr} ${detailAddr ?? ""}`}
        />
      </div>
    </div>
  );
};

export default DetailTabBasicInfo;
