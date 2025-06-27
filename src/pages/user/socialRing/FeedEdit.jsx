// src/components/FeedEdit.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FeedEdit.css';
import plusIcon from './icons/plus.svg';
import { myAxios, url } from '../../../config';
import { tokenAtom } from '../../../atoms';
import { useAtomValue } from 'jotai';

export default function FeedEdit() {
  const { feedId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const token = useAtomValue(tokenAtom);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 초기 데이터 로드
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        console.log(token)
        const { data } = await myAxios(token).get(`/socialing/feed?feedId=${feedId}`);
        setPreviewUrl(data.img1 || '');
        setText(data.content);
        setTags([data.tag1, data.tag2, data.tag3, data.tag4, data.tag5].filter(Boolean));
      } catch (e) {
        console.error(e);
        setError('피드 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [feedId,token]);

  // if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleTextChange = e => {
    if (e.target.value.length <= 2000) setText(e.target.value);
  };

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t) || tags.length >= 5) return;
    setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const handleRemoveTag = t => setTags(prev => prev.filter(x => x !== t));

  const handleSubmit = async () => {
    console.log('▶ handleSubmit 호출됨');
    const form = new FormData();
    form.append('feed', new Blob([
      JSON.stringify({ content: text, tags })
    ], { type: 'application/json' }));
    if (imageFile) form.append('images', imageFile);

    try {
      await myAxios(token).patch(
        `/user/socialing/feed/${feedId}`,
        form
        // { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      navigate(`/feed/${feedId}`);
    } catch (e) {
      console.error(e);
      setError('수정에 실패했습니다.');
    }
  };

  return (
    <div className="KYM-FeedEdit-container">
      <header className="KYM-FeedEdit-header">
        <button className="KYM-FeedEdit-btn-cancel" onClick={() => navigate(-1)}>
          수정 취소
        </button>
        <div className="KYM-FeedEdit-title">
          <img src={plusIcon} className="KYM-FeedEdit-icon-plus" alt="편집 아이콘" />
          피드 수정
        </div>
        <button className="KYM-FeedEdit-btn-submit" onClick={handleSubmit}>
          수정 완료
        </button>
      </header>

      <div className="KYM-FeedEdit-main">
        <div className="KYM-FeedEdit-image-box" onClick={() => fileInputRef.current.click()}>
          {previewUrl
            ? <img src={previewUrl} alt="미리보기" />
            : <span className="KYM-FeedEdit-placeholder">사진 선택</span>
          }
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        <div className="KYM-FeedEdit-form">
          <textarea
            className="KYM-FeedEdit-text"
            placeholder="글을 수정해 주세요"
            value={text}
            onChange={handleTextChange}
          />
          <div className="KYM-FeedEdit-text-count">{text.length}/2000</div>

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
                  <button type="button" onClick={() => handleRemoveTag(t)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
