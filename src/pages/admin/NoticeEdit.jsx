import React, { useEffect, useState } from 'react';
import Layout from "./Layout";
import {url} from "/src/config";
import './NoticeCreate.css'; // 공통으로 사용 
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';


const NoticeCreate = () => {
  // ===== 상태 관리 =====
  const {noticeId} = useParams() ; // noticeId 작성된 공지사항 정보 불러오기 
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isHidden: false, // 디폴트 : 숨기기가 아닌 '보이기'
    pinYn : false
  });


  // 공지사항 상세 조회
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axios.get(`${url}/api/notice/${noticeId}`);
        setFormData({ // ← 이게 맞음!
          title: res.data.title,
          content: res.data.content,
          pinYn: res.data.pinYn
        });
      } catch (err) {
        console.error('공지사항 조회 실패 :', err);
        alert('공지사항을 불러오는 데 실패했습니다.');
      }
    };
    fetchNotice();
  }, [noticeId]);

  // == 이벤트 핸들러들 =====
  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 수정하기 버튼 클릭 핸들러
  const handleSubmit = async (e) => {
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

    try {
      const response = await axios.put(`${url}/api/notice/${noticeId}`, {  // noticeId 문자열이므로 {}앞에 $
        title: formData.title,
        content: formData.content,
        pinYn: formData.pinYn,
        isHidden: formData.isHidden 
      });

      if (response.status === 200) {
        alert('공지사항이 수정되었습니다!');
        navigate('/admin/notice');
      }
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      alert('공지사항 수정에 실패했습니다.');
    }
  };



  // ===== 렌더링 =====
  return (
    <Layout>
      {/* <div className="notice-createHY"> */}
        {/* 페이지 제목 */}
        <div className="page-titleHY">
          <h1>공지사항 수정</h1>
        </div>

        {/* 수정 폼 */}
        <form className="notice-formHY" onSubmit={handleSubmit}>
          {/* 공개 여부 체크박스 */}
          <div className="form-group checkbox-groupHY">
        <span className="checkbox-textHY">상단 고정 :</span>
            <label className="checkbox-labelHY">
              <input
                type="checkbox"
                name="pinYn"
                checked={formData.pinYn}
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
          <div className="right-alignHY">
            <button
              type="submit"
              className="btn-submitHY"
            >
              수정하기
            </button>
          </div>
        </form>
      {/* </div> */}
    </Layout>
  );
};

export default NoticeCreate;