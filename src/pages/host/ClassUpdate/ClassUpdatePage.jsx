import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { tokenAtom, userAtom } from '../../../atoms';
import { myAxios } from '../../../config';
import './ClassUpdatePage.css';
import UpdateTabBasicInfo from './UpdateTabBasicInfo';
import UpdateTabDescription from './UpdateTabDescription';
import UpdateTabExtraInfo from './UpdateTabExtraInfo';
import UpdateTabFooter from './UpdateTabFooter';
import UpdateTabPortfolio from './UpdateTabPortfolio';
import UpdateTabSchedule from './UpdateTabSchedule';
import UpdateTabTransaction from './UpdateTabTransaction';

const tabs = [
  '기본정보',
  '클래스 일정',
  '클래스 설명',
  '클래스 부가정보',
  '거래 정보',
];

const ClassUpdatePage = () => {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const [token, setToken] = useAtom(tokenAtom);
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    if (token && classId) {
      myAxios(token, setToken)
        .get(`/host/updateHostClassDetail?classId=${classId}`)
        .then(res => {
          const host = res.data.hostClass;
          console.log(res.data);
          const coupons = res.data.couponList;
          const scheduleDetail = res.data.scheduleDetail;
          
          const initialClassData = {
            basicInfo: {
              category1: host.category1 || '',
              category2: host.category2 || '',
              subCategoryId: host.subCategoryId || '',
              name: host.name || '',
              locName: host.locName || '',
              addr: host.addr || '',
              detailAddr: host.detailAddr || '',
              longitude: host.longitude || '',
              latitude: host.latitude || '',
            },
            schedule: {
              recruitMax: host.recruitMax || '',
              recruitMin: host.recruitMin || '',
              dates: host.startDate ? [host.startDate] : [],
              scheduleDetail: scheduleDetail || [{ content: '', startTime: '', endTime: '' }],
            },
            description: {
              img1: host.imgName1 || null,
              img2: host.imgName2 || null,
              img3: host.imgName3 || null,
              img4: host.imgName4 || null,
              img5: host.imgName5 || null,
              detailDescription: host.detailDescription || '',
            },
            extraInfo: {
              material: host.materialName || '',
              incluision: host.incluision || '',
              preparation: host.preparation || '',
              keywords: host.keywords || '',
              coupons: coupons || [],
            },
            transaction: {
              caution: host.caution || '',
              price: host.price || '',
            },
            classPortfolio: {
              portfolio: host.portfolioName || null,
            },
          };
          setClassData(initialClassData);
        })
        .catch(console.error);
    }
  }, [token, classId, setToken]);

  const [activeTab, setActiveTab] = useState(0);
  const validators = useRef([]);

  const registerValidator = (index, validateFn) => {
    validators.current[index] = validateFn;
  };

  const handleTabClick = async (nextTabIndex) => {
    setActiveTab(nextTabIndex);
  };

  const handleReset = () => {
    if (hostClass && couponList) {
      const confirmed = window.confirm("정말 입력한 내용을 초기화하시겠습니까?");
      if (confirmed) {
        setClassData(prev => ({ ...prev })); // 다시 초기화
      }
    }
  };

  const submit = () => {
    const cleanDates = [...new Set(
      (classData.schedule.dates || []).map(date =>
        new Date(date).toISOString().slice(0, 10)
      )
    )].sort((a, b) => new Date(a) - new Date(b));

    let reqData = {
      ...classData.basicInfo,
      ...classData.classPortfolio,
      ...classData.description,
      ...classData.extraInfo,
      ...classData.schedule,
      ...classData.transaction
    };

    let formData = new FormData();
    formData.append("hostId", user.hostId);
    formData.append("addr", reqData.addr);
    formData.append("category1", reqData.category1);
    formData.append("category2", reqData.category2);
    formData.append("subCategoryId", parseInt(reqData.subCategoryId));
    formData.append("caution", reqData.caution);
    formData.append("price", reqData.price);
    formData.append("dates", cleanDates);
    formData.append("scheduleDetail", JSON.stringify(reqData.scheduleDetail));
    formData.append("detailDescription", reqData.detailDescription);
    if (reqData.img1) formData.append("img1", reqData.img1);
    if (reqData.img2) formData.append("img2", reqData.img2);
    if (reqData.img3) formData.append("img3", reqData.img3);
    if (reqData.img4) formData.append("img4", reqData.img4);
    if (reqData.img5) formData.append("img5", reqData.img5);
    formData.append("incluision", reqData.incluision);
    formData.append("keywords", reqData.keywords);
    formData.append("coupons", JSON.stringify(reqData.coupons));
    formData.append("latitude", reqData.latitude);
    formData.append("locName", reqData.locName);
    formData.append("longitude", reqData.longitude);
    formData.append("material", reqData.material);
    formData.append("name", reqData.name);
    formData.append("portfolio", reqData.portfolio);
    formData.append("preparation", reqData.preparation);
    formData.append("recruitMax", reqData.recruitMax);
    formData.append("recruitMin", reqData.recruitMin);

    myAxios(token, setToken).post('/host/classRegist/submit', formData)
      .then(res => {
        navigate("/host/HostclassList");
      })
      .catch(console.error);
  };

  if (!classData) return <div>로딩 중...</div>;

  const renderTabContent = () => {
    const props = { classData, setClassData, registerValidator };
    switch (activeTab) {
      case 0: return <UpdateTabBasicInfo {...props} />;
      case 1: return <UpdateTabSchedule {...props} />;
      case 2: return <UpdateTabDescription {...props} />;
      case 3: return <UpdateTabExtraInfo {...props} />;
      case 4: return <UpdateTabTransaction {...props} />;
      default: return null;
    }
  };

  return (
    <div className="KHJ-register-page">
      <div className="KHJ-class-info-box">
        <h3>클래스 상세</h3>
        <div className="KHJ-info-grid">
          <div><div className="KHJ-label">클래스</div><div>-</div></div>
          <div><div className="KHJ-label">ID</div><div>{classId}</div></div>
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
      <UpdateTabFooter activeTab={activeTab} onSubmit={submit} handleReset={handleReset} />
    </div>
  );
};

export default ClassUpdatePage;
