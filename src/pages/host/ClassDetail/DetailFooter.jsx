import { useState } from 'react';
import './DetailFooter.css';

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
