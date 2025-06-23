// src/components/banner/BannerCreateModal.jsx
import React, { useState, useEffect } from 'react';
import './BannerCreateModal.css';

const BannerCreateModal = ({ banner, isEditMode, onSave, onClose }) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    bannerId: '',
    title: '',
    content: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  // 편집 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && banner) {
      setFormData({
        bannerId: banner.bannerId || '',
        title: banner.title || '',
        content: banner.content || '',
        image: null,
      });
      
      if (banner.image) {
        setImagePreview(banner.image);
      }
    }
  }, [isEditMode, banner]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 스크롤 방지
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // 배경 클릭 시 모달 닫기
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 폼 데이터 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 이미지 파일 처리
  const handleImageChange = (file) => {
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: '이미지 파일은 5MB 이하여야 합니다.'
        }));
        return;
      }

      // 파일 타입 체크
      if (!file.type.match(/^image\/(png|jpg|jpeg|gif)$/)) {
        setErrors(prev => ({
          ...prev,
          image: 'PNG, JPG, GIF 파일만 업로드 가능합니다.'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // 에러 클리어
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  // 드래그 앤 드롭 처리
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0]);
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '설명을 입력해주세요.';
    }



    if (!isEditMode && !formData.image) {
      newErrors.image = '배너 이미지를 업로드해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 저장 처리
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const saveData = {
      ...formData,
      id: isEditMode ? banner.id : Date.now(),
      bannerId: isEditMode ? banner.bannerId : `BN${Date.now()}`,
      createAt: isEditMode ? banner.createAt : new Date().toISOString().split('T')[0],
      createdBy: 'admin', // 실제로는 로그인한 사용자 정보
    };

    onSave(saveData);
  };

  return (
    <div className="modal-overlayHY" onClick={handleBackdropClick}>
      <div className="banner-modal-containerHY">
        {/* 모달 헤더 */}
        <div className="banner-modal-headerHY">
          <h2 className="banner-modal-titleHY">
            {isEditMode ? '배너 수정' : '배너 추가'}
          </h2>
          <button className="banner-close-buttonHY" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 모달 바디 */}
        <div className="banner-modal-bodyHY">
          <div className="banner-formHY">
            {/* 배너 이미지 업로드 */}
            <div className="form-groupHY">
              <label className="form-label requiredHY">
                배너 이미지
              </label>
              <div 
                className={`image-upload-area ${dragActive ? 'drag-active' : ''} ${errors.image ? 'error' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('image-input').click()}
              >
                {imagePreview ? (
                  <div className="image-previewHY">
                    <img src={imagePreview} alt="Preview" />
                    <div className="image-overlayHY">
                      <span>클릭하여 이미지 변경</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholderHY">
                    <div className="upload-iconHY">📤</div>
                    <p className="upload-textHY">클릭하여 이미지를 업로드하세요</p>
                    <p className="upload-subtextHY">PNG, JPG, GIF 최대 5MB</p>
                  </div>
                )}
                <input
                  id="image-input"
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/gif"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
              {errors.image && <span className="error-messageHY">{errors.image}</span>}
            </div>

            {/* 제목 */}
            <div className="form-groupHY">
              <label className="form-label requiredHY">제목</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="배너 제목을 입력하세요"
                className={`form-input ${errors.title ? 'error' : ''}`}
              />
              {errors.title && <span className="error-messageHY">{errors.title}</span>}
            </div>

            {/* 설명 */}
            <div className="form-groupHY">
              <label className="form-labelHY">설명</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="배너에 대한 설명을 입력하세요"
                rows={4}
                className={`form-textarea ${errors.content ? 'error' : ''}`}
              />
              {errors.content && <span className="error-messageHY">{errors.content}</span>}
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="banner-modal-footerHY">
          <div className="button-groupHY">
            <button className="btn btn-cancelHY" onClick={onClose}>
              취소
            </button>
            <button className="btn btn-saveHY" onClick={handleSave}>
              {isEditMode ? '수정' : '등록'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCreateModal;