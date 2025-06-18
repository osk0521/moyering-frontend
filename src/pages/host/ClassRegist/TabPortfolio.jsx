import { useEffect, useState } from 'react';
import './TabPortfolio.css';

const TabPortfolio = ({ registerValidator,classData,setClassData }) => {
  const {classPortfolio} = classData;

  const handleFileChange = (e) => {
    setClassData(prev=>({
      ...prev,
      classPortfolio:{
        ...prev.classPortfolio,
        portfolio:e.target.value
      }
    }))
  };

  // 유효성 검사 함수 (필수 항목: 파일)
  const validate = () => {
    if (classPortfolio.portfolio) return false;
    return true;
  };

  // 부모 컴포넌트에 유효성 검사 함수 등록
  useEffect(() => {
    registerValidator(5, validate);
  }, [classData.classPortfolio]);

  return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">포트폴리오 검수</h3>

      <div className="KHJ-form-section">
        <label className="KHJ-portfolio-label">
          <span className="KHJ-required-text-dot">*</span>포트폴리오 업로드
        </label>
        <div className="KHJ-file-upload-container">
          {classPortfolio.portfolio ? (
            <span>{classPortfolio.portfolio}</span>
          ) : (
            <span className="KHJ-file-placeholder">포트폴리오 파일을 클릭하여 업로드하세요</span>
          )}
          <input
            type="file"
            className="KHJ-file-input"
            onChange={handleFileChange}
            id="KHJ-file-upload-input"
            hidden
          />
          <label htmlFor="KHJ-file-upload-input" className="KHJ-file-upload-button">
            포트폴리오 업로드
          </label>
        </div>
      </div>

      <p className="KHJ-portfolio-info-text">
        클래스 등록 전 검증을 위한 포트폴리오입니다. 주의해서 업로드해주세요!
      </p>
    </div>
  );
};

export default TabPortfolio;
