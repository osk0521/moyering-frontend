import React, { useState } from 'react';
import './UserJoinCategory.css';
import { useNavigate } from 'react-router';

const categories = [
  '실내 & 수상 스포츠', '실외 스포츠', '베이킹', '음료', '요리', '가죽공예',
  '도자기공예', '플라워공예', '비누/향수/캔들', '약사서리', '네일/패디', '마사지/스파',
  '헤어/메이크업', '미술', '연기', '노래/악기/작곡', '사진/영상', '사주/타로',
  '심리검사', '명상', '여행', '게임', '파티'
];

const UserJoinCategory = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [intro, setIntro] = useState('');
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  }

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="category-wrapper">
      <h2 className="category-title">회원가입</h2>
      <p className="category-sub">관심있는 카테고리를 골라보세요!<br />최대 5개까지 고를 수 있습니다!</p>

      <div className="category-box">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`category-item ${selectedCategories.includes(cat) ? 'selected' : ''}`}
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className="intro-section">
        <label className="intro-label">한줄 소개</label>
        <textarea
          className="intro-textarea"
          placeholder="자신을 간단히 소개해주세요."
          rows="3"
          maxLength={500}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />
        <div className="intro-count">{intro.length}/500</div>
        <p className="intro-desc">한줄 소개는 게더링 참여시 모임장에게 보여집니다.</p>
      </div>

      <button className="submit-btn" onClick={()=>handleNavigation('/joinSuccess')}>회원가입</button>
    </div>
  );
};

export default UserJoinCategory;