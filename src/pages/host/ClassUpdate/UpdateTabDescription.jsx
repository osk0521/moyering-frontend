import { useEffect, useRef, useState } from 'react';
import './UpdateTabDescription.css';
import React from 'react';
import { Editor } from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // 스타일 꼭 필요!
import { url } from '../../../config';

const UpdateTabDescription = ({ classData, setClassData }) => {
    const editorRef = useRef();
    const editorInstanceRef = useRef();
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

        const previewUrl = URL.createObjectURL(file);
        const updatedImages = [...images];
        updatedImages[index] = previewUrl;
        setImages(updatedImages);

        const imageKey = `img${index + 1}`;
        setClassData((prev) => ({
            ...prev,
            description: {
                ...prev.description,
                [imageKey]: file,
            },
        }));
    };

    useEffect(() => {
        if (editorRef.current && !editorInstanceRef.current) {
            const instance = new Editor({
                el: editorRef.current,
                height: '400px',
                initialEditType: 'wysiwyg',
                previewStyle: 'vertical',
                initialValue: description?.detailDescription || '',
                hideModeSwitch: true,
                placeholder: '모임에 대한 상세한 설명을 작성해주세요',
                toolbarItems: [
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol'],
                    ['table', 'link'],
                    ['image'],
                ],
                hooks: {
                    addImageBlobHook: async (blob, callback) => {
                        try {
                            const formData = new FormData();
                            formData.append('image', blob);

                            const res = await fetch(`${url}/api/upload/image`, {
                                method: 'POST',
                                body: formData,
                            });

                            const result = await res.json();
                            const imageUrl = `${url}${result.url}`; // 절대경로 조립
                            callback(imageUrl, blob.name);
                        } catch (error) {
                            console.error('이미지 업로드 실패:', error);
                        }
                    },
                },
                events: {
                    change: () => {
                        const content = instance.getHTML();
                        setClassData((prev) => ({
                            ...prev,
                            description: {
                                ...prev.description,
                                detailDescription: content,
                            },
                        }));
                    },
                },
            });

            editorInstanceRef.current = instance;
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    }, [editorRef]);

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
                                name={`img${index + 1}`}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor={`KHJ-image-input-${index}`} className="KHJ-image-box-label">
                                {image ? (
                                    <img
                                        src={
                                            image.startsWith('blob:')
                                                ? image
                                                : `${url}/image?filename=${image}`
                                        }
                                        alt={`이미지 ${index + 1}`}
                                        className="KHJ-image-box-img"
                                    />
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
                {/* ✅ Toast UI Editor 들어갈 자리 */}
                <div ref={editorRef} />
                <div className="KHJ-footer">
                    <span>{(description.detailDescription || '').length} / 2000</span>
                </div>
            </div>
        </div>
    );
};

export default UpdateTabDescription;
