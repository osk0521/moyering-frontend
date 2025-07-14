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
  const { classId, calendarId } = useParams();
  const [classData, setClassData] = useState(null);


  useEffect(() => {
    if (token && classId) {
      myAxios(token, setToken)
        .get(`/host/updateHostClassDetail?classId=${classId}`)
        .then(res => {
          const host = res.data.hostClass;
          console.log(host);
          const coupons = res.data.couponList;
          const scheduleDetail = res.data.scheduleDetail;
          const calendar = res.data.calendarList

          const initialClassData = {
            basicInfo: {
              category1: host.category1 || '',
              category2: host.category2 || '',
              subCategoryId: host.subCategoryId || '',
              categoryId: host.categoryId || '',
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
              dates: calendar || [],
              scheduleDetail: scheduleDetail || [{ content: '', startTime: '', endTime: '' }],
            },
            description: {
              imgName1: host.imgName1 || null,
              imgName2: host.imgName2 || null,
              imgName3: host.imgName3 || null,
              imgName4: host.imgName4 || null,
              imgName5: host.imgName5 || null,
              img1: null,
              img2: null,
              img3: null,
              img4: null,
              img5: null,
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
    console.log("🧾 최종 제출 직전 classData:", classData);
    // const cleanDates = [...new Set(
    //   (classData.schedule.dates || []).map(date =>
    //     new Date(date).toISOString().slice(0, 10)
    //   )
    // )].sort((a, b) => new Date(a) - new Date(b));

    const reqData = {
      ...classData.basicInfo,
      ...classData.classPortfolio,
      ...classData.description,
      ...classData.extraInfo,
      ...classData.schedule,
      ...classData.transaction
    };

    const formData = new FormData();

    formData.append("hostId", user.hostId);

    // append helper 함수
    const appendIfExists = (key, value) => {
      if (
        value !== null &&
        value !== undefined &&
        !(typeof value === 'string' && value.trim() === '')
      ) {
        formData.append(key, value);
      }
    };

    // 일반 필드 추가
    appendIfExists("classId", classId);
    appendIfExists("addr", reqData.addr);
    appendIfExists("category1", reqData.category1);
    appendIfExists("category2", reqData.category2);
    appendIfExists("subCategoryId", reqData.subCategoryId && parseInt(reqData.subCategoryId));
    appendIfExists("caution", reqData.caution);
    appendIfExists("price", reqData.price);

    // 날짜
    // if (cleanDates.length > 0) {
    //   formData.append("dates", JSON.stringify(cleanDates));
    // }

    // 스케줄 상세
    if (reqData.scheduleDetail && reqData.scheduleDetail.length > 0) {
      formData.append("scheduleDetail", JSON.stringify(reqData.scheduleDetail));
    }

    // 이미지
    reqData.img1 != null && formData.append("img1", reqData.img1);
    reqData.img2 != null && formData.append("img2", reqData.img2);
    reqData.img3 != null && formData.append("img3", reqData.img3);
    reqData.img4 != null && formData.append("img4", reqData.img4);
    reqData.img5 != null && formData.append("img5", reqData.img5);

    // 나머지 문자열 필드
    appendIfExists("detailDescription", reqData.detailDescription);
    appendIfExists("incluision", reqData.incluision);
    appendIfExists("keywords", reqData.keywords);
    appendIfExists("latitude", reqData.latitude);
    appendIfExists("locName", reqData.locName);
    appendIfExists("longitude", reqData.longitude);
    if (reqData.material && typeof reqData.material !== 'string') {
      formData.append("material", reqData.material);
    }
    appendIfExists("name", reqData.name);
    appendIfExists("preparation", reqData.preparation);
    appendIfExists("recruitMax", reqData.recruitMax);
    appendIfExists("recruitMin", reqData.recruitMin);

    // 쿠폰 (배열 처리)
    if (reqData.coupons && reqData.coupons.length > 0) {
      formData.append("coupons", JSON.stringify(reqData.coupons));
    }

    // 제출
    myAxios(token, setToken).post('/host/classUpdate/submit', formData)
      .then(res => {
        console.log(res.data);
        navigate(`/host/detail/${classId}/${calendarId}`);
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
          <div><div className="KHJ-label">상태</div><div className="KHJ-status current">{classData.status}</div></div>
          <div><div className="KHJ-label">검수상태</div><div className="KHJ-status current">{classData.status !== "검수중" ? "모집중" : classData.status}</div></div>
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
