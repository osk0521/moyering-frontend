import React, { useState, useRef } from 'react';
import './FeedHostCreate.css'; // css 경로는 유지, 필요하면 HostFeedCreate.css로 바꾸세요
import plusIcon from './icons/plus.svg';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../atoms';
import { useNavigate } from 'react-router-dom';
import { myAxios, url } from '../../../config';

export default function HostFeedCreate(props) {
    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const navigate = useNavigate();

    // 상태 관리
    const [text, setText] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState('');
    const fileInputRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedId, setFeedId] = useState('');

    // 취소
    const handleCancel = () => props.onCancel();

    // 이미지 선택
    const openFileDialog = () => fileInputRef.current.click();
    const readUrl = e => {
        console.log("🟢 myAxios token=", token);
        const files = Array.from(e.target.files || []).slice(0, 5);
        setImageFiles(files);
        setPreviewUrls(files.map(f => URL.createObjectURL(f)));
        setCurrentIndex(0);
    };
    const prevImage = () => setCurrentIndex(i => (i === 0 ? previewUrls.length - 1 : i - 1));
    const nextImage = () => setCurrentIndex(i => (i === previewUrls.length - 1 ? 0 : i + 1));
    const removeCurrent = () => {
        const idx = currentIndex;
        const newFiles = imageFiles.filter((_, i) => i !== idx);
        const newUrls = previewUrls.filter((_, i) => i !== idx);
        setImageFiles(newFiles);
        setPreviewUrls(newUrls);
        if (idx === newUrls.length && idx > 0) {
            setCurrentIndex(idx - 1);
        }
    };

    const handleTextChange = e => {
        if (e.target.value.length <= 500) {
            setText(e.target.value);
        }
    };

    // 태그
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
        if (!category) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        try {
            const feedDto = {
                content: text,
                category,
                tag1: tags[0] || '',
                tag2: tags[1] || '',
                tag3: tags[2] || '',
                tag4: tags[3] || '',
                tag5: tags[4] || ''
            };
            const formData = new FormData();
            formData.append('feed', new Blob([JSON.stringify(feedDto)], { type: 'application/json' }));
            imageFiles.forEach(file => formData.append('images', file));
            console.log("🟢 myAxios token=", token);
            const res = await myAxios(token, setToken).post(`/host/createFeedHost`, formData);
            setFeedId(res.data);
            console.log(res)
            navigate(`/hostFeed/${res.data}`);
        } catch (err) {
            console.error('강사 피드 등록 실패:', err);
            alert('강사 피드 작성에 실패했습니다.');
        }
    };

    return (
        <div className="KYM-HostFeedCreate-container">
            <div className="KYM-HostFeedCreate-header">
                <button className="KYM-HostFeedCreate-btn-cancel" onClick={handleCancel}>취소</button>
                <div className="KYM-HostFeedCreate-title">
                    새 강사 홍보 피드
                </div>
                <button className="KYM-HostFeedCreate-btn-submit" onClick={handleSubmit}>작성</button>
            </div>

            <div className="KYM-HostFeedCreate-main">
                <div className="KYM-HostFeedCreate-carousel" onClick={openFileDialog}>
                    {previewUrls.length > 0 ? (
                        <>
                            <button className="carousel-btn left" onClick={e => { e.stopPropagation(); prevImage(); }}>‹</button>
                            <img className="carousel-img" src={previewUrls[currentIndex]} alt={`preview-${currentIndex}`} />
                            <button className="carousel-btn right" onClick={e => { e.stopPropagation(); nextImage(); }}>›</button>
                            <button className="carousel-remove" onClick={e => { e.stopPropagation(); removeCurrent(); }}>×</button>
                        </>
                    ) : (
                        <span className="KYM-HostFeedCreate-placeholder">사진 선택 (최대 5장)</span>
                    )}
                    <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={readUrl} style={{ display: 'none' }} />
                </div>

                <form className="KYM-HostFeedCreate-form" onSubmit={handleSubmit}>
                    {/* 작성자 정보 */}
                    {/* <div className="KYM-HostFeedCreate-author-info">
                        <img src={user.profile} alt={user.nickName} className="KYM-HostFeedCreate-author-profile" />
                        <div className="KYM-HostFeedCreate-author-meta">
                            <span className="KYM-HostFeedCreate-author-nickname">{user.nickName}</span>
                            <img src={`/badges/${user.userBadgeId}.png`} alt="배지" className="KYM-HostFeedCreate-author-badge" />
                        </div>
                    </div> */}

                    {/* 카테고리 */}
                    <div className="KYM-HostFeedCreate-category">
                        <label>카테고리 선택</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="">카테고리 선택</option>
                            <option value="스포츠">스포츠</option>
                            <option value="음식">음식</option>
                            <option value="공예 / DIY">공예 / DIY</option>
                            <option value="뷰티">뷰티</option>
                            <option value="문화예술">문화예술</option>
                            <option value="심리 / 상담">심리 / 상담</option>
                            <option value="자유모임">자유모임</option>
                        </select>
                    </div>

                    {/* 글 내용 */}
                    <textarea
                        className="KYM-HostFeedCreate-text"
                        placeholder="글을 작성해 주세요"
                        value={text}
                        onChange={handleTextChange}
                    />
                    <div className="KYM-HostFeedCreate-text-count">{text.length}/500</div>

                    {/* 태그 */}
                    <div className="KYM-HostFeedCreate-tags">
                        <label>태그추가</label>
                        <div className="KYM-HostFeedCreate-tag-input-wrap">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                placeholder="태그 입력 후 Enter"
                            />
                        </div>
                        <div className="KYM-HostFeedCreate-tag-list">
                            {tags.map(t => (
                                <span key={t} className="KYM-HostFeedCreate-tag-item">
                                    {t}
                                    <button type="button" onClick={() => handleRemoveTag(t)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
