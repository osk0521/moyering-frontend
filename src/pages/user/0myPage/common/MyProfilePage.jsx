import React, { useEffect, useState } from 'react';
import { myAxios, url } from '../../../../config';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../../../atoms';
import { useNavigate } from 'react-router-dom';
import './MyProfilePage.css';
import DaumPostcode from 'react-daum-postcode';
import Header from '../../../common/Header';
import Sidebar from './Sidebar';

export default function MyProfilePage() {

    const [token, setToken] = useAtom(tokenAtom)
    const navigate = useNavigate();
    const [username,setUsername] = useState('');
    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [addr, setAddr] = useState('');
    const [detailAddr, setDetailAddr] = useState('');
    const [birthday, setBirthday] = useState('');
    const [intro, setIntro] = useState('');
    const [activeScore, setActiveScore] = useState(0);
    const [userBadgeId, setUserBadgeId] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileUrl, setProfileUrl] = useState(null);
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    //대표뱃지담는 스테이트
    const [firstBadgeImg, setFirstBadgeImg] = useState('');

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [user, setUser] = useAtom(userAtom);

    const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
    const [badgeList, setBadgeList] = useState([]);


    useEffect(() => {
        token && myAxios(token, setToken).get(`/user/mypage/profile`)
            .then(res => {
                const data = res.data;
                setUsername(data.username || '');
                setName(data.name || '');
                setTel(data.tel || '');
                setEmail(data.email || '');
                setAddr(data.addr || '');
                setDetailAddr(data.detailAddr || '');
                setBirthday(data.birthday || '');
                setIntro(data.intro || '');
                setSelectedCategories(data.categories || []); // 기존 선택된 카테고리
                setActiveScore(data.activeScore || 0);
                setUserBadgeId(data.userBadgeId || null);
                // if (data.profile) setProfileUrl(`${url}/image?filename=${user.profile}` + data.profile);
                if(!data.profile && !profileUrl){
                    setProfileUrl("/profile.png")
                }else if (data.profile && !profileUrl) {
                    setProfileUrl(`${url}/image?filename=${data.profile}&t=${new Date().getTime()}`);
                }
            })
            .catch(err => console.error("프로필 불러오기 실패", err));

        // 카테고리 리스트 불러오기
        myAxios(token, setToken).get('/categories')
            .then(res => {
                setCategoryList(res.data.filter(item => item.subCategoryName !== '기타'));
            })
            .catch(err => console.error("카테고리 불러오기 실패", err));
    }, [token, profileImage, profileUrl]);

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else if (selectedCategories.length < 5) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            // 브라우저에서 임시로 보여주기
            setProfileUrl(URL.createObjectURL(file));
        }
        // setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (profileImage) formData.append("profileImage", profileImage);
        console.log("현재 user.profile:", user.profile);
        // categories 배열을 category1~5 로 분리
        const jsonBlob = new Blob([JSON.stringify({
            name, tel, email, addr, detailAddr, birthday, intro,
            category1: selectedCategories[0] || '',
            category2: selectedCategories[1] || '',
            category3: selectedCategories[2] || '',
            category4: selectedCategories[3] || '',
            category5: selectedCategories[4] || '',
        })], { type: "application/json" });

        formData.append("profileData", jsonBlob);

        try {
            await myAxios(token, setToken).patch(`/user/mypage/profile`, formData);
            alert("프로필이 수정되었습니다.");

            // 🔥 프로필 다시 불러와서 userAtom 갱신
            const res = await myAxios(token, setToken).get(`/user/mypage/profile`);
            setUser(res.data);  // ← jotai의 setUser (atom 갱신)
            setProfileUrl(`${url}/image?filename=${res.data.profile}&t=${new Date().getTime()}`);
        } catch (err) {
            console.error("프로필 수정 실패:", err);
        }
    };

    const handleComplete = (data) => {
        const fullAddress = data.address;
        setAddr(fullAddress);
        setIsPostcodeOpen(false);
        document.getElementById("detailAddrInput").focus();
    };



    const handleRemoveCategory = (idx) => {
        setSelectedCategories(selectedCategories.filter((_, i) => i !== idx));
    };

    useEffect(() => {
        token && myAxios(token, setToken).get("/user/firstBadge")
            .then(res => {
                console.log("뱃지")
                console.log(res.data.badgeImg);
                setFirstBadgeImg(res.data.badgeImg);
            })
            .catch(err => {
                console.log(err);
            })
    }, [token])

    const handleBadgeSelect = (userBadgeId, badgeImg) => {
        token && myAxios(token, setToken).patch("/user/mypage/badge", { userBadgeId })
            .then(() => {
                setFirstBadgeImg(badgeImg); // 대표 뱃지 이미지 교체
                setIsBadgeModalOpen(false);
            })
            .catch(console.error);
    };
    return (
        <>
            <Header />
            <div className="KYM-myprofile-container">
                <aside className="KYM-sidebar-area">
            <Sidebar />
            </aside>
            <div className="KYM-profile-wrap">
                <h3>내 정보 수정</h3>
                <div className="KYM-profile-table">
  <div className="KYM-profile-row">
    <div className="KYM-profile-cell">
      <div className="KYM-photo-title">프로필 사진</div>
      <div className="KYM-photo-cell-content">
        <img
          src={profileUrl ? profileUrl : `${url}/image?filename=${user.profile}&t=${new Date().getTime()}`}
          alt="프로필"
          className="KYM-photo-img"
        />
        <button onClick={() => document.getElementById("fileInput").click()}>프로필 변경</button>
        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
    </div>

    <div className="KYM-profile-cell">
      <div className="KYM-badge-top">
        <span className="KYM-badge-title">배지</span>
        <div className="KYM-active-wrap">
          <span className="KYM-active-score">활동점수 : {activeScore}점</span>
          {/* <button className="KYM-help-btn">?</button> */}
        </div>
      </div>
      <div className="KYM-badge-cell-content">
        <img src={`/${firstBadgeImg}`} alt="뱃지" className="KYM-badge-img" />
        <button onClick={() => {
          setIsBadgeModalOpen(true);
          token && myAxios(token, setToken).get("/user/badges")
            .then(res => setBadgeList(res.data))
            .catch(console.error);
        }}>뱃지 변경</button>
      </div>
    </div>
  </div>

  <div className="KYM-profile-row">
    <div className="KYM-profile-cell"><div className="KYM-td-flex"><label>아이디</label><input disabled value={username} /></div></div>
    <div className="KYM-profile-cell"><div className="KYM-td-flex"><label>비밀번호</label><input type="password" value="********" disabled /></div></div>
  </div>
  <div className="KYM-profile-row">
    <div className="KYM-profile-cell"><div className="KYM-td-flex"><label>이름</label><input value={name} onChange={e => setName(e.target.value)} /></div></div>
    <div className="KYM-profile-cell"><div className="KYM-td-flex"><label>전화번호</label><input value={tel} onChange={e => setTel(e.target.value)} /></div></div>
  </div>
  <div className="KYM-profile-row">
    <div className="KYM-profile-cell"><div className="KYM-td-flex"><label>이메일</label><input value={email} onChange={e => setEmail(e.target.value)} /></div></div>
    <div className="KYM-profile-cell"><div className="KYM-td-flex"><label>생년월일</label><input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} /></div></div>
  </div>
