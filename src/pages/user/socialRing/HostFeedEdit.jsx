import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { myAxios, url } from '../../../config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../../atoms';
import './HostFeedEdit.css';

export default function HostFeedEditPage() {
    const { feedId } = useParams();
    const token = useAtomValue(tokenAtom);
    const navigate = useNavigate();
    const fileInputRef = useRef();

    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [removeUrls, setRemoveUrls] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await myAxios(token).get(`/feedHost/${feedId}`);
                const data = res.data;
                setContent(data.content);
                setTags([data.tag1, data.tag2, data.tag3, data.tag4, data.tag5].filter(Boolean));
                setCategory(data.category);
                setPreviewImages([data.img1, data.img2, data.img3, data.img4, data.img5].filter(Boolean));
            } catch (err) {
                console.error(err);
                alert("데이터 불러오기 실패");
            }
        }
        fetchData();
    }, [feedId, token]);

    const handleImageChange = e => {
        const newFiles = Array.from(e.target.files);
    const totalFiles = [...images, ...newFiles].slice(0, 5);  // 최대 5장 유지
    setImages(totalFiles);

    // 기존 previewImages + 새 previewUrls 유지
    const newPreviews = [...previewImages, ...newFiles.map(file => URL.createObjectURL(file))].slice(0, 5);
    setPreviewImages(newPreviews);
    setCurrentIndex(0);
    };

    const handleAddTag = () => {
        const t = tagInput.trim();
        if (!t || tags.includes(t) || tags.length >= 5) return;
        setTags(prev => [...prev, t]);
        setTagInput('');
    };

    const handleRemoveTag = t => {
        setTags(prev => prev.filter(x => x !== t));
    };

    const prevImage = () => {
        setCurrentIndex(i => (i === 0 ? previewImages.length - 1 : i - 1));
    };

    const nextImage = () => {
        setCurrentIndex(i => (i === previewImages.length - 1 ? 0 : i + 1));
    };

    const removeCurrent = () => {
        const idx = currentIndex;
        const removedUrl = previewImages[idx];
        if (removedUrl && !removedUrl.startsWith("blob:")) {
            setRemoveUrls(prev => [...prev, removedUrl.replace(`${url}/iupload/`, '')]);
        }

        const newFiles = images.filter((_, i) => i !== idx);
        const newUrls = previewImages.filter((_, i) => i !== idx);
        setImages(newFiles);
        setPreviewImages(newUrls);
        if (idx === newUrls.length && idx > 0) {
            setCurrentIndex(idx - 1);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("dto", new Blob([JSON.stringify({
            content, category,
            tag1: tags[0] || "", tag2: tags[1] || "", tag3: tags[2] || "", tag4: tags[3] || "", tag5: tags[4] || ""
        })], { type: "application/json" }));

        images.forEach(file => formData.append("images", file));
        removeUrls.forEach(url => formData.append("removeUrls", url));

        try {
            await myAxios(token).patch(`/host/feedEdit/${feedId}`, formData);
            alert("수정 완료!");
            navigate(`/hostFeed/${feedId}`);
        } catch (err) {
            console.error(err);
            alert("수정 실패");
        }
    }

    return (
        <div className="KYM-HostFeedEdit-container">
            <header className="KYM-HostFeedEdit-header">
                <button className="KYM-HostFeedEdit-btn-cancel" onClick={() => navigate(-1)}>취소</button>
                <div className="KYM-HostFeedEdit-title">
                    <img src="/plus.svg" className="KYM-HostFeedEdit-icon-plus" alt="편집 아이콘" />
                    강사 피드 수정
                </div>
                <button className="KYM-HostFeedEdit-btn-submit" onClick={handleSubmit}>수정 완료</button>
            </header>

            <div className="KYM-HostFeedEdit-main">
                <div className="KYM-HostFeedEdit-image-box" onClick={() => fileInputRef.current?.click()}>
                    {previewImages.length > 0 ? (
                        <>
                            <button className="carousel-btn left" onClick={e => { e.stopPropagation(); prevImage(); }}>‹</button>
                            <img
                                src={previewImages[currentIndex].startsWith('blob:')
                                    ? previewImages[currentIndex]
                                    : `${url}/iupload/${previewImages[currentIndex]}`}
                                alt={`preview-${currentIndex}`}
                            />
                            <button className="carousel-btn right" onClick={e => { e.stopPropagation(); nextImage(); }}>›</button>
                            <button className="carousel-remove" onClick={e => { e.stopPropagation(); removeCurrent(); }}>×</button>
                        </>
                    ) : (
                        <div className="KYM-HostFeedEdit-placeholder">사진 선택 (최대 5장)</div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>

                <div className="KYM-HostFeedEdit-form">
                    <textarea
                        className="KYM-HostFeedEdit-text"
                        placeholder="글을 수정해 주세요"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <div className="KYM-HostFeedEdit-text-count">{content.length}/2000</div>

                    <div className="KYM-HostFeedEdit-tags">
                        <label>태그 (최대 5개)</label>
                        <input
                            className="KYM-HostFeedEdit-tag-input"
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                        />
                        <div className="KYM-HostFeedEdit-tag-list">
                            {tags.map(t => (
                                <span key={t} className="KYM-HostFeedEdit-tag-item">
                                    #{t}
                                    <button type="button" onClick={() => handleRemoveTag(t)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="KYM-HostFeedEdit-tag-input"
                    >
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
            </div>
        </div>
    );
}
