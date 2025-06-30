import { useState } from 'react';
import './TabFooter.css';
import React from 'react'; // 이 한 줄만 추가!

const TabFooter = ({ activeTab,onSubmit }) => {
  const [isPreview, setIsPreview] = useState(false);

  // 각 탭에 따라 다른 버튼 표시
  const renderFooterButtons = () => {
    if (activeTab === 5) {
      return (
        <div className="KHJ-footer-buttons">
          <button className="KHJ-footer-btn KHJ-preview-btn" onClick={() => setIsPreview(!isPreview)}>
            미리보기
          </button>
          <button className="KHJ-footer-btn KHJ-save-btn" onClick={onSubmit}>저장</button>
          <button className="KHJ-footer-btn KHJ-delete-btn">삭제</button>
          <button className="KHJ-footer-btn KHJ-review-request-btn" onClick={onSubmit}>검수 요청</button>
        </div>
      );
    } else {
      return (
        <div className="KHJ-footer-buttons">
          <button className="KHJ-footer-btn KHJ-preview-btn" onClick={() => setIsPreview(!isPreview)}>
            미리보기
          </button>
          <button className="KHJ-footer-btn KHJ-save-btn" onClick={onSubmit}>저장</button>
          <button className="KHJ-footer-btn KHJ-delete-btn">삭제</button>
        </div>
      );
    }
  };

  return <div className="KHJ-footer">{renderFooterButtons()}</div>;
};

export default TabFooter;
