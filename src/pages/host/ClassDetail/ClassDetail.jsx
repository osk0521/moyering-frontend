import { useState, useEffect, useRef } from 'react';
import DetailTabBasicInfo from './DetailTabBasicInfo';
import DetailTabSchedule from './DetailTabSchedule';
import DetailTabDescription from './DetailTabDescription';
import DetailTabExtraInfo from './DetailTabExtraInfo';
import DetailTabStudent from './DetailTabStudent';
import DetailFooter from './DetailFooter';
import React from 'react'; // 이 한 줄만 추가!
// import './ClassDetail.module.css' → 제거
import './ClassDetail.css'; // 일반 CSS로 import
import { myAxios } from '../../../config';
import { useNavigate, useParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';

const tabs = [
  '클래스 설명',
  '장소',
  '클래스 부가정보',
  '쿠폰',
  '수강생 정보',

];

const ClassDetail = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [classData, setClassData] = useState(null);
  const [scheduleDetails,setScheduleDetails] = useState([]);
  const [couponList,setCouponList] = useState([]);
  const { classId, calendarId } = useParams();
  const navigate = useNavigate();
  
  const [token,setToken] = useAtom(tokenAtom);
  const validators = useRef([]);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    token && myAxios(token,setToken).get(`/host/hostClassDetail`, {
      params: {
        hostId: user.hostId,
        classId: classId,
        calendarId: calendarId
      }
    })
      .then(res => {
        setClassData(res.data.hostClass);
        setScheduleDetails(res.data.scheduleDetail);
        setCouponList(res.data.couponList);
        console.log(res.data);
      })
      .catch(err => {
        console.error('클래스 상세 정보 로딩 실패:', err);
        console.log("token:" + token)
      });
  }, [classId, calendarId, token]);

  const update = () => {
    navigate(`/host/classUpdate/${classId}/${calendarId}`)
  }

  const registerValidator = (index, validateFn) => {
    validators.current[index] = validateFn;
  };

  const handleTabClick = async (nextIndex) => {
    const validate = validators.current[activeTab];
    if (validate) {
      const valid = await validate();
      if (!valid) return;
    }
    setActiveTab(nextIndex);
  };

  const renderTabContent = () => {
    const props = { registerValidator, classData,scheduleDetails,couponList, isEditMode: true };
    switch (activeTab) {
      case 0: return <DetailTabDescription {...props} />;
      case 1: return <DetailTabBasicInfo {...props} />;
      case 2: return <DetailTabExtraInfo {...props} />;
      case 3: return <DetailTabSchedule {...props}/>;
      case 4: return <DetailTabStudent {...props} />;
      default: return null;
    }
  };

  return (
    <div className="KHJ-register-page">
      {classData && (
        <>
          <div className="KHJ-class-info-box">
            <h3>클래스 상세</h3>
            <div className="KHJ-info-grid">
              <div>
                <div className="KHJ-label">클래스</div>
                <div>{classData.name}</div>
              </div>
              <div>
                <div className="KHJ-label">카테고리</div>
                <div>{classData.category1}</div>
              </div>
              <div>
                <div className="KHJ-label">서브카테고리</div>
                <div>{classData.category2}</div>
              </div>
              <div>
                <div className="KHJ-label">검수상태</div>
                <div className="KHJ-status KHJ-current">{classData.status}</div>
              </div>
            </div>
          </div>

          <div className="KHJ-tab-menu">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`KHJ-tab-item ${activeTab === index ? 'KHJ-active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="KHJ-tab-content">{renderTabContent()}</div>
        </>
      )}
      <DetailFooter onUpdate={update} />
    </div>
  );
};

export default ClassDetail;
