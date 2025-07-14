import React, { useState, useRef } from 'react';
import './FeedCreate.css';
import plusIcon from './icons/plus.svg';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { useNavigate } from 'react-router-dom';
import { myAxios, url } from '../../../config';

export default function FeedCreate() {
    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const navigate = useNavigate();

    // 상태 관리
    const [text, setText] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const fileInputRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);  // 슬라이드 인덱스

    // 취소
    const handleCancel = () => navigate(0);

    // 이미지 선택
    const openFileDialog = () => fileInputRef.current.click();
    const readUrl = e => {
        const files = Array.from(e.target.files || [])
            .slice(0, 5);                                        // 최대 5개
        setImageFiles(files);
        // 브라우저 미리보기 URL 생성
        const urls = files.map(f => URL.createObjectURL(f));
        setPreviewUrls(urls);
        setCurrentIndex(0);  // 새로 선택할 때는 첫번째로
    };
    // ◀ 이전, 다음, 삭제 함수
    const prevImage = () => {
        setCurrentIndex(i => (i === 0 ? previewUrls.length - 1 : i - 1));
    };
    const nextImage = () => {
        setCurrentIndex(i => (i === previewUrls.length - 1 ? 0 : i + 1));
    };
    const removeCurrent = () => {
        const idx = currentIndex;
        const newFiles = imageFiles.filter((_, i) => i !== idx);
        const newUrls = previewUrls.filter((_, i) => i !== idx);
        setImageFiles(newFiles);
        setPreviewUrls(newUrls);
        // 인덱스 조정
        if (idx === newUrls.length && idx > 0) {
            setCurrentIndex(idx - 1);
        }
    };

    // 글 내용 변경
    const handleTextChange = e => {
        if (e.target.value.length <= 2000) {
            setText(e.target.value);
        }
    };

    // 태그 추가/제거
    const handleAddTag = () => {
        const tag = tagInput.trim();
        if (!tag || tags.includes(tag) || tags.length >= 5) return;
        setTags(prev => [...prev, tag]);
        setTagInput('');
    };
    const handleRemoveTag = tag => {
        setTags(prev => prev.filter(t => t !== tag));
    };

    // 제출
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const feedDto = {
                content: text,
                tag1: tags[0] || '',
                tag2: tags[1] || '',
                tag3: tags[2] || '',
                tag4: tags[3] || '',
                tag5: tags[4] || ''
            };
            const formData = new FormData();
            //   Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
            formData.append(
                'feed',
                new Blob([JSON.stringify(feedDto)], { type: 'application/json' })
            );
            // 배열 순회하며 모두 append
            imageFiles.forEach(file => {
                formData.append('images', file);
            });
            const res = await myAxios(token, setToken).post(
                `${url}/user/socialing/feed`,
                formData
            );
            const created = res.data;
            navigate(`/feed/${created.feedId}`);
        } catch (err) {
            console.error('피드 등록 실패:', err);
            alert('피드 작성에 실패했습니다.');
        }
    };

    return (
        <div className="KYM-FeedCreate-container">
            <div className="KYM-FeedCreate-header">
                <button
                    className="KYM-FeedCreate-btn-cancel"
                    onClick={handleCancel}
                >
                    취소
                </button>
                <div className="KYM-FeedCreate-title">
                    {/* <img
                        src={plusIcon}
                        className="KYM-FeedCreate-icon-plus"
                        alt="플러스 아이콘"
                    /> */}
                    새 피드 작성
                </div>
                <button
                    className="KYM-FeedCreate-btn-submit"
                    onClick={handleSubmit}
                >
                    피드 작성
                </button>
            </div>

            <div className="KYM-FeedCreate-main">
                {/* 이미지 업로드 & 슬라이드 */}
                <div className="KYM-FeedCreate-carousel" onClick={() => fileInputRef.current.click()}>
                    {previewUrls.length > 0 ? (
                        <>
                            <button className="carousel-btn left" onClick={e => { e.stopPropagation(); prevImage(); }}>
                                ‹
                            </button>
                            <img
                                className="carousel-img"
                                src={previewUrls[currentIndex]}
                                alt={`preview-${currentIndex}`}
                            />
                            <button className="carousel-btn right" onClick={e => { e.stopPropagation(); nextImage(); }}>
                                ›
                            </button>
                            <button className="carousel-remove" onClick={e => { e.stopPropagation(); removeCurrent(); }}>
                                ×
                            </button>
                        </>
                    ) : (
                        <span className="KYM-FeedCreate-placeholder">사진 선택 (최대 5장)</span>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={readUrl}
                        style={{ display: 'none' }}
                    />
                </div>


                {/* 폼 */}
                <form
                    className="KYM-FeedCreate-form"
                    onSubmit={handleSubmit}
                >
                    {/* 작성자 정보
                    <div className="KYM-FeedCreate-author-info">
                        <img
                            src={`${url}/iupload/${user.profile}`}
                            alt={user.nickName}
                            className="KYM-FeedCreate-author-profile"
                        />
                        <div className="KYM-FeedCreate-author-meta">
                            <span className="KYM-FeedCreate-author-nickname">
                                {user.nickName}
                            </span>
                            <img
                                src={`${url}/iupload/${user.user}`}
                                alt="배지"
                                className="KYM-FeedCreate-author-badge"
                            />
                        </div>
                    </div> */}

                    {/* 글 내용 */}
                    <textarea
                        className="KYM-FeedCreate-text"
                        placeholder="글을 작성해 주세요"
                        value={text}
                        onChange={handleTextChange}
                    />
                    <div className="KYM-FeedCreate-text-count">
                        {text.length}/2000
                    </div>

                    {/* 태그 */}
                    <div className="KYM-FeedCreate-tags">
                        <label>태그추가</label>
                        <div className="KYM-FeedCreate-tag-input-wrap">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // 엔터로 form submit 막기
                                        handleAddTag();
                                    }
                                }}
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
                                        type="button"
                                        onClick={() => handleRemoveTag(t)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
