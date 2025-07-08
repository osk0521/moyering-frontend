// TabFooter.jsx
import { useEffect, useState } from 'react';
import './ProfileFooter.css';
import React from 'react'; // 이 한 줄만 추가!

const TabFooter = ({ activeTab,submitAccount,submitProfile,isUpdateProfile,isUpdateSettle }) => {
  const [isPreview, setIsPreview] = useState(false);


  return (
    <div className='KHJ-footer'>
      <div className="KHJ-footer__buttons">
        {activeTab === 'profile' ?<button className="KHJ-footer__btn KHJ-footer__btn--save" onClick={submitProfile} disabled={!isUpdateProfile}>저장</button>
         :
         <button className="KHJ-footer__btn KHJ-footer__btn--save" onClick={submitAccount} disabled={!isUpdateSettle}>저장</button>}

      </div>
    </div>
  );
};

export default TabFooter;
