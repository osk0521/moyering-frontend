import { useEffect, useState } from 'react';
import './TabPortfolio.css';
import React from 'react'; // 이 한 줄만 추가!

const TabPortfolio = ({ registerValidator,classData,setClassData }) => {
  const {classPortfolio} = classData;

  const handleFileChange = (e) => {
    setClassData(prev=>({
      ...prev,
      classPortfolio:{
        ...prev.classPortfolio,
        portfolio:e.target.files[0]
      }
    }))
  };

  useEffect(() => {
    const { portfolio} = classData.classPortfolio;
    const isValid = portfolio !== null;
    registerValidator(5, () => isValid);
  }, [classData.extraInfo, registerValidator]);

  return (
    <div className="KHJ-class-info-box">
      <h3 className="KHJ-section-title">포트폴리오 검수</h3>

      <div className="KHJ-form-section">
        <label className="KHJ-portfolio-label">
          <span className="KHJ-required-text-dot">*</span>포트폴리오 업로드
        </label>
        <div className="KHJ-file-upload-container">
          {classPortfolio.portfolio ? (
            <span>{classPortfolio.portfolio.name}</span>
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
