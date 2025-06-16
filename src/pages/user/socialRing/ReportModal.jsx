import React, { useEffect, useRef, useState } from 'react';
import './ReportModal.css';

export default function ReportModal({ show, onClose, onSubmit }) {
  const [detail, setDetail] = useState('');
  const selectRef = useRef();
  const overlayRef = useRef();

  // ESC 키로 닫기
  useEffect(() => {
    const handleKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!show) return null;

  const handleOverlayClick = e => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = () => {
    const reason = selectRef.current.value;
    onSubmit({ reason, detail });
  };

  return (
    <div className="KYM-report-wrapper">
      <div
        className="KYM-report-overlay"
        ref={overlayRef}
        onClick={handleOverlayClick}
      >
        <div className="KYM-report-modal">
          <h2 className="KYM-report-title">콘텐츠 신고</h2>

          <label className="KYM-report-label">
            신고 사유
            <select
              className="KYM-report-select"
              ref={selectRef}
              defaultValue="spam"
            >
              <option value="spam">스팸/사기</option>
              <option value="harassment">욕설/괴롭힘</option>
              <option value="nudity">노출/선정적</option>
              <option value="hate">혐오 발언</option>
              <option value="other">기타</option>
            </select>
          </label>

          <label className="KYM-report-label">
            신고 내용
            <textarea
              className="KYM-report-textarea"
              placeholder="내용을 입력해 주세요"
              value={detail}
              onChange={e => setDetail(e.target.value)}
              maxLength={2000}
            />
            <div className="KYM-report-count">{detail.length}/2000</div>
          </label>

          <div className="KYM-report-footer">
            <button
              className="KYM-report-btn KYM-report-submit"
              onClick={handleSubmit}
            >
              신고하기
            </button>
            <button
              className="KYM-report-btn KYM-report-cancel"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
