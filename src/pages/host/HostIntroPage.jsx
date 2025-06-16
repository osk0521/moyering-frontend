import React from 'react';
import './HostIntroPage.css';

const HostIntroPage = () => {
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
              <h3><span>{idx + 1}</span> {item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const reasons = [
  {
    title: '1:1매칭호스트 관리',
    desc: '1:1전담 호스트팀의 담당자가 배정되어 클래스 운영, 세금 신고 등 모든 활동을 체계적으로 돕습니다.'
  },
  {
    title: '나만의 브랜드 구축',
    desc: '모여링 플랫폼 또는 블로그 인기도 등을 통해 콘텐츠 브랜드로서 확장을 만들어갈 수 있습니다.'
  },
  {
    title: '다양한 네트워크',
    desc: '지속 가능한 활동을 위해 콘텐츠 경험자와 팬을 만들고, 호스트 네트워크에서 다양한 사례를 공유하고 협업도 나누며 함께 성장합니다.'
  },
  {
    title: '마케팅 활성화',
    desc: '다양한 프로모션의 집합과 고객을 연결하는 검색, 추천광고가 다양한 활동을 효율적으로 돕습니다.'
  },
  {
    title: '콘텐츠 등록',
    desc: '모여링은 콘텐츠 전문가가 상시 등록을 도와드리며, 다양한 활동이 클래스 콘텐츠로 발전할 수 있도록 함께 고민합니다.'
  },
  {
    title: '기업 단체 모여링 연결',
    desc: '기업과 단체의 콘텐츠 연결도 지원하며, 다양한 수익의 확장이 가능합니다.'
  }
];

export default HostIntroPage;
