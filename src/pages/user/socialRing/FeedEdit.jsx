// src/components/FeedEdit.jsx
import React, { useState, useRef, useEffect } from 'react';
import './FeedEdit.css';
import plusIcon from './icons/plus.svg';

export default function FeedEdit({ 
  initialImageUrl, 
  initialText, 
  initialTags, 
  onCancel, 
  onSubmit 
}) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl || '');
  const [text, setText] = useState(initialText || '');
  const [tags, setTags] = useState(initialTags || []);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef();

  // 이미지 선택 핸들러 (새 파일이 들어오면 file 객체도 저장)
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 본문 텍스트 변경
  const handleTextChange = e => {
    if (e.target.value.length <= 2000) {
      setText(e.target.value);
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t) || tags.length >= 5) return;
    setTags(prev => [...prev, t]);
    setTagInput('');
  };

  // 태그 삭제
  const handleRemoveTag = t => {
    setTags(prev => prev.filter(x => x !== t));
  };

  // 제출
  const handleSubmit = () => {
    // imageFile이 null이면 기존 initialImageUrl 사용
    onSubmit({ imageFile, text, tags });
  };

  return (
    <div className="KYM-FeedEdit-container">
      <header className="KYM-FeedEdit-header">
        <button
          className="KYM-FeedEdit-btn-cancel"
          onClick={onCancel}
        >
          수정 취소
        </button>
        <div className="KYM-FeedEdit-title">
          <img
            src={plusIcon}
            className="KYM-FeedEdit-icon-plus"
            alt="편집 아이콘"
          />
          피드 수정
        </div>
        <button
          className="KYM-FeedEdit-btn-submit"
          onClick={handleSubmit}
        >
          수정 완료
        </button>
      </header>

      <div className="KYM-FeedEdit-main">
        {/* 이미지 박스 */}
        <div
          className="KYM-FeedEdit-image-box"
          onClick={() => fileInputRef.current.click()}
        >
          {previewUrl
            ? <img src={previewUrl} alt="미리보기" />
            : <span className="KYM-FeedEdit-placeholder">
                사진 선택
              </span>}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        {/* 수정 폼 */}
        <div className="KYM-FeedEdit-form">
          <textarea
            className="KYM-FeedEdit-text"
            placeholder="글을 수정해 주세요"
            value={text}
            onChange={handleTextChange}
          />
          <div className="KYM-FeedEdit-text-count">
            {text.length}/2000
          </div>

          <div className="KYM-FeedEdit-tags">
            <label>태그 (최대 5개)</label>
            <input
              className="KYM-FeedEdit-tag-input"
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTag()}
              placeholder="Enter로 추가"
            />
            <div className="KYM-FeedEdit-tag-list">
              {tags.map(t => (
                <span key={t} className="KYM-FeedEdit-tag-item">
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
