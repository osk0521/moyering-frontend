import { useState } from 'react';
import './DetailFooter.css';
import React from 'react'; // 이 한 줄만 추가!

const DetailFooter = ({ activeTab }) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="KHJ-footer">
      <div className="KHJ-footer-buttons">
        <button className="KHJ-footer-btn KHJ-save-btn">수정</button>
      </div>
    </div>
  );
};

export default DetailFooter;
