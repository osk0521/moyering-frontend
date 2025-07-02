import './DetailTabDescription.css';
import React, { useEffect } from 'react';
import { url } from '../../../config';

const DetailTabDescription = ({ classData, registerValidator, isEditMode }) => {
  const {
    detailDescription,
    imgName1,
    imgName2,
    imgName3,
    imgName4,
    imgName5,
  } = classData || {};

  const images = [imgName1, imgName2, imgName3, imgName4, imgName5].filter(Boolean);

  useEffect(() => {
    registerValidator(2, () => {
      if (!detailDescription) {
        alert("클래스 설명을 입력해주세요.");
        return false;
      }
      return true;
    });
  }, [classData]);

  return (
    <div className="KHJ-description-tab-container">
      <h2 className="KHJ-description-section-title">클래스 설명</h2>

      {/* 대표 이미지 */}
      <div className="KHJ-description-image-section">
        <div className="KHJ-description-image-label">대표 이미지</div>
        <div className="KHJ-description-image-list">
          {images.length > 0 ? (
            images.map((src, idx) => (
              <img key={idx} src={`${url}/image?filename=${src}`} alt={`대표 이미지${idx + 1}`} />
            ))
          ) : (
            <p style={{ color: '#888' }}>등록된 이미지가 없습니다.</p>
          )}
        </div>
      </div>

      <div className="KHJ-description-divider" />

      {/* 상세 설명 */}
      <div className="KHJ-description-detail-section">
        <div className="KHJ-description-detail-label">클래스 상세설명</div>
        <div className="KHJ-description-detail-content KHJ-description-box">
          <div
            className="KHJ-description-paragraph"
            dangerouslySetInnerHTML={{
              __html: detailDescription || '<p>설명이 없습니다.</p>',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailTabDescription;
