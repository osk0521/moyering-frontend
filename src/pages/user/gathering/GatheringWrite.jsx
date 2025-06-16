import React, { useState, useEffect, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { CiSearch, CiClock1, CiLocationOn, CiHashtag } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { SlPicture } from "react-icons/sl";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Editor } from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import DaumPostcode from "react-daum-postcode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./GatheringWrite.css";

export default function GatheringWrite() {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: null, // Date 객체로 변경
    startTime: "",
    endTime: "",
    category1: "스포츠/레저",
    category2: "축구",
    link: "",
    address: "",
    detailAddress: "",
    minPeople: 2,
    maxPeople: "",
    deadline: "",
    content: "",
    preparation: "",
    tags: [], // 문자열 배열로 변경
    introduction: "",
  });
  const [tagInput, setTagInput] = useState("");

  // 태그 입력 처리 (Enter 또는 쉼표로 태그 추가)
  const handleTagInput = (e) => {
    const value = e.target.value;

    if (e.key === "Enter" || value.includes(",")) {
      e.preventDefault();

      // 쉼표로 분리하고 공백 제거
      const newTags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && !formData.tags.includes(tag));

      if (newTags.length > 0) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, ...newTags],
        }));
        setTagInput("");
      }
    } else {
      setTagInput(value);
    }
  };

  // 태그 삭제 처리
  const handleTagDelete = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  // 캘린더 SVG 아이콘 컴포넌트
  const CalendarIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: '8px', color: '#666' }}
    >
      <path
        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
        fill="currentColor"
      />
    </svg>
  );

  // 커스텀 DatePicker 입력 컴포넌트
  const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="GatheringWrite_date-input-container_osk" onClick={onClick} ref={ref}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        className="GatheringWrite_custom-input_osk GatheringWrite_date-input_osk"
        readOnly
      />
      <CalendarIcon />
    </div>
  ));

  // 숫자 입력 핸들러 (2 이상의 숫자만 허용)
  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    
    // 빈 문자열은 허용 (사용자가 입력 중일 수 있으므로)
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }
    
    // 한글 체크 정규식
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    
    // 한글이 포함되어 있으면 차단
    if (koreanRegex.test(value)) {
      return; // 이전 값 유지
    }
    
    // 숫자만 허용하는 정규식
    const numberRegex = /^\d+$/;
    
    if (numberRegex.test(value)) {
      const numValue = parseInt(value, 10);
      // 2 이상의 숫자만 허용
      if (numValue >= 2) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      // 2 미만이면 업데이트하지 않음 (이전 값 유지)
    }
    // 숫자가 아니면 업데이트하지 않음 (이전 값 유지)
  };

  // Daum 우편번호 검색 완료 시 호출되는 함수
  const handlePostcodeComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setFormData((prev) => ({
      ...prev,
      address: fullAddress,
    }));

    setIsPostcodeOpen(false);
  };

  // 주소 검색 창 열기
  const openPostcode = () => {
    setIsPostcodeOpen(true);
  };

  useEffect(() => {
    // DOM이 완전히 렌더링된 후 에디터 초기화
    const initEditor = () => {
      if (editorRef.current && !editor) {
        try {
          const editorInstance = new Editor({
            el: editorRef.current,
            height: "400px",
            initialEditType: "markdown",
            placeholder: "모임에 대한 상세한 설명을 작성해주세요",
            hideModeSwitch: true,
            // 툴바 설정
            toolbarItems: [
              ["heading", "bold", "italic", "strike"],
              ["hr", "quote"],
              ["ul", "ol"],
              ["table", "link"],
              ["image"],
            ],
            // 에디터 테마 설정 추가
            theme: "default",
            // 이미지 업로드 기능
            hooks: {
              addImageBlobHook: (blob, callback) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const imageUrl = e.target.result;
                  const altText = blob.name || "Uploaded image";
                  callback(imageUrl, altText);
                };
                reader.readAsDataURL(blob);
              },
            },
            events: {
              change: () => {
                const content = editorInstance.getMarkdown();
                setFormData((prev) => ({
                  ...prev,
                  content: content,
                }));
              },
              // 에디터가 완전히 로드된 후 실행
              load: () => {
                console.log("Editor loaded successfully");
              },
            },
          });
          setEditor(editorInstance);
        } catch (error) {
          console.error("TOAST UI Editor 초기화 실패:", error);
        }
      }
    };

    // 약간의 딜레이를 주어 DOM이 완전히 렌더링되도록 함
    const timer = setTimeout(initEditor, 100);

    return () => {
      clearTimeout(timer);
      if (editor) {
        try {
          editor.destroy();
        } catch (error) {
          console.error("Editor cleanup 에러:", error);
        }
        setEditor(null);
      }
    };
  }, []); // 빈 의존성 배열 유지

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      content: editor ? editor.getMarkdown() : formData.content,
    };
    console.log("제출 데이터:", submitData);

    // 이미지가 포함된 경우의 처리 예시
    if (submitData.content.includes("![")) {
      console.log("이미지가 포함된 콘텐츠입니다.");
      // 서버 전송 시 Base64 이미지를 실제 이미지 URL로 변환하는 로직 필요
    }
  };

  return (
    <div className="GatheringWrite_gathering-write-container_osk">
      <div className="GatheringWrite_content-wrapper_osk">
        <div>
          {/* 기본 정보 */}
          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_section-header_osk">
              <span className="GatheringWrite_section-icon_osk">
                <HiOutlineInformationCircle />
              </span>
              <span className="GatheringWrite_section-title_osk">기본 정보</span>
            </div>

            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">
                썸네일 <span className="GatheringWrite_required_osk">*</span>
              </label>
              <input type="file" name="GatheringWrite_ifile_osk" id="GatheringWrite_ifile_osk" accept="image/*" />
            </div>
            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">
                모임 이름 <span className="GatheringWrite_required_osk">*</span>
              </label>
              <input
                type="text"
                name="gatheringName"
                value={formData.gatheringName}
                onChange={handleInputChange}
                placeholder="모임 이름을 입력해주세요"
                className="GatheringWrite_custom-input_osk"
              />
            </div>

            <div className="GatheringWrite_row_osk">
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    모임 날짜 <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    customInput={<CustomDateInput />}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="yyyy/mm/dd"
                    minDate={new Date()}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={10}
                  />
                </div>
              </div>
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    모임 시간 <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <div className="GatheringWrite_time-input-group_osk">
                    <input
                      type="text"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      placeholder="시작 시간 입력"
                      className="GatheringWrite_custom-input_osk GatheringWrite_time-input_osk"
                    />
                    <CiClock1 />
                    <span className="GatheringWrite_time-separator_osk">~</span>
                    <input
                      type="text"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      placeholder="종료 시간 입력"
                      className="GatheringWrite_custom-input_osk GatheringWrite_time-input_osk"
                    />
                    <CiClock1 />
                  </div>
                </div>
              </div>
            </div>

            <div className="GatheringWrite_row_osk">
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    1차 카테고리 <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <select
                    name="category1"
                    value={formData.category1}
                    onChange={handleInputChange}
                    className="GatheringWrite_custom-input_osk"
                  >
                    <option>스포츠/레저</option>
                    <option>문화/예술</option>
                    <option>학습/교육</option>
                    <option>네트워킹</option>
                    <option>여행</option>
                  </select>
                </div>
              </div>
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    2차 카테고리 <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <select
                    name="category2"
                    value={formData.category2}
                    onChange={handleInputChange}
                    className="GatheringWrite_custom-input_osk"
                  >
                    <option>축구</option>
                    <option>농구</option>
                    <option>테니스</option>
                    <option>배드민턴</option>
                    <option>야구</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 모임 장소 */}
          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_section-header_osk">
              <span className="GatheringWrite_section-icon_osk">
                <CiLocationOn />
              </span>
              <span className="GatheringWrite_section-title_osk">모임 장소</span>
            </div>

            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">
                링크 <span className="GatheringWrite_required_osk">*</span>
              </label>
              <div className="GatheringWrite_address-search-group_osk">
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="주소 찾기"
                  className="GatheringWrite_custom-input_osk GatheringWrite_address-input_osk"
                  readOnly
                />
                <button
                  type="button"
                  onClick={openPostcode}
                  className="GatheringWrite_address-search-btn_osk"
                >
                  <CiSearch size={16} />
                </button>
              </div>
            </div>

            <div className="GatheringWrite_form-group_osk">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="주소를 입력해주세요"
                className="GatheringWrite_custom-input_osk"
                readOnly
              />
            </div>

            <div className="GatheringWrite_form-group_osk">
              <input
                type="text"
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleInputChange}
                placeholder="상세 주소를 입력해주세요"
                className="GatheringWrite_custom-input_osk"
              />
            </div>
          </div>

          {/* 참여 정보 */}
          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_section-header_osk">
              <span className="GatheringWrite_section-icon_osk">
                <GoPeople />
              </span>
              <span className="GatheringWrite_section-title_osk">참여 정보</span>
            </div>

            <div className="GatheringWrite_row_osk">
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    최소 인원 <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <input
                    type="text"
                    name="minPeople"
                    value={formData.minPeople}
                    onChange={handleNumberInput}
                    placeholder="최소 인원 (2 이상)"
                    className="GatheringWrite_custom-input_osk"
                  />
                </div>
              </div>
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">최대 인원</label>
                  <input
                    type="text"
                    name="maxPeople"
                    value={formData.maxPeople}
                    onChange={handleNumberInput}
                    placeholder="최대 인원 (2 이상)"
                    className="GatheringWrite_custom-input_osk"
                  />
                </div>
              </div>
            </div>

            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">
                신청 마감 <span className="GatheringWrite_required_osk">*</span>
              </label>
              <input
                type="text"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                placeholder="mm/dd/yyyy"
                className="GatheringWrite_custom-input_osk"
              />
            </div>
          </div>

          {/* 모임 상세 정보 */}
          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_section-header_osk">
              <span className="GatheringWrite_section-icon_osk">
                <HiOutlineInformationCircle />
              </span>
              <span className="GatheringWrite_section-title_osk">모임 상세 정보</span>
            </div>

            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">
                모임 소개 <span className="GatheringWrite_required_osk">*</span>
              </label>
              <div className="toast-editor-container">
                <div ref={editorRef} id="toast-editor"></div>
              </div>
              <div className="GatheringWrite_text-counter_osk">
                <span></span>
                <span>{(formData.content || "").length}/60000</span>
              </div>
            </div>
          </div>

          {/* 준비물 */}
          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">준비물</label>
              <textarea
                name="preparation"
                value={formData.preparation}
                onChange={handleInputChange}
                placeholder="준비물을 입력해 주세요"
                rows="4"
                className="GatheringWrite_custom-textarea-simple_osk"
              />
            </div>
          </div>

          {/* 태그 */}
          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">태그</label>
              <div className="GatheringWrite_tag-input-group_osk">
                <input
                  type="text"
                  name="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="태그를 입력하고 Enter 또는 쉼표 사용하여 등록하세요"
                  className="GatheringWrite_custom-input_osk GatheringWrite_tag-input_osk"
                />
                <CiHashtag className="GatheringWrite_tag-add-btn_osk" />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {formData.tags.map((tag, index) => (
                <span key={index} className="GatheringWrite_span-tag_osk" data-skill="tag">
                  {tag}
                  <button
                    className="GatheringWrite_delete-tag-btn_osk"
                    onClick={() => handleTagDelete(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">한 줄 소개</label>
              <input
                type="text"
                name="condition"
                value={formData.introduction}
                onChange={handleInputChange}
                placeholder="모임에 관련한 한 줄 소개글을 입력해주세요"
                className="GatheringWrite_custom-input_osk"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 우편번호 검색 모달 */}
      {isPostcodeOpen && (
        <div className="postcode-modal">
          <div className="postcode-modal-content">
            <div className="postcode-modal-header">
              <h3>주소 검색</h3>
              <button
                className="postcode-close-btn"
                onClick={() => setIsPostcodeOpen(false)}
              >
                ×
              </button>
            </div>
            <DaumPostcode
              onComplete={handlePostcodeComplete}
              autoClose={false}
              defaultQuery=""
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}