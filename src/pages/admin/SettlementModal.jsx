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
        const response = await myAxios(token).get('/api/payment', {
          params: {
            calendarId: settlementInfo.calendarId,
            size: 100
          }
        });
        setPayments(response.data.content || []);
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
    
    const totalAmount = payments.reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
    const stats = {
      totalSettlementAmount: totalAmount,
      totalPayments: payments.length
    };

    onConfirmSettlement(settlementInfo.settlementId, stats);
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
                    <th>수강생 이름</th>
                    <th>결제금액</th>
                    <th>결제일</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((p, index) => (
                      <tr key={p.paymentId || index}>
                        <td>{p.studentName || '-'}</td>
                        <td>{(p.paymentAmount || 0).toLocaleString()}원</td>
                        <td>
                          {p.paidAt 
                            ? new Date(p.paidAt).toLocaleDateString('ko-KR')
                            : 'Invalid Date'
                          }
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        결제 내역이 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {payments.length > 0 && (
                <div style={{ marginTop: '16px', textAlign: 'right', color: '#333', fontWeight: '600' }}>
                  총 결제 금액: {payments.reduce((sum, p) => sum + (p.paymentAmount || 0), 0).toLocaleString()}원
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
            disabled={loading}
          >
            정산 확정
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementModal;