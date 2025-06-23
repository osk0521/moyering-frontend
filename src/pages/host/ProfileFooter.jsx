// TabFooter.jsx
import { useState } from 'react';
import './ProfileFooter.css';
import React from 'react'; // 이 한 줄만 추가!

const TabFooter = ({ activeTab }) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className='KHJ-footer'>
      <div className="KHJ-footer__buttons">
        <button className="KHJ-footer__btn KHJ-footer__btn--save">저장</button>
      </div>
    </div>
  );
};

export default TabFooter;
