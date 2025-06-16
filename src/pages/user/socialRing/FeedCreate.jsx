// src/components/FeedCreate.jsx

import React, { useState, useRef } from 'react';
import './FeedCreate.css';
import plusIcon from './icons/plus.svg';    // 변경: SVG 파일을 경로로 import

export default function FeedCreate({ onCancel, onSubmit }) {
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const fileInputRef = useRef();

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleTextChange = e => {
        if (e.target.value.length <= 2000) {
            setText(e.target.value);
        }
    };

    const handleAddTag = () => {
        const tag = tagInput.trim();
        if (!tag || tags.includes(tag) || tags.length >= 5) return;
        setTags(prev => [...prev, tag]);
        setTagInput('');
    };

    const handleRemoveTag = removed => {
        setTags(prev => prev.filter(t => t !== removed));
    };

    const handleSubmit = () => {
        onSubmit({ imageFile, text, tags });
    };

    return (
        <div className="KYM-FeedCreate-container">
            <header className="KYM-FeedCreate-header">
                <button className="KYM-FeedCreate-btn-cancel" onClick={onCancel}>
                    취소
                </button>
                <div className="KYM-FeedCreate-title">
                    {/* 변경: PlusIcon 컴포넌트 대신 img 태그 사용 */}
                    <img
                        src={plusIcon}
                        className="KYM-FeedCreate-icon-plus"
                        alt="플러스 아이콘"
                    />
                    새 피드 작성
                </div>
                <button
                    className="KYM-FeedCreate-btn-submit"
                    onClick={handleSubmit}
                >
                    피드 작성
                </button>
            </header>

            <div className="KYM-FeedCreate-main">
                {/* 왼쪽: 이미지 업로드 */}
                <div
                    className="KYM-FeedCreate-image-box"
                    onClick={() => fileInputRef.current.click()}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="preview" />
                    ) : (
                        <span className="KYM-FeedCreate-placeholder">
                            사진 선택
                        </span>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* 오른쪽: 텍스트 + 태그 */}
                <div className="KYM-FeedCreate-form">
                    <textarea
                        className="KYM-FeedCreate-text"
                        placeholder="글을 작성해 주세요"
                        value={text}
                        onChange={handleTextChange}
                    />
                    <div className="KYM-FeedCreate-text-count">
                        {text.length}/2000
                    </div>

                    <div className="KYM-FeedCreate-tags">
                        <label>태그추가</label>
                        <div className="KYM-FeedCreate-tag-input-wrap">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e =>
                                    e.key === 'Enter' && handleAddTag()
                                }
                                placeholder="태그 입력 후 Enter"
                            />
                        </div>
                        <div className="KYM-FeedCreate-tag-list">
                            {tags.map(t => (
                                <span
                                    key={t}
                                    className="KYM-FeedCreate-tag-item"
                                >
                                    {t}
                                    <button
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
