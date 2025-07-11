import React, { useEffect, useState } from 'react';
import './SettlementModal.css';
import { myAxios } from '/src/config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const SettlementModal = ({ isOpen, onClose, settlementInfo, onConfirmSettlement }) => {
  const token = useAtomValue(tokenAtom);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 수강생 결제 내역 불러오기
  useEffect(() => {
    if (!isOpen || !settlementInfo) {
      setPayments([]); // 모달이 닫힐 때 데이터 초기화
      return;
    }

    const fetchPayments = async () => {
      setLoading(true);
      try {
        console.log('결제 내역 요청:', {
          settlementId: settlementInfo.settlementId,
          calendarId: settlementInfo.calendarId,
          size: 100
        });

        // URL 템플릿 문자열을 실제 값으로 치환
        const response = await myAxios(token).get(`/api/settlement/${settlementInfo.settlementId}/payments`, {
          params: {
            calendarId: settlementInfo.calendarId,
            size: 100
          }
        });

        console.log('결제 내역 응답:', response.data);
        
        // 백엔드에서 배열 형태로 오는 경우와 페이지네이션 형태로 오는 경우 모두 처리
        const paymentData = response.data.content || response.data || [];
        setPayments(paymentData);

      } catch (err) {
        console.error('결제 내역 로드 실패:', err);
        setPayments([]);
        alert('결제 내역을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [isOpen, settlementInfo, token]);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen || !settlementInfo) return null;

  const handleConfirm = () => {
    if (!window.confirm('정산을 확정하시겠습니까?')) return;
    
    // 백엔드 데이터 구조에 맞게 수정 (totalAmount 사용)
    const totalAmount = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    const stats = {
      totalSettlementAmount: totalAmount,
      totalPayments: payments.length
    };

    onConfirmSettlement(settlementInfo.settlementId, stats);
  };

  // 결제 방식 한글 변환
  const getPaymentTypeText = (paymentType) => {
    const paymentTypes = {
      'CARD': '카드',
      'KAKAO_PAY': '카카오페이',
      'NAVER_PAY': '네이버페이',
      'TOSS_PAY': '토스페이',
      'BANK_TRANSFER': '계좌이체',
      'VIRTUAL_ACCOUNT': '가상계좌'
    };
    return paymentTypes[paymentType] || paymentType;
  };

  // 쿠폰 타입 한글 변환
  const getCouponTypeText = (couponType) => {
    const couponTypes = {
      'MG': '관리자',
      'HT': '호스트'
    };
    return couponTypes[couponType] || couponType;
  };

  // 할인 타입 한글 변환
  const getDiscountTypeText = (discountType) => {
    const discountTypes = {
      'RT': '비율',
      'AMT': '금액'
    };
    return discountTypes[discountType] || discountType;
  };

  // 할인 정보 표시
  const getDiscountInfo = (payment) => {
    if (!payment.couponType) return '-';
    
    const couponText = getCouponTypeText(payment.couponType);
    const discountText = getDiscountTypeText(payment.discountType);
    
    if (payment.discountType === 'RT') {
      return `${couponText} ${payment.discountAmount}%`;
    } else {
      return `${couponText} ${(payment.discountAmount || 0).toLocaleString()}원`;
    }
  };

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlayHY" onClick={handleOverlayClick}>
      <div className="modal-contentHY">
        <h2>정산 확인</h2>
        
        <p><strong>클래스명:</strong> {settlementInfo.className || '정보 없음'}</p>
        <p><strong>예정 정산 금액:</strong> {settlementInfo.settleAmountToDo?.toLocaleString() || '0'}원</p>
        
        <div style={{ marginTop: '20px' }}>
          <p><strong>수강생 결제 내역:</strong></p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
              불러오는 중...
            </div>
          ) : (
            <div style={{ marginTop: '12px' }}>
              <table className="student-tableHY">
                <thead>
                  <tr>
                    <th>주문번호</th>
                    <th>수강생 ID</th>
                    <th>결제금액</th>
                    <th>쿠폰할인</th>
                    <th>결제방식</th>
                    <th>결제일</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((payment, index) => (
                      <tr key={payment.paymentId || index}>
                        <td>{payment.orderNo || '-'}</td>
                        <td>{payment.studentId || '-'}</td>
                        <td className="amount-cell">
                          {(payment.totalAmount || 0).toLocaleString()}원
                        </td>
                        <td>{getDiscountInfo(payment)}</td>
                        <td>{getPaymentTypeText(payment.paymentType)}</td>
                        <td>
                          {payment.payDate 
                            ? new Date(payment.payDate).toLocaleDateString('ko-KR')
                            : '-'
                          }
                        </td>
                        <td>
                          <span className={`status-badge ${payment.status === '결제완료' ? 'completed' : 'pending'}`}>
                            {payment.status || '-'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        결제 내역이 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {payments.length > 0 && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#666' }}>총 {payments.length}건</span>
                    <span style={{ color: '#333', fontWeight: '600', fontSize: '16px' }}>
                      총 결제 금액: {payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0).toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-actionsHY">
          <button type="button" onClick={onClose}>
            취소
          </button>
          <button 
            type="button" 
            onClick={handleConfirm} 
            disabled={loading || payments.length === 0}
          >
            정산 확정
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementModal;