import React, { useState } from 'react';
import './UserJoinCategory.css';
import { useLocation, useNavigate } from 'react-router';
import { url } from '../../config';
import axios from 'axios';

const categories = [
  '실내 & 수상 스포츠', '실외 스포츠', '베이킹', '음료', '요리', '가죽공예',
  '도자기공예', '플라워공예', '비누/향수/캔들', '약사서리', '네일/패디', '마사지/스파',
  '헤어/메이크업', '미술', '연기', '노래/악기/작곡', '사진/영상', '사주/타로',
  '심리검사', '명상', '여행', '게임', '파티'
];

const UserJoinCategory = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const nUser = location.state;
  const [user, setUser] = useState({
    ...nUser,
    category1: selectedCategories[0] || '',
    category2: selectedCategories[1] || '',
    category3: selectedCategories[2] || '',
    category4: selectedCategories[3] || '',
    category5: selectedCategories[4] || '',

  })

  const edit = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

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

  const formData = new FormData();

  // user 객체에 있는 값들을 하나씩 넣기
  formData.append('username', user.username);
  formData.append('password', user.password);
  formData.append('name', user.name);
  formData.append('nickName', user.nickName);
  formData.append('tel', user.tel);
  formData.append('email', user.email);
  formData.append('birthday', user.birthday);
  formData.append('addr', user.addr);
  formData.append('detailAddr', user.detailAddr);
  formData.append('intro', user.intro);
  formData.append('userType', user.userType)

  // category1 ~ category5 도 포함
  formData.append('category1', user.category1);
  formData.append('category2', user.category2);
  formData.append('category3', user.category3);
  formData.append('category4', user.category4);
  formData.append('category5', user.category5);

  // 프로필 이미지가 있다면
  // formData.append('profileImage', imageFile);

  const submit = (e) => {
    e.preventDefault();
    axios.post(`${url}/join`, formData)
      .then(res => {
        console.log(res)
          navigate("/joinSuccess")
      })
      .catch(err => {
        alert("회원가입 실패")
        console.log(err);
      })
  }

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
          name='intro'
          value={user.intro}
          onChange={edit}
        />
        <div className="intro-count">{(user.intro ?? '').length}/500</div>
        <p className="intro-desc">한줄 소개는 게더링 참여시 모임장에게 보여집니다.</p>
      </div>

      <button className="submit-btn" onClick={submit}>회원가입</button>
    </div>
  );
};

export default UserJoinCategory;