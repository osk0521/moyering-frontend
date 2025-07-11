import React, { useEffect, useState } from 'react';
import './UserJoinCategory.css';
import { useLocation, useNavigate } from 'react-router';
import { myAxios, url } from '../../config';
import axios from 'axios';
import { useAtom } from 'jotai';
import { tokenAtom } from './../../atoms';
import LoginHeader from './LoginHeaders';

const UserJoinCategory = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useAtom(tokenAtom);
  const nUser = location.state;
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);


  const [user, setUser] = useState({
    ...nUser,
    category1: selectedCategories[0] || '',
    category2: selectedCategories[1] || '',
    category3: selectedCategories[2] || '',
    category4: selectedCategories[3] || '',
    category5: selectedCategories[4] || '',
  });

  const checkFormValidity = () => {
    if (
      user.category1 && user.intro
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }

  useEffect(() => {
    myAxios()
      .get('/categories')
      .then(res => {
        // '기타' 제외한 카테고리만 설정
        setCategoryList(res.data.filter(item => item.subCategoryName !== '기타'));
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // selectedCategories가 업데이트 될 때마다 user 객체를 동기화
    setUser({
      ...nUser,
      category1: selectedCategories[0] || '',
      category2: selectedCategories[1] || '',
      category3: selectedCategories[2] || '',
      category4: selectedCategories[3] || '',
      category5: selectedCategories[4] || '',
    });
    console.log("선택된 카테고리들:", selectedCategories);
  }, [selectedCategories]); // selectedCategories가 변경될 때마다 실행

  const edit = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    checkFormValidity();
  };

  const toggleCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const submit = (e) => {
    e.preventDefault();
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
    formData.append('userType', user.userType);
    formData.append('latitude',user.latitude);
    formData.append('longitude',user.longitude)

    // category1 ~ category5 도 포함 (selectedCategories에서 ID를 가져옴)
    formData.append('category1', selectedCategories[0] || '');
    formData.append('category2', selectedCategories[1] || '');
    formData.append('category3', selectedCategories[2] || '');
    formData.append('category4', selectedCategories[3] || '');
    formData.append('category5', selectedCategories[4] || '');

    // 프로필 이미지가 있다면
    // formData.append('profileImage', imageFile);

    myAxios()
      .post("/join", formData)
      .then(res => {
        console.log(res);
        navigate('/joinSuccess');
      })
      .catch(err => {
        alert('회원가입 실패');
        console.log(err);
      });
  };

  return (
    <>
      <LoginHeader />
      <div className="category-wrapper">
        <h2 className="category-title">회원가입</h2>
        <p className="category-sub">
          관심있는 카테고리를 골라보세요!
          <br />최대 5개까지 고를 수 있습니다!
        </p>

        <div className="category-box">
          {categoryList.map((cat, index) => (
            <div
              key={index}
              className={`category-item ${selectedCategories.includes(cat.subCategoryName) ? 'selected' : ''}`}
              onClick={() => toggleCategory(cat.subCategoryName)} // ID 값으로 선택
            >
              {cat.subCategoryName}
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
            name="intro"
            value={user.intro}
            onChange={edit}
          />
          <div className="intro-count">{(user.intro ?? '').length}/500</div>
          <p className="intro-desc">한줄 소개는 게더링 참여시 모임장에게 보여집니다.</p>
        </div>
        <div
          className="tooltip-wrapper"
          onMouseEnter={() => !isFormValid && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        ></div>
        <button className="submit-btn" onClick={submit} disabled={!isFormValid}>
          회원가입
        </button>
        {showTooltip && (
          <div className="tooltip-msg">아직 모든 항목을 입력하지 않았습니다!</div>
        )}
      </div>
    </>
  );
};

export default UserJoinCategory;
