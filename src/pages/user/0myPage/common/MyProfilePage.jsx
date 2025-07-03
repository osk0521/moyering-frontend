import React, { useEffect, useState } from 'react';
import { myAxios } from '../../../../config';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../../../atoms';
import { useNavigate } from 'react-router-dom';
import './MyProfilePage.css';
import DaumPostcode from 'react-daum-postcode';

export default function MyProfilePage() {

    const [token, setToken] = useAtom(tokenAtom)
    const navigate = useNavigate();
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

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    useEffect(() => {
        token && myAxios(token, setToken).get(`/user/mypage/profile`)
            .then(res => {
                const data = res.data;
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
                if (data.profile) setProfileUrl("/profile/" + data.profile);
            })
            .catch(err => console.error("프로필 불러오기 실패", err));

        // 카테고리 리스트 불러오기
        myAxios(token, setToken).get('/categories')
            .then(res => {
                setCategoryList(res.data.filter(item => item.subCategoryName !== '기타'));
            })
            .catch(err => console.error("카테고리 불러오기 실패", err));
    }, [token]);

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else if (selectedCategories.length < 5) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (profileImage) formData.append("profileImage", profileImage);

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

        await myAxios(token, setToken).patch(`/user/mypage/profile`, formData);
        alert("프로필이 수정되었습니다.");
        window.location.reload();
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
    console.log("selectedCategories:", selectedCategories);
    return (
        <div className="KYM-profile-wrap">
            <table className="KYM-profile-table">
                <tbody>
                    <tr>
                        <td className="KYM-photo-cell">
                            <div className="KYM-photo-title">프로필 사진</div>
                            <div className="KYM-photo-cell-content">
                                <img src={profileUrl} alt="프로필" className="KYM-photo-img" />
                                <button onClick={() => document.getElementById("fileInput").click()}>프로필 변경</button>
                                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                            </div>
                        </td>
                        <td className="KYM-badge-cell">
                            <div className="KYM-badge-top">
                                <span className="KYM-badge-title">뱃지</span>
                                <div className="KYM-active-wrap">
                                    <span className="KYM-active-score">활동점수 : {activeScore}점</span>
                                    <button className="KYM-help-btn">?</button>
                                </div>
                            </div>
                            <div className="KYM-badge-cell-content">
                                <img src="/badge.png" alt="뱃지" className="KYM-badge-img" />
                                <button>뱃지 변경</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><div className="KYM-td-flex"><label>아이디</label><input disabled value={name} /></div></td>
                        <td><div className="KYM-td-flex"><label>비밀번호</label><input type="password" value="********" disabled /></div></td>
                    </tr>
                    <tr>
                        <td><div className="KYM-td-flex"><label>이름</label><input value={name} onChange={e => setName(e.target.value)} /></div></td>
                        <td><div className="KYM-td-flex"><label>전화번호</label><input value={tel} onChange={e => setTel(e.target.value)} /></div></td>
                    </tr>
                    <tr>
                        <td><div className="KYM-td-flex"><label>이메일</label><input value={email} onChange={e => setEmail(e.target.value)} /></div></td>
                        <td><div className="KYM-td-flex"><label>생년월일</label><input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} /></div></td>
                    </tr>
                </tbody>
            </table>

            <div className="KYM-address-box">
                <div className="KYM-post-row">
                    <input type="text" value={addr} readOnly onClick={() => setIsPostcodeOpen(true)} style={{ cursor: 'pointer' }} />
                    <button onClick={() => setIsPostcodeOpen(true)}>주소 검색</button>
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
                            카테고리 수정하기
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
    );
}
