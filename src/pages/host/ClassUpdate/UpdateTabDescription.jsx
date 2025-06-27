import { useState } from 'react';
import './UpdateTabDescription.css';
import React from 'react'; // 이 한 줄만 추가!
import { url } from '../../../config';

const UpdateTabDescription = ({ classData, setClassData }) => {
    const { description } = classData;

    const [images, setImages] = useState([
        description.imgName1,
        description.imgName2,
        description.imgName3,
        description.imgName4,
        description.imgName5,
    ]);

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. 미리보기 이미지 URL 저장
        const previewUrl = URL.createObjectURL(file);
        const updatedImages = [...images];
        updatedImages[index] = previewUrl;
        setImages(updatedImages);
        setClassData({...classData, description:{...classData.description, [e.target.name]:file}})

        // 2. classData.description에 실제 파일 저장
        const imageKey = `img${index + 1}`;
        setClassData((prev) => ({
            ...prev,
            description: {
                ...prev.description,
                [imageKey]: file,
            },
        }));
    };


    const handledetailDescriptionChange = (e) => {
        setClassData(prev => ({
            ...prev,
            description: {
                ...prev.description,
                detailDescription: e.target.value
            }
        }))
    }

    return (
        <div className="KHJ-class-info-box">
            <h3 className="KHJ-section-title">클래스 설명</h3>

            <div className="KHJ-image-upload-container">
                <h3>이미지 업로드</h3>
                <div className="KHJ-image-box-container">
                    {images.map((image, index) => (
                        <div key={index} className="KHJ-image-box">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                                id={`KHJ-image-input-${index}`}
                                name={`img${index+1}`}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor={`KHJ-image-input-${index}`} className="KHJ-image-box-label">
                                {image ? (
                                    <img src={`${url}/image?filename=${image}`} alt={`이미지 ${index + 1}`} className="KHJ-image-box-img" />
                                ) : (
                                    <div className="KHJ-plus-icon">+</div>
                                )}
                            </label>
                        </div>
                    ))}
                </div>
                <p className="KHJ-info-text">텍스트를 사용한 대표이미지는 노출이 불가합니다.</p>
                <p className="KHJ-img-info-text">
                    권장 사이즈 : 가로 1000px * 세로 1000px<br />
                    최소 사이즈 : 가로 600px * 세로 600px<br />
                    용량 : 10MB이하, 파일유형 : JPG, PNG, 최소 1장 - 최대 5장 등록 가능
                </p>
            </div>

            <hr />

            <div className="KHJ-form-section">
                <label className="KHJ-description-label">
                    <span className="KHJ-required-text-dot">*</span>클래스 상세설명
                </label>
                <textarea
                    value={description.detailDescription || ''}
                    onChange={handledetailDescriptionChange}
                    placeholder="클래스에 대한 설명을 작성해주세요."
                    className="KHJ-description-textarea"
                    maxLength="2000"
                />
                <div className="KHJ-footer">
                    <span>{(description.detailDescription || '').length} / 2000</span>
                </div>
            </div>
        </div>
    );
};

export default UpdateTabDescription;
