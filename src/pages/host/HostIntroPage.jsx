import { useAtomValue } from 'jotai';
import { Navigate, useNavigate } from 'react-router';
import { userAtom } from '../../atoms';
import './HostIntroPage.css';

const HostIntroPage = () => {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  if(!user || user.userType !== 'ROLE_HT'){
      return <Navigate to="/userLogin"/>
  }

  const handleNavigation = (path)=>{
    navigate(path)
  }
  return (
    <div className="KHJ-host-intro-container">
      <section className="KHJ-intro-section">
        <h2>수익이 궁금해요</h2>
        <p>
          모여링에서는 재미로 시작한 나의 취미로 수익도 내고 <br />
          많은 사람들의 일상을 특별하게 채울 수 있습니다.
        </p>
        <div className="KHJ-stats-box">
          <div>
            <h3>3만 명</h3>
            <p>등록 호스트 수</p>
          </div>
          <div>
            <h3>150만 명</h3>
            <p><a href="#">모여링 가입자 수</a></p>
          </div>
          <div>
            <h3>450만원</h3>
            <p>월 평균 호스트 수익</p>
          </div>
        </div>
      </section>

      <hr className="KHJ-divider" />

      <section className="KHJ-reason-section">
        <h2>모여링과 함께해야하는 이유</h2>
        <p>
          국내 최대 여가 액티비티 플랫폼 모여링과 함께 하면 <br />
          누구나 매력적인 콘텐츠를 가진 인기 호스트님이 될 수 있습니다
        </p>

        <div className="KHJ-reason-grid">
          {reasons.map((item, idx) => (
            <div className="KHJ-reason-item" key={idx}>
              <h3><span>{idx + 1}</span>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <button className="KHJ-start-btn" onClick={()=>handleNavigation('/host/regist')}>5분만에 호스트 시작하기 &gt;</button>
    </div>
  );
};

const reasons = [
  {
    title: '1:1 클래스 관리',
    desc: '1:1 전담 호스트팀 담당자가 배정되어 클래스 운영, 세금 신고 등 모든 활동을 체계적으로 돕습니다.'
  },
  {
    title: '나만의 브랜드 구축',
    desc: '모여링을 통해 나만의 브랜드를 알리고 인기 호스트로 성장할 수 있습니다.'
  },
  {
    title: '다양한 네트워크',
    desc: '팬과 수강생, 다른 호스트들과 다양한 교류와 협업이 가능합니다.'
  },
  {
    title: '마케팅 활성화',
    desc: '검색 최적화와 추천 광고 등 다양한 방식으로 홍보를 지원합니다.'
  },
  {
    title: '밀착 등록 지원',
    desc: '콘텐츠 전문가가 상시 등록과 운영을 도와드리며 클래스 확장을 돕습니다.'
  },
  {
    title: '기업 단체 모여링 연결',
    desc: '기업 또는 단체와 연결하여 더 큰 수익 기회를 얻을 수 있습니다.'
  }
];

export default HostIntroPage;
