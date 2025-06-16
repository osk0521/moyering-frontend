import { useRef, useState } from 'react';
import './ClassRegisterPage.css';
import TabBasicInfo from './TabBasicInfo';
import TabDescription from './TabDescription';
import TabExtraInfo from './TabExtraInfo';
import TabFooter from './TabFooter';
import TabPortfolio from './TabPortfolio';
import TabSchedule from './TabSchedule';
import TabTransaction from './TabTransaction';

const tabs = [
  '기본정보',
  '클래스 일정',
  '클래스 설명',
  '클래스 부가정보',
  '거래 정보',
  '포트폴리오 검수',
];

const ClassRegisterPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const validators = useRef([]);

  const registerValidator = (index, validateFn) => {
    validators.current[index] = validateFn;
  };

  const handleTabClick = async (nextTabIndex) => {
    // if (nextTabIndex === activeTab) return;

    // const validateCurrent = validators.current[activeTab];
    // if (validateCurrent) {
    //   const isValid = await validateCurrent();
    //   if (!isValid) {
    //     alert('현재 탭의 정보를 모두 입력해주세요.');
    //     return;
    //   }
    // }
    setActiveTab(nextTabIndex);
  };

  const renderTabContent = () => {
    const props = { registerValidator };
    switch (activeTab) {
      case 0: return <TabBasicInfo {...props} />;
      case 1: return <TabSchedule {...props} />;
      case 2: return <TabDescription {...props} />;
      case 3: return <TabExtraInfo {...props} />;
      case 4: return <TabTransaction {...props} />;
      case 5: return <TabPortfolio {...props} />;
      default: return null;
    }
  };

  return (
    <div className="KHJ-register-page">
      <div className="KHJ-class-info-box">
        <h3>클래스 상세</h3>
        <div className="KHJ-info-grid">
          <div><div className="KHJ-label">클래스</div><div>-</div></div>
          <div><div className="KHJ-label">ID</div><div>1234</div></div>
          <div><div className="KHJ-label">상태</div><div className="KHJ-status current">현재</div></div>
          <div><div className="KHJ-label">검수상태</div><div className="KHJ-status current">현재</div></div>
        </div>
      </div>

      <div className="KHJ-tab-menu">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`KHJ-tab-item ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="KHJ-tab-content">{renderTabContent()}</div>
      <TabFooter activeTab={activeTab} />
    </div>
  );
};

export default ClassRegisterPage;
