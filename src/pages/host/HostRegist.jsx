import React, { useRef, useState } from 'react';
import './HostRegist.css';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { url } from './../../config';

const HostRegist = () => {
  const [host, setHost] =
    useState({ id: 0, name: '', tel: '', publicTel: '', email: '', intro: '', tag1: '', tag2: '', tag3: '', tag4: '', tag5: '' })
  const [ifile, setIfile] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const readURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("preview").src = e.target.result;
      }
      reader.readAsDataURL(input.target.files[0]);
      setIfile(input.target.files[0]);
    }
  }

  const handleClick = () => {
    fileInputRef.current.click(); // 숨겨진 input 클릭
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (!newTag) return;
    if (tags.length >= 5) {
      alert("최대 5개까지 입력 가능합니다.");
      return;
    }
    if (tags.includes(newTag)) {
      alert("중복된 태그입니다.");
      return;
    }
    setTags([...tags, newTag]);
    setTagInput('');
  }
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const edit = (e) => {
    setHost({ ...host, [e.target.name]: e.target.value })
  }

  //submit시에 tags배열에 들어있는 0~4까지의 태그를 tag1~5까지 넣어야함.
  const submit = (e) => {

    const updatedHost = {
      ...host,
      tag1: tags[0] || '',
      tag2: tags[1] || '',
      tag3: tags[2] || '',
      tag4: tags[3] || '',
      tag5: tags[4] || '',
    };

    setHost(updatedHost);

    e.preventDefault();
    const formData = new FormData();
    Object.entries(updatedHost).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (ifile != null) formData.append("ifile", ifile);

    axios.post(`${url}/host/regist`, formData)
      .then(res => {
        console.log('res:', res);
        console.log('res.data:', res.data); // 👉 여기 찍어봐
        navigate(`/host/hostMyPage/${res.data}`)
      })
      .catch(err => {
        console.log(err);
      })

  }

  return (
    <div className="host-regist-wrapper" onSubmit={submit}>
      <form className="host-form">
        <label className="form-label">프로필 사진</label>
        <div className="profile-image-box">
          <img
            className="profile-image"
            id="preview"
            src={ifile} // 기본 이미지 있으면 보여주기
          />
          <input
            type="file"
            id="ifile"
            name="ifile"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={readURL}
          />
          <button type="button" className="img-upload-btn" onClick={handleClick}>
            파일 선택
          </button>
        </div>

        <label className="form-label">호스트 명</label>
        <input type="text" placeholder="호스트명을 입력" className="form-input" onChange={edit} name="name" />
        <p className="form-subtext">수강생에게 보여지는 호스트 이름입니다.</p>

        <label className="form-label">휴대전화</label>
        <div className="input-row">
          <input type="text" placeholder="전화번호 입력" className="form-input" onChange={edit} name="tel" />
          <button type="button" className="verify-btn">인증번호 보내기</button>
        </div>
        <input type="text" placeholder="인증번호 입력" className="form-input" />
        <p className="error-msg">인증번호가 틀립니다! 인증에 실패하였습니다!</p>

        <label className="form-label">공개전화번호</label>
        <input type="text" placeholder="전화번호 입력" className="form-input" onChange={edit} name="publicTel" />
        <p className="form-subtext">수강생에게 보여지는 연락처입니다.</p>

        <label className="form-label">이메일</label>
        <input type="email" placeholder="이메일을 입력해주세요." className="form-input" onChange={edit} name="email" />
        <p className="form-subtext">상세 사항안내 시 이 주소로 연락드립니다.</p>

        <label className="form-label">강사 소개</label>
        <textarea
          className="form-textarea"
          placeholder="강사소개를 입력해주세요."
          rows="5"
          name='intro'
          onChange={edit}
        />

        <label className="form-label">강사 소개 태그</label>
        <div className="input-row">
          <input
            type="text"
            placeholder="태그를 통해 본인을 소개해주세요!"
            className="form-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <button type="button" className="add-tag-btn" onClick={handleAddTag}>등록</button>
        </div>
        <div className="tag-list">
          {tags.map((tag, idx) => (
            <div key={idx} className="tag-item">
              #{tag}
              <button type="button" className="remove-tag-btn" onClick={() => handleRemoveTag(tag)}>×</button>
            </div>
          ))}
        </div>
        <p className="form-subtext">예시) 요리, 코딩</p>

        <button className="submit-btn" >프로필 등록</button>
      </form>
    </div>
  );
};

export default HostRegist;
