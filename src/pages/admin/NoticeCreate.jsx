import React, { useState } from 'react';
import Layout from "./Layout";
import './NoticeCreate.css';

const NoticeCreate = () => {
  // ===== 상태 관리 =====
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublished: false // 공개 여부
  });

  // ===== 이벤트 핸들러들 =====
  
  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 등록하기 버튼 클릭 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 여기서 실제 등록 로직 구현
    console.log('공지사항 등록:', formData);
    
    // 성공 메시지 및 페이지 이동 등
    alert('공지사항이 등록되었습니다.');
    
    // 폼 초기화
    setFormData({
      title: '',
      content: '',
      isPublished: false
    });
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
      setFormData({
        title: '',
        content: '',
        isPublished: false
      });
      // 페이지 이동 로직 추가 가능
    }
  };

  // ===== 렌더링 =====
  return (
    <Layout>
      {/* <div className="notice-createHY"> */}
        {/* 페이지 제목 */}
        <div className="page-titleHY">
          <h1>공지사항 등록</h1>
        </div>

        {/* 등록 폼 */}
        <form className="notice-formHY" onSubmit={handleSubmit}>
          {/* 공개 여부 체크박스 */}
          <div className="form-group checkbox-groupHY">
        <span className="checkbox-textHY">고정 :</span>
            <label className="checkbox-labelHY">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
              />
       
            </label>
          </div>
          <br></br>

          {/* 제목 입력 */}
          <div className="form-groupHY">
            <label className="form-labelHY">제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-inputHY"
              placeholder="공지사항 제목을 입력하세요"
            />
          </div>

          {/* 내용 입력 */}
          <div className="form-groupHY">
            <label className="form-labelHY">내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="form-textareaHY"
              placeholder="공지사항 내용을 입력하세요"
              rows="15"
            />
          </div>

          {/* 버튼 영역 */}
          <div className="button-groupHY">
            <button
              type="button"
              className="btn-cancelHY"
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-submitHY"
            >
              등록하기
            </button>
          </div>
        </form>
      {/* </div> */}
    </Layout>
  );
};

export default NoticeCreate;