</div>

                <div className="KYM-address-box">
                        <label>주소</label>
                    <div className="KYM-post-row">
                        <input type="text" value={addr} readOnly onClick={() => setIsPostcodeOpen(true)} style={{ cursor: 'pointer' }} />
                        <button className="KYM-address-btn" onClick={() => setIsPostcodeOpen(true)}>주소 검색</button>
                    </div>
                    <input id="detailAddrInput" value={detailAddr} onChange={e => setDetailAddr(e.target.value)} placeholder="상세주소" />
                </div>
                {isPostcodeOpen && (
                    <div className="modal-overlay" onClick={() => setIsPostcodeOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <DaumPostcode onComplete={handleComplete} autoClose />
                            <button className="close-btn" onClick={() => setIsPostcodeOpen(false)}>닫기</button>
                        </div>
                    </div>
                )}

                <div className="KYM-category-section">
                    <label>선호 카테고리</label>
                    <div className="KYM-category-list">
                        {selectedCategories.map((cat, idx) => (
                            <span key={idx} className="selected-cat">
                                {(typeof cat === 'string') ? cat : (cat.subCategoryName || cat.name)}
                                <button onClick={() => handleRemoveCategory(idx)}>X</button>
                            </span>
                        ))}
                        {selectedCategories.length < 5 && (
                            <button className="modify-btn" onClick={() => setIsCategoryModalOpen(true)}>
                                +
                            </button>
                        )}
                    </div>
                </div>

                {isCategoryModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>카테고리 선택 (최대 5개)</h3>
                            <div className="modal-category-list">
                                {categoryList.map((cat, idx) => (
                                    <div
                                        key={idx}
                                        className={`category-item ${selectedCategories.includes(cat.subCategoryName) ? 'selected' : ''}`}
                                        onClick={() => toggleCategory(cat.subCategoryName)}
                                    >
                                        {cat.subCategoryName}
                                    </div>
                                ))}
                            </div>
                            <button className="close-btn" onClick={() => setIsCategoryModalOpen(false)}>확인</button>
                        </div>
                    </div>
                )}

                <div className="KYM-intro-box">
                    <label>한줄소개</label>
                    <textarea value={intro} onChange={e => setIntro(e.target.value)} />
                </div>

                <div className="KYM-btns">
                    <button onClick={handleSubmit}>수정하기</button>
                    <button onClick={() => navigate("/mypage/password")}>비밀번호 변경</button>
                </div>
            </div>
            </div>
        </>
    );
}
