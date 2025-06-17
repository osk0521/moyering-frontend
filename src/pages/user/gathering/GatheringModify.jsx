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
// import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import "./GatheringWrite.css";

export default function GatheringWrite() {
  //지오코딩용
  const [coordinates, setCoordinates] = useState({ x: "", y: "" });
  const [geocodingError, setGeocodingError] = useState("");
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const{gatheringId} = useParams();

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
    longitude: "", // 경도
    latitude: "", // 위도
    tags: [], // 문자열 배열로 변경
    intrOnln: "", // 한 줄 소개
    //----
    "gatheringId": 1,
    "title": "책과 함께하는 저녁",
    "userId": 1,
    "gatheringContent": "함께 독서하며 생각을 나누는 소규모 모임입니다.",
    "thumbnailFileName": "thumb1.jpg",
    "meetingDate": "2025-06-30",
    "startTime": "16:00",
    "endTime": "18:00",
    "address": "서울시 강남구",
    "detailAddress": "역삼동 123-45",
    "minAttendees": 2,
    "maxAttendees": 10,
    "applyDeadline": "2025-06-25",
    "preparationItems": "좋아하는 책 한 권",
    "tags": "독서,소모임",
    "createDate": "2025-06-15",
    "subCategoryId": 1,
    "latitude": 37.4979000,
    "longitude": 127.0276000,
    "intrOnln": "오프라인",
    "status": "모집중"
  });
  const [tagInput, setTagInput] = useState("");

  const convertAddressToCoordinates = async (address) => {
    if (!address || !address.trim()) {
      setGeocodingError("주소가 입력되지 않았습니다.");
      return null;
    }

    if (
      !KAKAO_REST_API_KEY ||
      KAKAO_REST_API_KEY === "YOUR_KAKAO_REST_API_KEY"
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
        // formData에 좌표 값 할당
        if (formData) {
          formData.latitude = result.y; // Y값(위도)을 latitude에 할당
          formData.longitude = result.x; // X값(경도)을 longitude에 할당
        }

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

  // 새로운 파일 업로드 처리 함수
  const handleFileUpload = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("파일 크기는 5MB를 초과할 수 없습니다.");
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

  // 폼 데이터 변경 시 콘솔에 출력
  useEffect(() => {
    console.group("📝 FormData 업데이트");
    console.log("제목:", formData.title);
    console.log("날짜:", formData.meetingDate);
    console.log("시간:", `${formData.startTime} ~ ${formData.endTime}`);
    console.log("카테고리:", `${formData.category2}`);
    console.log("주소:", ` ${formData.address}, ${formData.detailAddress}`);
    console.log("좌표:", `${formData.longitude}, ${formData.latitude}`);

    console.log("인원:", `${formData.minAttendees} ~ ${formData.maxAttendees}명`);
    console.log("태그:", formData.tags);
    console.log("썸네일:", formData.thumbnail);
    console.log("콘텐츠 길이:", formData.content);
    console.groupEnd();
  }, [formData]);

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

  const handlePostcodeComplete = async (data) => {
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

    // 주소 상태 업데이트
    setFormData((prev) => ({
      ...prev,
      address: fullAddress,
    }));

    // 주소를 좌표로 변환
    const coords = await convertAddressToCoordinates(fullAddress);
    if (coords) {
      console.log("변환된 좌표:", coords);
      // 좌표를 formData에 추가하거나 별도로 저장
      setFormData((prev) => ({
        ...prev,
        latitude: coords.y, // 위도
        longitude: coords.x, // 경도
      }));
    }

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
        console.log("1차 카테고리:", res);

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
   useEffect(()=> {
        axios.get(`${url}/detailGathering/?gatheringId=${gatheringId}`)
            .then(res=> {
              console.log('gathering :', res.data.gathering); 
              setFormData(res.data.gathering);
            })
            .catch(err=> {
                console.log(err)
            })
    },[]);
    

  // 2차 카테고리 데이터 가져오기
  useEffect(() => {
    if (formData.category1 && formData.category1 !== "") {
      axios
        .get(`${url}/category2/${formData.category1}`)
        .then((res) => {
          console.log("2차 카테고리 :", res);
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
const submit = (e) => {
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
  
  const gatheringData = new FormData();
  
  // 파일 추가 (thumbnail)
  if (thumbnail != null) {
    gatheringData.append("thumbnail", thumbnail);
  }
  
  // 기본 데이터 추가 (데이터 타입 주의)
  gatheringData.append('userId', 10); // 숫자로 직접 전달
  gatheringData.append("title", formData.title || '');
  gatheringData.append("meetingDate", formData.meetingDate || '');
  gatheringData.append("startTime", formData.startTime); 
  gatheringData.append("endTime", formData.endTime);
  
  // 숫자 필드는 숫자로 변환
  const subCategoryId = parseInt(formData.category2) || 0;
  gatheringData.append("subCategoryId", subCategoryId);
  
  gatheringData.append("address", formData.address || '');
  gatheringData.append("detailAddress", formData.detailAddress || '');
  
  // 좌표 데이터 추가 (BigDecimal 형식으로 정확히 전달)
  if (coordinates.x && coordinates.y) {
    // BigDecimal 정밀도에 맞게 소수점 7자리로 제한
    const lat = parseFloat(coordinates.y).toFixed(7);
    const lng = parseFloat(coordinates.x).toFixed(7);
    gatheringData.append("latitude", lat); // 위도
    gatheringData.append("longitude", lng); // 경도
  }
  
  // 인원수는 반드시 숫자로 (필드명 수정: DTO와 일치)
  const minPeople = parseInt(formData.minPeople) || 2; // 기본값 2 (엔티티 기본값과 일치)
  
  gatheringData.append("minAttendees", minPeople);  // DTO 필드명과 일치
  
  // maxAttendees는 null 허용이므로 빈 값일 때는 아예 전송하지 않음
  if (formData.maxPeople && formData.maxPeople.trim() !== '') {
    const maxPeople = parseInt(formData.maxPeople);
    if (!isNaN(maxPeople) && maxPeople > 0) {
      gatheringData.append("maxAttendees", maxPeople);
    }
  }
  // maxAttendees가 비어있으면 아예 FormData에 추가하지 않음 (null로 처리됨)
  
  gatheringData.append("applyDeadline", formData.deadline || '');
  gatheringData.append("gatheringContent", formData.content || '');
  gatheringData.append("preparationItems", formData.preparation || '');
  gatheringData.append("intrOnln", formData.intrOnln || 'N');
  gatheringData.append("status", "모집중");
  
  // tags 처리 - 배열이 비어있으면 빈 배열로
  const tagsToSend = formData.tags && formData.tags.length > 0 ? formData.tags : [];
  gatheringData.append("tags", JSON.stringify(tagsToSend));
  
  // FormData 내용 확인 (디버깅용)
  console.log('=== FormData 내용 ===');
  for (let [key, value] of gatheringData.entries()) {
    console.log(`${key}:`, value);
  }
  // axios 요청
  axios
    .post(`${url}/user/modifyGathering`, gatheringData, {
      headers: {
        'Content-Type': 'multipart/form-data', // FormData 사용시 필수
      },
      timeout: 10000, // 10초 타임아웃
    })
    .then((res) => {
      console.log('성공:', res);
      if (res.data && res.data.num) {
        // navigate(`/gatheringDetail/${res.data.num}`);
      } else {
        console.log('응답 데이터:', res.data);
      }
    })
    .catch((err) => {
      console.error('요청 실패:', err);
      
      // 상세한 에러 정보 출력
      if (err.response) {
        console.error('응답 상태:', err.response.status);
        console.error('응답 데이터:', err.response.data);
        console.error('응답 헤더:', err.response.headers);
      } else if (err.request) {
        console.error('요청이 전송되었지만 응답이 없음:', err.request);
        alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        console.error('요청 설정 오류:', err.message);
        alert('요청 처리 중 오류가 발생했습니다.');
      }
    });
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
                {uploadStatus === "success" || formData.thumbnailFileName ? (
                    // 업로드 성공 또는 기존 썸네일 파일이 있을 경우
                    <div className="GatheringWrite_preview-container_osk">
                      <img
                        src={uploadStatus === "success" ? previewUrl : `${url}/image?filename=${formData.thumbnailFileName}`}
                        alt="업로드된 이미지"
                        className="GatheringWrite_preview-image_osk"
                      />
                      <div className="GatheringWrite_file-name_osk">
                        {formData.fileName || formData.thumbnailFileName}
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
                      권장 크기: 1200 x 630px, 최대 5MB
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
                    <span className="GatheringWrite_required_osk">*</span>
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
                <CiHashtag className="GatheringWrite_tag-add-btn_osk" />
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
  );
}