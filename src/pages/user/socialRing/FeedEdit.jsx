// src/components/FeedEdit.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FeedEdit.css';
import plusIcon from './icons/plus.svg';
import { myAxios, url } from '../../../config';
import { tokenAtom, userAtom } from '../../../atoms';
import { useAtom, useAtomValue } from 'jotai';

export default function FeedEdit() {
  const { feedId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [token, setToken] = useAtom(tokenAtom)
  const user = useAtomValue(userAtom);
  
  const [imageFiles, setImageFiles] = useState(null);
  const [previewUrls, setPreviewUrls] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

console.log("userAtom에서 가져온 user:", user);
  // 초기 데이터 로드
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data } = await myAxios(token, setToken).get(`/socialing/feed?feedId=${feedId}`);
        console.log("로드된 피드:", data);
        console.log("로그인된 유저 ID:", user?.userId);
        console.log("피드 작성자 ID:", data.writerUserId);
        // 만약 현재 로그인한 userId 와 작성자가 다르면 접근 차단
        if (data.writerUserId !== Number(user.id)) {
          alert("본인이 작성한 게시글만 수정할 수 있습니다.");
          navigate('/'); // 혹은 /myPage 로 보내도 됨
          return;
        }

        setPreviewUrls([data.img1, data.img2, data.img3, data.img4, data.img5].filter(Boolean));
        setText(data.content);
        setTags([data.tag1, data.tag2, data.tag3, data.tag4, data.tag5].filter(Boolean));
      } catch (e) {
        console.error(e);
        setError('피드 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [feedId, token]);

  // if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
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
    
    if (imageFiles.length) {
      imageFiles.forEach(file => form.append('images', file));
    }
    form.append('feedId',feedId);
    form.append('userId',user.id);

    // try {
    //   await myAxios(token, setToken).patch(
    //     `/user/socialing/feed/${feedId}`,
    //     form
    //     // { headers: { 'Content-Type': 'multipart/form-data' } }
    //   );
    //   navigate(`/feed/${feedId}`);
    // } catch (e) {
    //   console.error(e);
    //   setError('수정에 실패했습니다.');
    // }
    try {
      await myAxios(token, setToken).post(
        "socialing/feed",
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
        <div className="KYM-FeedEdit-image-box" onClick={() => fileInputRef.current?.click()}>
          {previewUrls.length > 0 ? (
            previewUrls.map((img, idx) => (
              <img key={idx} src={img.startsWith('blob:') ? img : `${url}/iupload/${img}`} 
              alt={`미리보기${idx}`} style={{ width: '100px', marginRight: '8px' }} />
            ))
          ) : (
            <span className="KYM-FeedEdit-placeholder">사진 선택</span>
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
