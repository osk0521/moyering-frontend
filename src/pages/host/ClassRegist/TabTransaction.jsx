import { useState, useEffect } from 'react';
import './TabTransaction.css';

const TabTransaction = ({ registerValidator,classData,setClassData }) => {
    const {transaction} = classData;

    const handleCautionChange = (e) => {
        setClassData((prev) => ({
          ...prev,
          transaction:{
            ...prev.transaction,
            caution:e.target.value
          }
        }))
    };


    // 유효성 검사 함수 (필수 항목: 거래 정보, 환불 규정, 파일)
    const validate = () => {
        if (!transaction.caution.trim()) return false;
        return true;
    };

    // 부모 컴포넌트에 유효성 검사 함수 등록
    useEffect(() => {
        registerValidator(4, validate);
    }, [transaction.caution]);

  return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">거래 정보</h3>

      <div className="KHJ-form-section">
        <label className="KHJ-warning-info-label">
          <span className="KHJ-required-text-dot">*</span>신청 시 유의사항
        </label>
        <textarea
          className="KHJ-warning-info-textarea"
          value={transaction.caution || ''}
          onChange={handleCautionChange}
          placeholder="신청 시 유의사항을 입력해주세요."
        />
        <div className="KHJ-warning">
          수강자에게 보여지는 유의사항이에요. 확인 후 알맞게 변경해주세요.
        </div>
      </div>

      <div className="KHJ-form-section">
        <label className="KHJ-refund-policy-label">
          <span className="KHJ-required-text-dot">*</span>환불 규정
        </label>
        <textarea
          className="KHJ-refund-policy-textarea"
          placeholder="1. 결제 후 1시간 이내에는 무료 취소가 가능합니다. 
(단, 신청마감 이후 취소 시, 프립 진행 당일 결제 후 취소 시 취소 및 환불 불가) 
2. 결제 후 1시간이 초과한 경우, 아래의 환불규정에 따라 취소수수료가 부과됩니다. 
  - 신청마감 2일 이전 취소시 : 전액 환불 
  - 신청마감 1일 ~ 신청마감 이전 취소시 : 상품 금액의 50% 취소 수수료 배상 후 환불 
  - 신청마감 이후 취소시, 또는 당일 불참 : 환불 불가 
※ 다회권의 경우, 1회라도 사용시 부분 환불이 불가하며, 기간 내 호스트와 예약 확정 되지 않은 프립은 프립 에너지로 환불 됩니다. 
※ 여행사 상품의 경우 상품 상세 페이지의 여행사 환불 규정이 우선 적용 됩니다. 
※ 여행사 상품, 숙박, 이벤트 상품 등 객실, 버스 등 사전 예약 확정이 필요한 프립은 예약 확정 이후 신청마감일 이전이라도 취소 및 환불 불가합니다. 
※ 취소 수수료는 신청 마감일을 기준으로 산정됩니다. 
※ 신청 마감일은 무엇인가요? 
호스트님들이 장소 대관, 강습, 재료 구비 등 프립 진행을 준비하기 위해, 프립 진행일보다 일찍 신청을 마감합니다. 
환불은 진행일이 아닌 신청 마감일 기준으로 이루어집니다. 프립마다 신청 마감일이 다르니, 꼭 날짜와 시간을 확인 후 결제해주세요! : ) 
※신청 마감일 기준 환불 규정 예시 
  - 프립 진행일 : 10월 27일 
  - 신청 마감일 : 10월 26일 
    10월 25일에 취소 할 경우, 신청마감일 1일 전에 해당하며 50%의 수수료가 발생합니다. 
[환불 신청 방법] 
1. 해당 프립 결제한 계정으로 로그인 
2. 마이프립 - 신청내역 or 결제내역 
3. 취소를 원하는 프립 상세 정보 버튼 - 취소 
※ 결제 수단에 따라 예금주, 은행명, 계좌번호 입력"
        />
      </div>
    </div>
  );
};

export default TabTransaction;
