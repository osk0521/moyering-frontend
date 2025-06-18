import { useState, useEffect, useRef } from "react";
import { Button } from "reactstrap";
import { CiSearch, CiLocationOn, CiHashtag } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { SlPicture } from "react-icons/sl";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Editor } from "@toast-ui/editor";
import axios from "axios";
import { url, KAKAO_REST_API_KEY } from "../../../config";
import DaumPostcode from "react-daum-postcode";
import "bootstrap/dist/css/bootstrap.min.css";
import "@toast-ui/editor/dist/toastui-editor.css";

import Header from '../../common/Header';
import { useNavigate } from "react-router-dom";
import "./GatheringWrite.css";

export default function GatheringWrite() {
  //지오코딩용
  const [coordinates, setCoordinates] = useState({ x: "", y: "" });
  const [geocodingError, setGeocodingError] = useState("");
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  // 새로 추가된 이미지 업로드 관련 상태들
  const [fileName, setFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(""); // 새로 추가
  const [errors, setErrors] = useState({});
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [category1, setCategory1] = useState([]);
  const [category2, setCategory2] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("initial");
  
  // 입력용 formData 상태 (사용자 입력을 받는 용도)
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    category1: "",
    category2: "",
    address: "",
    detailAddress: "",
    meetingDate: "",
    minAttendees: 2,
    maxAttendees: "",
    deadline: "",
    content: "",
    preparation: "",
    locName:"",
    tags: [], // 문자열 배열로 변경
    intrOnln: "", // 한 줄 소개
  });
  
  const [tagInput, setTagInput] = useState("");

  const convertAddressToCoordinates = async (address) => {
    if (!address || !address.trim()) {
      setGeocodingError("주소가 입력되지 않았습니다.");
      return null;
    }

    if (
      !KAKAO_REST_API_KEY ||
      KAKAO_REST_API_KEY === `${KAKAO_REST_API_KEY}`
    ) {
      setGeocodingError("카카오 REST API 키를 설정해주세요.");
      return null;
    }

    setGeocodingLoading(true);
    setGeocodingError("");

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
          address
        )}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const result = data.documents[0]; // 첫 번째 결과 사용
        const coords = {
          x: result.x, // 경도
          y: result.y, // 위도
        };
        setCoordinates(coords);
        setGeocodingError("");

        console.log("지오코딩 성공:", {
          address: result.address_name,
          coordinates: coords,
        });

        return coords;
      } else {
        setGeocodingError("주소를 찾을 수 없습니다. 주소를 다시 확인해주세요.");
        return null;
      }
    } catch (err) {
      console.error("지오코딩 오류:", err);
      if (err.message.includes("CORS")) {
        setGeocodingError(
          "CORS 오류가 발생했습니다. 프록시 서버를 통해 요청하거나 서버 사이드에서 API를 호출해주세요."
        );
      } else {
        setGeocodingError(
          "좌표 변환 중 오류가 발생했습니다. API 키를 확인하거나 네트워크 상태를 점검해주세요."
        );
      }
      return null;
    } finally {
      setGeocodingLoading(false);
    }
  };

  // 새로운 파일 업로드 처리 함수 (100MB 제한으로 변경)
  const handleFileUpload = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB로 변경
    if (file.size > maxSize) {
      alert("파일 크기는 100MB를 초과할 수 없습니다.");
      setUploadStatus("error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      setUploadStatus("error");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      // 새로운 미리보기 상태 설정
      setPreviewUrl(imageUrl);
      setFileName(file.name);
      setUploadStatus("success");
    };
    reader.readAsDataURL(file);
    setThumbnail(file);
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // 드래그 앤 드롭 핸들러 함수들
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // 업로드 존 클래스 결정 함수
  const getUploadZoneClass = () => {
    let baseClass = "GatheringWrite_upload-zone_osk";
    if (isDragOver) baseClass += " GatheringWrite_upload-zone-dragover_osk";
    if (uploadStatus === "success")
      baseClass += " GatheringWrite_upload-zone-success_osk";
    return baseClass;
  };

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

  const handleTagDelete = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };
  // 태그 삭제 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 방법 실시간 검증하되 경고만 표시
  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);

    // 빈 문자열은 허용
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    // 한글 체크
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(value)) {
      return;
    }

    if (name === "minAttendees") {
      if (numValue < 2) {
        setErrors((prev) => ({
          ...prev,
          minAttendees: "최소 인원은 2명 이상이어야 합니다",
        }));
      } else if (
        formData.maxAttendees &&
        numValue > parseInt(formData.maxAttendees)
      ) {
        setErrors((prev) => ({
          ...prev,
          minAttendees: "최소 인원은 최대 인원보다 클 수 없습니다",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          minAttendees: "",
        }));
      }
    }

    // 최대 인원 검증
    if (name === "maxAttendees") {
      if (formData.minAttendees && numValue < parseInt(formData.minAttendees)) {
        setErrors((prev) => ({
          ...prev,
          maxAttendees: "최대 인원은 최소 인원보다 작을 수 없습니다",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          maxAttendees: "",
        }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    // locName 추출: 주소에서 시/도 + 구/군/시 부분만 추출
    const addressParts = data.address.split(' ');
    let locName = "";
    
    if (addressParts.length >= 2) {
      // 첫 번째와 두 번째 요소를 조합 (예: "서울 강남구")
      locName = `${addressParts[0]} ${addressParts[1]}`;
    } else if (addressParts.length === 1) {
      // 주소가 한 단어만 있는 경우
      locName = addressParts[0];
    }

    // 주소 상태 업데이트 
    setFormData((prev) => ({
      ...prev,
      address: fullAddress,
      locName: locName, // locName 필드 추가
    }));

    setIsPostcodeOpen(false);
  };

  // 주소 검색 창 열기
  const openPostcode = () => {
    setIsPostcodeOpen(true);
  };

  // 1차 카테고리 데이터 가져오기
  useEffect(() => {
    axios
      .get(`${url}/category1`)
      .then((res) => {
        console.log("1차 카테고리 API 응답:", res);

        // res.data.category1 배열을 category1 상태에 저장
        const categoryArray = res.data.category1;
        setCategory1(categoryArray);
        if (categoryArray.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category1: categoryArray[0].categoryId.toString(),
          }));
        }
      })
      .catch((err) => {
        console.log("API 오류:", err);
      });
  }, []);

  // 2차 카테고리 데이터 가져오기
  useEffect(() => {
    if (formData.category1 && formData.category1 !== "") {
      axios
        .get(`${url}/category2/${formData.category1}`)
        .then((res) => {
          console.log("2차 카테고리 API 응답:", res);
          const categoryArray = res.data.category2.map((item) => ({
            subCategoryId: item.subCategoryId,
            subCategoryName: item.subCategoryName,
          }));
          setCategory2(categoryArray);
          if (categoryArray.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category2: categoryArray[0].subCategoryId.toString(),
            }));
          }
        })
        .catch((err) => {
          console.log("2차 카테고리 API 오류:", err);
        });
    } else {
      // 1차 카테고리가 선택되지 않으면 2차 카테고리 초기화
      setCategory2([]);
      setFormData((prev) => ({
        ...prev,
        category2: "",
      }));
    }
  }, [formData.category1]);

  // DOM이 완전히 렌더링된 후 에디터 초기화
  useEffect(() => {
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

  const submit = async (e) => {
  e.preventDefault();
  
  // 시간 순서 검증
  if (formData.startTime >= formData.endTime) {
    alert('종료 시간은 시작 시간보다 늦어야 합니다.');
    return;
  }
  
  // 신청 마감일 검증
  if (formData.deadline && formData.meetingDate && formData.deadline > formData.meetingDate) {
    alert('신청 마감일은 모임 날짜보다 이전이어야 합니다.');
    return;
  }

  // 지오코딩 실행 (주소를 좌표로 변환)
  console.log("지오코딩 시작...");
  const coords = await convertAddressToCoordinates(formData.address);
  
  if (!coords) {
    alert('주소를 좌표로 변환하는데 실패했습니다. 주소를 확인해주세요.');
    return;
  }

  // formData를 최종 데이터로 변환 (좌표 추가)
  const finalGatheringData = {
    ...formData,
    latitude: parseFloat(coords.y), // 위도
    longitude: parseFloat(coords.x), // 경도
    categoryId: parseInt(formData.category1) || 0,
    subCategoryId: parseInt(formData.category2) || 0,
    userId: 10,
    status: "모집중"
  };
  console.log("최종 데이터:", finalGatheringData);

  // FormData 객체 생성 (변수명 변경으로 충돌 방지)
  const formDataToSend = new FormData();
  
  // 파일 추가 (thumbnail)
  if (thumbnail != null) {
    formDataToSend.append("thumbnail", thumbnail);
  }
  
  // 기본 데이터 추가
  formDataToSend.append('userId', 1);
  formDataToSend.append("title", finalGatheringData.title || '');
  formDataToSend.append("meetingDate", finalGatheringData.meetingDate || '');
  formDataToSend.append("startTime", finalGatheringData.startTime); 
  formDataToSend.append("endTime", finalGatheringData.endTime);
  
  // 숫자 필드
  formDataToSend.append("categoryId", finalGatheringData.categoryId);
  formDataToSend.append("subCategoryId", finalGatheringData.subCategoryId);
  
  formDataToSend.append("address", finalGatheringData.address || '');
  formDataToSend.append("detailAddress", finalGatheringData.detailAddress || '');
  formDataToSend.append("locName", finalGatheringData.locName || '');
  
  // 좌표 데이터 추가
  if (coords.x && coords.y) {
    const lat = parseFloat(coords.y).toFixed(7);
    const lng = parseFloat(coords.x).toFixed(7);
    formDataToSend.append("latitude", lat);
    formDataToSend.append("longitude", lng);
  }
  
  // 인원수
  const minPeople = parseInt(finalGatheringData.minAttendees) || 2;
  formDataToSend.append("minAttendees", minPeople);
  
  // maxAttendees 처리
  if (finalGatheringData.maxAttendees && finalGatheringData.maxAttendees.toString().trim() !== '') {
    const maxPeople = parseInt(finalGatheringData.maxAttendees);
    if (!isNaN(maxPeople) && maxPeople > 0) {
      formDataToSend.append("maxAttendees", maxPeople);
    }
  }
  
  formDataToSend.append("applyDeadline", finalGatheringData.deadline || '');
  formDataToSend.append("gatheringContent", finalGatheringData.content || '');
  formDataToSend.append("preparationItems", finalGatheringData.preparation || '');
  formDataToSend.append("intrOnln", finalGatheringData.intrOnln || 'N');
  formDataToSend.append("status", "모집중");
  
  // tags 처리
  const tagsToSend = finalGatheringData.tags && finalGatheringData.tags.length > 0 ? finalGatheringData.tags : [];
  formDataToSend.append("tags", JSON.stringify(tagsToSend));
  
  // FormData 내용 확인 (디버깅용)
  console.log('=== FormData 내용 ===');
  for (let [key, value] of formDataToSend.entries()) {
    console.log(`${key}:`, value);
  }
  
  // axios 요청
  try {
    const response = await axios.post(`${url}/user/writeGathering`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000,
    });
    
    console.log('성공:', response);
    if (response.data && response.data.num) {
      // navigate(`/gatheringDetail/${response.data.num}`);
    } else {
      console.log('응답 데이터:', response.data);
    }
  } catch (err) {
    console.error('요청 실패:', err);
    
    if (err.response) {
      console.error('응답 상태:', err.response.status);
      console.error('응답 데이터:', err.response.data);
    } else if (err.request) {
      console.error('요청이 전송되었지만 응답이 없음:', err.request);
      alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      console.error('요청 설정 오류:', err.message);
      alert('요청 처리 중 오류가 발생했습니다.');
    }
  }
};
  
  return (
   <div>
    <Header/>
     <div className="GatheringWrite_gathering-write-container_osk">
      <div className="GatheringWrite_content-wrapper_osk">
        <div>
          {/* 기본 정보 */}
          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_section-header_osk">
              <span className="GatheringWrite_section-icon_osk">
                <HiOutlineInformationCircle />
              </span>
              <span className="GatheringWrite_section-title_osk">
                기본 정보
              </span>
            </div>
            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">
                <span className="GatheringWrite_section-icon_osk">
                  <SlPicture />
                </span>
                대표 이미지{" "}
                <span className="GatheringWrite_required_osk">*</span>
              </label>

              {/* 업로드 존 - 이미지가 이 div 내부에 완전히 배치됩니다 */}
              <div
                className={getUploadZoneClass()}
                onClick={() =>
                  document
                    .getElementById("GatheringWrite_thumbnail_osk")
                    .click()
                }
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadStatus === "success" ? (
                  // 업로드 성공 시: 이미지가 업로드 존 전체를 채움
                  <div className="GatheringWrite_preview-container_osk">
                    <img
                      src={previewUrl}
                      alt="업로드된 이미지"
                      className="GatheringWrite_preview-image_osk"
                    />
                    {/* 파일명 표시 */}
                    <div className="GatheringWrite_file-name_osk">
                      {fileName}
                    </div>
                  </div>
                ) : (
                  // 기본 상태: 업로드 대기 UI
                  <>
                    <div className="GatheringWrite_upload-icon_osk">
                      <FiUpload />
                    </div>
                    <div className="GatheringWrite_upload-text_osk">
                      이미지를 드래그하거나 클릭하여 업로드하세요
                    </div>
                    <div className="GatheringWrite_upload-info_osk">
                      권장 크기: 1200 x 630px, 최대 100MB
                    </div>
                  </>
                )}
              </div>

              {/* 숨겨진 파일 입력 */}
              <input
                type="file"
                name="GatheringWrite_thumbnail_osk"
                id="GatheringWrite_thumbnail_osk"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
                accept="image/*"
                required
              />
            </div>
            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">
                모임 이름 <span className="GatheringWrite_required_osk">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="모임 이름을 입력해주세요"
                className="GatheringWrite_custom-input_osk"
                required
              />
            </div>

            <div className="GatheringWrite_row_osk">
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    모임 날짜{" "}
                    <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.meetingDate}
                    onChange={handleInputChange}
                    className="GatheringWrite_custom-input_osk GatheringWrite_date-input-container_osk"
                    name="meetingDate"
                    required
                    placeholder="모임 날짜 입력"
                  />
                </div>
              </div>
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    모임 시간{" "}
                    <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <div className="GatheringWrite_time-input-group_osk">
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      placeholder="시작 시간 입력"
                      className="GatheringWrite_custom-input_osk GatheringWrite_time-input_osk"
                      required
                    />
                    <span className="GatheringWrite_time-separator_osk">~</span>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      placeholder="종료 시간 입력"
                      className="GatheringWrite_custom-input_osk GatheringWrite_time-input_osk"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="GatheringWrite_row_osk">
              {/* 1차 카테고리 */}
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    1차 카테고리{" "}
                    <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <select
                    name="category1"
                    value={formData.category1}
                    onChange={handleInputChange}
                    className="GatheringWrite_custom-input_osk"
                  >
                    <option value="">1차 카테고리를 선택해주세요</option>
                    {Array.isArray(category1) &&
                      category1.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId.toString()}
                        >
                          {category.categoryName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    2차 카테고리{" "}
                    <span className="GatheringWrite_required_osk">*</span>
                  </label>
                  <select
                    name="category2"
                    value={formData.category2}
                    onChange={handleInputChange}
                    className="GatheringWrite_custom-input_osk"
                    disabled={!formData.category1} // 1차 카테고리가 선택되지 않으면 비활성화
                    required
                  >
                    <option value="">2차 카테고리를 선택해주세요</option>
                    {Array.isArray(category2) &&
                      category2
                        .filter(
                          (category) =>
                            category.subCategoryId && category.subCategoryName
                        ) // 유효한 데이터만 필터링
                        .map((category) => (
                          <option
                            key={category.subCategoryId}
                            value={category.subCategoryId.toString()}
                          >
                            {category.subCategoryName}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 모임 장소 */}
          <div className="GatheringWrite_section_osk=">
            <div className="GatheringWrite_section-header_osk">
              <span className="GatheringWrite_section-icon_osk">
                <CiLocationOn />
              </span>
              <span className="GatheringWrite_section-title_osk">
                모임 장소
                <span className="GatheringWrite_required_osk">*</span>
              </span>
            </div>

            <div className="GatheringWrite_form-group_osk">
              <div className="GatheringWrite_location-section_osk">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onClick={openPostcode}
                  placeholder="주소를 입력해주세요"
                  className="GatheringWrite_custom-input_osk"
                  readOnly
                  required
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
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleInputChange}
                placeholder="상세 주소를 입력해주세요"
                className="GatheringWrite_custom-input_osk"
                required
              />
            </div>
          </div>

          {/* 참여 정보 */}
          <div className="GatheringWrite_section_osk">
            <div className="GatheringWrite_section-header_osk">
              <span className="GatheringWrite_section-icon_osk">
                <GoPeople />
              </span>
              <span className="GatheringWrite_section-title_osk">
                참여 정보
              </span>
            </div>

            <div className="GatheringWrite_row_osk">
              {/* 최소 인원 입력 부분 */}
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    최소 인원{" "}
                    <span className="GatheringWrite_required_osk">*</span>
                    {errors.minAttendees && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginLeft: "8px",
                        }}
                      >
                        {errors.minAttendees}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="minAttendees"
                    value={formData.minAttendees}
                    onChange={handleNumberInput}
                    placeholder="최소 인원 (2 이상)"
                    className="GatheringWrite_custom-input_osk"
                    required
                  />
                </div>
              </div>
              {/* 최대 인원 입력 부분 */}
              <div className="GatheringWrite_col-md-6_osk">
                <div className="GatheringWrite_form-group_osk">
                  <label className="GatheringWrite_field-label_osk">
                    최대 인원{" "}
                    {errors.maxAttendees && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginLeft: "8px",
                        }}
                      >
                        {errors.maxAttendees}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleNumberInput}
                    placeholder="최대 인원 (2 이상)"
                    className="GatheringWrite_custom-input_osk"
                  />
                </div>
              </div>
            </div>

            <div className="GatheringWrite_form-group_osk">
              <label className="GatheringWrite_field-label_osk">
                신청 마감일{" "}
                {/* <span className="GatheringWrite_required_osk">*</span> */}
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
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
              <span className="GatheringWrite_section-title_osk">
                모임 상세 정보
              </span>
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
                {/* <CiHashtag className="GatheringWrite_tag-add-btn_osk" /> */}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="GatheringWrite_span-tag_osk"
                  data-skill="tag"
                >
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
              <label className="GatheringWrite_field-label_osk">
                한 줄 소개
              </label>
              <input
                type="text"
                name="intrOnln"
                value={formData.intrOnln}
                onChange={handleInputChange}
                placeholder="모임에 관련한 한 줄 소개글을 입력해주세요"
                className="GatheringWrite_custom-input_osk"
              />
            </div>
          </div>

          <div className="GatheringWrite_button-group_osk">
            <Button onClick={submit} className="GatheringWrite_submit-btn_osk">
              모임 등록
            </Button>
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
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
   </div>
  );
}