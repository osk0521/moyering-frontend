import React, { useState, useEffect } from 'react';
import './Settlement.css';

const SettlementModal = ({ 
  isOpen, 
  onClose, 
  classInfo, 
  onFetchStudents // 실제 API 연동 시 사용할 함수
}) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 더미 데이터
  const dummyStudents = [
    {
      id: 1,
      studentId: 'STU001',
      studentName: '김수강',
      email: 'kimsu@example.com',
      phone: '010-1234-5678',
      paymentId: 'PAY001',
      paymentAmount: 150000,
      paymentDate: '2024-01-15',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
      cardCompany: '신한카드',
      cardNumber: '****-****-****-1234',
      enrollmentDate: '2024-01-10',
      attendanceStatus: 'ATTENDED'
    },
    {
      id: 2,
      studentId: 'STU002',
      studentName: '이학습',
      email: 'leehak@example.com',
      phone: '010-2345-6789',
      paymentId: 'PAY002',
      paymentAmount: 150000,
      paymentDate: '2024-01-16',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'TRANSFER',
      bankName: '우리은행',
      accountNumber: '1002-123-456789',
      enrollmentDate: '2024-01-11',
      attendanceStatus: 'ATTENDED'
    },
    {
      id: 3,
      studentId: 'STU003',
      studentName: '박공부',
      email: 'parkgong@example.com',
      phone: '010-3456-7890',
      paymentId: 'PAY003',
      paymentAmount: 150000,
      paymentDate: '2024-01-17',
      paymentStatus: 'REFUNDED',
      paymentMethod: 'CARD',
      cardCompany: '국민카드',
      cardNumber: '****-****-****-5678',
      enrollmentDate: '2024-01-12',
      attendanceStatus: 'CANCELLED',
      refundDate: '2024-01-20',
      refundAmount: 150000,
      refundReason: '개인 사정'
    },
    {
      id: 4,
      studentId: 'STU004',
      studentName: '최열정',
      email: 'choiyeol@example.com',
      phone: '010-4567-8901',
      paymentId: 'PAY004',
      paymentAmount: 150000,
      paymentDate: '2024-01-18',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'KAKAO_PAY',
      enrollmentDate: '2024-01-13',
      attendanceStatus: 'ATTENDED'
    },
    {
      id: 5,
      studentId: 'STU005',
      studentName: '정성실',
      email: 'jungseong@example.com',
      phone: '010-5678-9012',
      paymentId: 'PAY005',
      paymentAmount: 150000,
      paymentDate: '2024-01-19',
      paymentStatus: 'PENDING',
      paymentMethod: 'TRANSFER',
      bankName: '하나은행',
      accountNumber: '1234-567-890123',
      enrollmentDate: '2024-01-14',
      attendanceStatus: 'NO_SHOW'
    }
  ];

  // 모달이 열릴 때 데이터 로드
  useEffect(() => {
    if (isOpen && classInfo) {
      loadStudentData();
    }
  }, [isOpen, classInfo]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      // 실제 API 호출 시 사용
      // if (onFetchStudents) {
      //   const data = await onFetchStudents(classInfo.calendarId);
      //   setStudents(data);
      // } else {
      //   setStudents(dummyStudents);
      // }
      
      // 더미 데이터 사용 (로딩 시뮬레이션)
      setTimeout(() => {
        setStudents(dummyStudents);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('수강생 데이터 로드 실패:', error);
      setStudents([]);
      setLoading(false);
    }
  };

  // 필터링된 수강생 목록
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 헬퍼 함수들
  const formatAmount = (amount) => {
    return amount?.toLocaleString('ko-KR') || '0';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'COMPLETED': return '결제완료';
      case 'PENDING': return '결제대기';
      case 'FAILED': return '결제실패';
      case 'REFUNDED': return '환불완료';
      case 'CANCELLED': return '결제취소';
      default: return status;
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'payment-completed';
      case 'PENDING': return 'payment-pending';
      case 'FAILED': return 'payment-failed';
      case 'REFUNDED': return 'payment-refunded';
      case 'CANCELLED': return 'payment-cancelled';
      default: return '';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'CARD': return '카드결제';
      case 'TRANSFER': return '계좌이체';
      case 'KAKAO_PAY': return '카카오페이';
      case 'NAVER_PAY': return '네이버페이';
      case 'PAYCO': return 'PAYCO';
      default: return method;
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case 'ATTENDED': return '출석';
      case 'NO_SHOW': return '결석';
      case 'CANCELLED': return '취소';
      default: return status;
    }
  };

  const getAttendanceStatusClass = (status) => {
    switch (status) {
      case 'ATTENDED': return 'attendance-attended';
      case 'NO_SHOW': return 'attendance-no-show';
      case 'CANCELLED': return 'attendance-cancelled';
      default: return '';
    }
  };

  // 통계 계산
  const stats = {
    totalStudents: filteredStudents.length,
    totalAmount: filteredStudents.reduce((sum, student) => sum + (student.paymentAmount || 0), 0),
    completedPayments: filteredStudents.filter(s => s.paymentStatus === 'COMPLETED').length,
    pendingPayments: filteredStudents.filter(s => s.paymentStatus === 'PENDING').length,
    refundedPayments: filteredStudents.filter(s => s.paymentStatus === 'REFUNDED').length,
    attendedCount: filteredStudents.filter(s => s.attendanceStatus === 'ATTENDED').length
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>수강생 결제 내역</h2>
            {classInfo && (
              <div className="class-info">
                <p><strong>클래스명:</strong> {classInfo.className}</p>
                <p><strong>강사명:</strong> {classInfo.hostName}</p>
                <p><strong>정산 ID:</strong> {classInfo.settlementId}</p>
              </div>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 통계 요약 */}
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">총 수강생</span>
            <span className="stat-value">{stats.totalStudents}명</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">총 결제금액</span>
            <span className="stat-value">{formatAmount(stats.totalAmount)}원</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">결제완료</span>
            <span className="stat-value completed">{stats.completedPayments}명</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">결제대기</span>
            <span className="stat-value pending">{stats.pendingPayments}명</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">환불완료</span>
            <span className="stat-value refunded">{stats.refundedPayments}명</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">실제출석</span>
            <span className="stat-value attended">{stats.attendedCount}명</span>
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="modal-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="수강생명, ID, 이메일 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="status-filter">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
            >
              <option value="all">전체 상태</option>
              <option value="COMPLETED">결제완료</option>
              <option value="PENDING">결제대기</option>
              <option value="FAILED">결제실패</option>
              <option value="REFUNDED">환불완료</option>
              <option value="CANCELLED">결제취소</option>
            </select>
          </div>
        </div>

        {/* 수강생 목록 테이블 */}
        <div className="modal-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              데이터를 불러오는 중...
            </div>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>수강생 ID</th>
                  <th>수강생명</th>
                  <th>연락처</th>
                  <th>결제 ID</th>
                  <th>결제금액</th>
                  <th>결제일</th>
                  <th>결제상태</th>
                  <th>결제수단</th>
                  <th>출석상태</th>
                  <th>수강신청일</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td className="student-id">{student.studentId}</td>
                      <td className="student-name">{student.studentName}</td>
                      <td className="student-phone">{student.phone}</td>
                      <td className="payment-id">{student.paymentId}</td>
                      <td className="payment-amount">{formatAmount(student.paymentAmount)}원</td>
                      <td className="payment-date">{formatDate(student.paymentDate)}</td>
                      <td className="payment-status">
                        <span className={`status-badge ${getPaymentStatusClass(student.paymentStatus)}`}>
                          {getPaymentStatusText(student.paymentStatus)}
                        </span>
                      </td>
                      <td className="payment-method">
                        <div className="payment-method-info">
                          <div>{getPaymentMethodText(student.paymentMethod)}</div>
                          {student.cardCompany && (
                            <div className="payment-detail">
                              {student.cardCompany}
                            </div>
                          )}
                          {student.bankName && (
                            <div className="payment-detail">
                              {student.bankName}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="attendance-status">
                        <span className={`status-badge ${getAttendanceStatusClass(student.attendanceStatus)}`}>
                          {getAttendanceStatusText(student.attendanceStatus)}
                        </span>
                      </td>
                      <td className="enrollment-date">{formatDate(student.enrollmentDate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="no-data">
                      {searchTerm || statusFilter !== 'all' ? 
                        '검색 조건에 맞는 수강생이 없습니다.' : 
                        '등록된 수강생이 없습니다.'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementModal;