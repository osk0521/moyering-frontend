// src/components/pages/MemberDetailModal.jsx
import React from 'react';
import './MemberDetailModal.css';

const MemberDetailModal = ({ member, onClose }) => {
  
  // 임시 수강 내역 데이터 
  const classHistory = [
    {
      no: 1, // 일련번호 
      category : '언어 > 영어',
      className: '영어회화 도전기', // 클래스명
      paidAmount: 120000, // 결제금액 
      classAmount: 108000,  // 클래스 금액 
      couponAmount : 3000, // 쿠폰 사용금액
      couponType : "강사할인(비율)", // 쿠폰 유형
      commission : 6000, // 수수료 
      paidDate : '2025-05-12', // 결제일
      participateDate : '2025-05-20' // 참여일 
    },
    {
    no: 2,
     category : '언어 > 영어',
    className: '비즈니스 영어 마스터',
    paidAmount: 150000,
    classAmount: 135000,
    couponAmount: 5000,
    couponType: '관리자할인(금액)',
    commission: 7500,
    paidDate: '2025-04-25',
    participateDate: '2025-05-01'
  },
  {
    no: 3,
     category : '언어 > 영어',
    className: '왕초보 일본어 회화',
    paidAmount: 90000,
    classAmount: 85000,
    couponAmount: 0,
    couponType: '',
    commission: 5000,
    paidDate: '2025-03-30',
    participateDate: '2025-04-05'
  },
  {
    no: 4,
     category : '언어 > 영어',
    className: '중국어 기초반',
    paidAmount: 100000,
    classAmount: 95000,
    couponAmount: 5000,
    couponType: '관리자 할인(비율)',
    commission: 5500,
    paidDate: '2025-06-01',
    participateDate: '2025-06-08'
  },
  {
    no: 5,
     category : '언어 > 영어',
    className: '프랑스어 원데이 클래스',
    paidAmount: 60000,
    classAmount: 57000,
    couponAmount: 3000,
    couponType: '강사할인(비율)',
    commission: 3000,
    paidDate: '2025-05-28',
    participateDate: '2025-06-02'
  }
  ]


  // 임시 개설 클래스 데이터 (강사용)
  const openedClasses = [
    {
      no: 1,
      category : 'DIY공예 > 도자기',
      className: 'DIY 공예 원데이클래스', // 클래스명 
      classAmount: 108000, // 클래스 금액
      participants: 20, // 수강인원
      totalAmount: 432000, // 총 금액 
      discountAmount : 30400, // 할인 금액 
      commission: 86400, // 수수료
      settleAmount: 1814400, // 정산금액
      settlementDate: '2025-05-12', // 정산일
      classDate: '2025-05-10', // 클래스 일자
      regDate: '2025-04-30', // 개설일자 
      status: '대기' // 상태
    },
    {
    no: 2,
    category : 'DIY공예 > 도자기',
    className: '홈베이킹 마스터 클래스',
    classAmount: 95000,
    participants: 15,
    totalAmount: 285000,
    discountAmount: 15000,
    commission: 57000,
    settleAmount: 1140000,
    settlementDate: '2025-05-20',
    classDate: '2025-05-18',
    regDate: '2025-05-05',
    status: '정산완료',
  },
  {
    no: 3,
    category : 'DIY공예 > 도자기',
    className: '캘리그라피 입문반',
    classAmount: 88000,
    participants: 10,
    totalAmount: 176000,
    discountAmount: 8000,
    commission: 35200,
    settleAmount: 704000,
    settlementDate: '2025-06-02',
    classDate: '2025-05-30',
    regDate: '2025-05-10',
    status: '정산완료',
  },
  {
    no: 4,
    category : 'DIY공예 > 도자기',
    className: '천연비누 만들기',
    classAmount: 70000,
    participants: 12,
    totalAmount: 168000,
    discountAmount: 12000,
    commission: 33600,
    settleAmount: 672000,
    settlementDate: '2025-06-05',
    classDate: '2025-06-01',
    regDate: '2025-05-15',
    status: '대기',
  },
  {
    no: 5,
    category : 'DIY공예 > 도자기',
    className: '아크릴화 그리기',
    classAmount: 115000,
    participants: 8,
    totalAmount: 184000,
    discountAmount: 9200,
    commission: 36800,
    settleAmount: 736000,
    settlementDate: '2025-06-10',
    classDate: '2025-06-08',
    regDate: '2025-05-20',
    status: '정산완료',
  },
];

// 임시 신고 내역 데이터
const reportHistory = [
  {
    no: 1,
    seg: '신고함',
    type: '게시글',
    title: '부적절한 내용',
    date: '2025-05-15',
    reportStatus: '대기'
  },
  {
    no: 2,
    seg: '신고받음',
    type: '댓글',
    title: '욕설 포함',
    date: '2025-06-01',
    reportStatus: '대기'
  },

    {
    no: 3,
    seg: '신고함',
    type: '강사신고',
    title: '강의 품질 저하',
    date: '2025-06-01',
    reportStatus: '완료'
  }

];


 return (
    <div className="modal-overlayHY" onClick={onClose}>
      <div className="modal-contentHY" onClick={(e) => e.stopPropagation()}>
        
        {/* 모달 헤더 */}
        <div className="modal-headerHY">
          <h2>{member.name} 회원 상세 정보</h2>
          <div className="header-buttonsHY">
            {member.use_yn === 'Y' ? (
              <button className="deactivate-btnHY">계정 비활성화</button>
            ) : (
              <button className="activate-btnHY">계정 활성화</button>
            )}
          

            <button className="close-btnHY" onClick={onClose}>닫기</button>
          </div>
        </div>

        {/* 회원 기본 정보 */}
        <div className="member-basic-infoHY">
          <div className="info-rowHY">
            <div className="info-itemHY">
              <label>아이디</label>
              <span>{member.username}</span>
            </div>
            <div className="info-itemHY">
              <label>이메일</label>
              <span>{member.email}</span>
            </div>
            <div className="info-itemHY">
              <label>가입일</label>
              <span>{member.joinDate}</span>
            </div>
          </div>
          <div className="info-rowHY">
            <div className="info-itemHY">
              <label>회원 구분</label>
              <span className={`member-badge ${member.type === '강사' ? 'instructor' : 'general'}`}>
                {member.type}
              </span>
            </div>
            <div className="info-itemHY">
              <label>상태</label>
              <span className={`status-badge ${member.use_yn === 'Y' ? 'active' : 'inactive'}`}>
                {member.use_yn === 'Y' ? '활성' : '비활성'}
              </span>
            </div>
          </div>
        </div>

        {/* 활동 내역 */}
        <div className="activity-sectionHY">
          <h3>활동 내역</h3>

          {/* 수강 클래스 (공통) */}
          <div className="class-sectionHY">
            <div className="section-headerHY">
              <h4>수강 클래스 ({classHistory.length}개)</h4>
            </div>
            <div className="table-containerHY">
              <table className="detail-tableHY">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>카테고리</th>
                    <th>클래스명</th>
                    <th>결제금액</th>
                    <th>클래스 금액</th>
                    <th>쿠폰 사용금액</th>
                    <th>쿠폰 유형</th>
                    <th>수수료</th>
                    <th>결제일</th>
                    <th>참여일</th>
                  </tr>
                </thead>
                <tbody>
                  {classHistory.map((item) => (
                    <tr key={item.no}>
                      <td>{item.no}</td>
                      <td>{item.category}</td>
                      <td>{item.className}</td>
                      <td>{item.paidAmount.toLocaleString()}원</td>
                      <td>{item.classAmount.toLocaleString()}원</td>
                      <td>{item.couponAmount.toLocaleString()}원</td>
                      <td>{item.couponType || '-'}</td>
                      <td>{item.commission.toLocaleString()}원</td>
                      <td>{item.paidDate}</td>
                      <td>{item.participateDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 개설한 클래스 (강사만) */}
          {member.type === '강사' && (
            <div className="class-sectionHY">
              <div className="section-headerHY">
                <h4>개설한 클래스 ({openedClasses.length}개)</h4>
            
              </div>
              <div className="table-containerHY">
                <table className="detail-tableHY">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>카테고리</th>
                      <th>클래스명</th>
                      <th>개설일</th>
                      <th>클래스 금액</th>
                      <th>수강인원</th>
                      <th>총 금액</th>
                      <th>할인 금액</th>
                      <th>수수료</th>
                      <th>정산금</th>
                      <th>정산일</th>
                      <th>클래스 일자</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openedClasses.map((item) => (
                      <tr key={item.no}>
                        <td>{item.no}</td>
                        <td>{item.category}</td>
                        <td>{item.className}</td>
                        <td>{item.regDate}</td>
                        <td>{item.classAmount.toLocaleString()}원</td>
                        <td>{item.participants}명</td>
                        <td>{item.totalAmount.toLocaleString()}원</td>
                        <td>{item.discountAmount.toLocaleString()}원</td>
                        <td>{item.commission.toLocaleString()}원</td>
                        <td>{item.settleAmount.toLocaleString()}원</td>
                        <td>{item.settlementDate}</td>
                        <td>{item.classDate}</td>
                        <td>
                          <span className={`status-badge ${item.status === '정산완료' ? 'complete' : item.status === '정산완료' ? 'settled' : 'waiting'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 신고 내역 (공통) */}
          <div className="report-sectionHY">
            <h4>신고 내역</h4>
            <div className="table-containerHY">
              <table className="detail-tableHY">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>구분</th>
                    <th>유형</th>
                    <th>신고제목</th>
                    <th>신고일</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {reportHistory.map((item) => (
                    <tr key={item.no}>
                      {/* 일련번호 */}
                      <td>{item.no}</td>  {/* 일련번호 */}
                      <td>{item.seg}</td> {/* 신고 구분 (신고받음, 신고함) */}
                      <td>{item.type}</td> {/* 유형  */}
                      <td>{item.title}</td> {/* 신고제목 */}
                      <td>{item.date}</td> {/* 신고일 */}
                      <td>
                        {/* 상태에 따라 (대기 & 완료) 뱃지 색상 다름  */}
                        <span
                      className={`status-badge ${
                        item.reportStatus === '대기' ? 'waiting' :
                        item.reportStatus === '완료' ? 'complete' :
                        ''
                      }`}
                    >
                      {item.reportStatus}
                    </span>
                      </td>
                  
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;