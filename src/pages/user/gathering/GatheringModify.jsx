import React, { useState, useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../../atoms";
import { Button } from "reactstrap";
import { CiSearch, CiLocationOn, CiHashtag } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { SlPicture } from "react-icons/sl";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Editor } from "@toast-ui/editor";
import { url, myAxios } from "../../../config";
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_JavaScript_API_KEY = import.meta.env.KAKAO_JavaScript_API_KEY;
import DaumPostcode from "react-daum-postcode";
import "bootstrap/dist/css/bootstrap.min.css";
import getLatLngFromAddress from '../../../hooks/common/getLatLngFromAddress';
import "@toast-ui/editor/dist/toastui-editor.css";
import Header from "../../common/Header";
import { useNavigate, useParams } from "react-router-dom";
import "./GatheringWrite.css";

// 유틸리티 함수들
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getMinDeadlineDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 3);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getMaxDeadlineDateTime = (meetingDate) => {
  if (!meetingDate) return "";
  return `${meetingDate}T23:59`;
};

// datetime-local 형식으로 변환하는 함수
const formatDateTimeLocal = (dateTimeString) => {
  if (!dateTimeString) return "";
  
  try {
    let date;
    
    if (dateTimeString.includes("T") && dateTimeString.includes("+")) {
      // ISO 8601 UTC 형식인 경우 (예: "2025-06-24T05:38:00.000+00:00")
      date = new Date(dateTimeString);
    } else if (dateTimeString.includes("T")) {
      // 이미 ISO 형식인 경우
      date = new Date(dateTimeString);
    } else {
      // "YYYY-MM-DD HH:mm:ss" 형식인 경우
      date = new Date(dateTimeString.replace(" ", "T"));
    }
    
    // 한국 시간으로 변환 (UTC+9)
    const koreanTime = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    
    // datetime-local 형식으로 변환 (YYYY-MM-DDTHH:mm)
    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, "0");
    const day = String(koreanTime.getDate()).padStart(2, "0");
    const hours = String(koreanTime.getHours()).padStart(2, "0");
    const minutes = String(koreanTime.getMinutes()).padStart(2, "0");
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error("날짜 변환 오류:", error);
    return "";
  }
};

export default function GatheringModify() {
  const navigate = useNavigate();
  const { gatheringId } = useParams();

  const user = useAtomValue(userAtom);    
  const token = useAtomValue(tokenAtom);
  const userId = user.id;
  // 지오코딩용
  const [coordinates, setCoordinates] = useState({ x: "", y: "" });
  const [geocodingError, setGeocodingError] = useState("");
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  // 이미지 업로드 관련 상태들
  const [fileName, setFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("initial");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    category: "",
    subCategory: "",
    address: "",
    detailAddress: "",
    meetingDate: "",
    minAttendees: 2,
    maxAttendees: "",
    deadlineDateTime: "",
    content: "",
    preparation: "",
    locName: "",
    tags: [],
    intrOnln: "",
  });
  useEffect(() => {
    if (!formData.address) return;

    console.log("지오코딩 시작 - 주소:", formData.address);
    
    getLatLngFromAddress(formData.address)
      .then(coords => {
        if (coords) {
          console.log("지오코딩 성공:");
          console.log("위도:", coords.lat);
          console.log("경도:", coords.lng);
          
          setCoordLat(coords.lat);
          setCoordLng(coords.lng);

          setFormData(prev => ({
            ...prev,
            latitude: coords.lat,
            longitude: coords.lng
          }));
        }
      })
      .catch(err => {
        console.error("좌표변환 실패:", err);
        setCoordLat('');
        setCoordLng('');
        setFormData(prev => ({
          ...prev,
          latitude: 0,
          longitude: 0
        }));
      });
  }, [formData.address]);
  useEffect(() => {
    if (gatheringId && token) {
      console.log('전달하는 토큰:', token); // 이 값이 실제로 무엇인지
      myAxios(token).get(`/user/detailForModifyGathering?gatheringId=${gatheringId}`)
        .then((res) => {
          console.log("API Response:", res.data);
          if (res.data === null) {
            alert("해당 게더링의 작성자만 수정 할 수 있습니다.");
            history.back();
            return;
          }
          const gathering = res.data;
          console.log(gathering);
          // tags 필드 파싱
          let parsedTags = [];
          if (gathering.tags && typeof gathering.tags === "string") {
            try {
              const validJsonString = gathering.tags.replace(/'/g, '"');
              parsedTags = JSON.parse(validJsonString);
            } catch (error) {
              console.error("Tags 파싱 오류:", error);
              parsedTags = [];
            }
          }
          setFormData({
            title: gathering.title || "",
            startTime: gathering.startTime || "",
            endTime: gathering.endTime || "",
            category: gathering.categoryId?.toString() || "",
            subCategory: gathering.subCategoryId?.toString() || "",
            address: gathering.address || "",
            detailAddress: gathering.detailAddress || "",
            meetingDate: gathering.meetingDate || "",
            minAttendees: gathering.minAttendees || 2,
            maxAttendees: gathering.maxAttendees || "",
            deadlineDateTime: formatDateTimeLocal(gathering.applyDeadline) || "",
            content: gathering.gatheringContent || "",
            preparation: gathering.preparationItems || "",
            locName: gathering.locName || "",
            tags: parsedTags,
            intrOnln: gathering.intrOnln || "",
            latitude: gathering.latitude || 0,   
            longitude: gathering.longitude || 0,
          });



          // 기존 썸네일 이미지 설정
          if (gathering.thumbnailFileName) {
            setPreviewUrl(
              `${url}/image?filename=${gathering.thumbnailFileName}`
            );
            setFileName(gathering.thumbnailFileName);
            setUploadStatus("success");
          }
          // 좌표 설정
          setCoordinates({
            x: gathering.longitude || "",
            y: gathering.latitude || "",
          });

          setIsDataLoaded(true);
        })
        .catch((err) => {
          if (err.response) {
            console.log("데이터 로딩 오류:", err);
            if (err.response.status === 404) {
                alert("존재하지 않는 게더링입니다.");
            }
          }
        });
    }
  }, [gatheringId, token]);
  const [tagInput, setTagInput] = useState("");

  // 파일 업로드 처리
  const handleFileUpload = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
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

  // 드래그 앤 드롭 핸들러들
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

  const getUploadZoneClass = () => {
    let baseClass = "GatheringWrite_upload-zone_osk";
    if (isDragOver) baseClass += " GatheringWrite_upload-zone-dragover_osk";
    if (uploadStatus === "success")
      baseClass += " GatheringWrite_upload-zone-success_osk";
    return baseClass;
  };

  // 태그 입력 처리
  const handleTagInput = (e) => {
    const value = e.target.value;

    if (e.key === "Enter" || value.includes(",")) {
      e.preventDefault();

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

  // 입력 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 숫자 입력 처리
  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);

    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

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

  // 주소 검색 완료 처리
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

    // locName 추출
    const addressParts = data.address.split(" ");
    let locName = "";
    if (addressParts.length >= 2) {
      locName = `${addressParts[0]} ${addressParts[1]}`;
    } else if (addressParts.length === 1) {
      locName = addressParts[0];
    }

    setCoordinates({ x: "", y: "" });
    setFormData((prev) => ({
      ...prev,
      address: fullAddress,
      locName: locName,
    }));

    setIsPostcodeOpen(false);
  };

  const openPostcode = () => {
    setIsPostcodeOpen(true);
  };

  // 1차 카테고리 데이터 가져오기
  useEffect(() => {
    myAxios()
      .get(`/category`)
      .then((res) => {
        const categoryArray = res.data.category;
        setCategory(categoryArray);
      })
      .catch((err) => {
        console.log("API 오류:", err);
      });
  }, []);
  // 2차 카테고리 데이터 가져오기
  useEffect(() => {
    if (formData.category && formData.category !== "") {
      myAxios()
        .get(`/subCategory/${formData.category}`)
        .then((res) => {
          const categoryArray = res.data.subCategory.map((item) => ({
            subCategoryId: item.subCategoryId,
            subCategoryName: item.subCategoryName,
          }));
          setSubCategory(categoryArray);
        })
        .catch((err) => {
          console.log("2차 카테고리 API 오류:", err);
        });
    } else {
      setSubCategory([]);
      setFormData((prev) => ({
        ...prev,
        subCategory: "",
      }));
    }
  }, [formData.category]);

  // 에디터 초기화
  useEffect(() => {
    // 에디터가 이미 존재하거나 DOM 요소가 없으면 초기화하지 않음
    if (editor || !editorRef.current) return;

    const initEditor = () => {
      try {
        const editorInstance = new Editor({
          el: editorRef.current,
          height: "400px",
          initialEditType: "wysiwyg",
          placeholder: "모임에 대한 상세한 설명을 작성해주세요",
          hideModeSwitch: true,
          previewStyle: "vertical",
          initialValue: "",
          toolbarItems: [
            ["heading", "bold", "italic", "strike"],
            ["hr", "quote"],
            ["ul", "ol"],
            ["table", "link"],
            ["image"],
          ],
          theme: "default",
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
              try {
                // 에디터 입력 중에는 trim하지 않고 원본 내용 그대로 저장
                const content = editorInstance.getMarkdown();
                setFormData((prev) => ({
                  ...prev,
                  content: content, // trim() 제거됨
                }));
              } catch (err) {
                console.error("에디터 내용 변경 처리 오류:", err);
              }
            },
            load: () => {
              console.log("Editor 초기화 완료");
            },
          },
        });
        setEditor(editorInstance);
      } catch (error) {
        console.error("TOAST UI Editor 초기화 실패:", error);
      }
    };

    // DOM이 완전히 렌더링된 후 에디터 초기화
    const timer = setTimeout(initEditor, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [editor]); // editor 의존성만 추가

  // 컴포넌트 언마운트 시 에디터 정리
  useEffect(() => {
    return () => {
      if (editor) {
        try {
          editor.destroy();
        } catch (error) {
          console.error("Editor cleanup 에러:", error);
        }
      }
    };
  }, [editor]);

  // 에디터 내용 업데이트 (데이터 로딩 후)
  useEffect(() => {
    if (editor && isDataLoaded && formData.content) {
      try {
        // 에디터가 준비되었는지 확인
        if (typeof editor.setMarkdown === "function") {
          editor.setMarkdown(formData.content);
        }
      } catch (error) {
        console.error("에디터 내용 설정 실패:", error);
      }
    }
  }, [editor, isDataLoaded, formData.content]);

  // 수정 제출 처리
  const submit = async (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (
      !formData.title ||
      !formData.meetingDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.category ||
      !formData.subCategory ||
      !formData.address ||
      !formData.content
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 시간 검증
    if (formData.startTime >= formData.endTime) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    // 지오코딩 실행 (주소가 변경된 경우에만)
   let coords = coordinates;
  
  // 1) formData에 이미 좌표가 있으면 사용 (실시간 지오코딩 결과)
  if (formData.latitude && formData.longitude && 
      formData.latitude !== 0 && formData.longitude !== 0) {
    coords = {
      x: formData.longitude,
      y: formData.latitude
    };
    console.log("formData에서 좌표 사용:", coords);
  }
  // 2) coordinates 상태에 좌표가 있으면 사용 (기존 방식)
  else if (coordinates.x && coordinates.y) {
    coords = coordinates;
    console.log("coordinates 상태에서 좌표 사용:", coords);
  }
  else {
      alert("주소를 좌표로 변환하는데 실패했습니다. 주소를 확인해주세요.");
      return;
    }


    // FormData 객체 생성
    const formDataToSend = new FormData();

    // 모임 ID 추가
    formDataToSend.append("gatheringId", gatheringId);

    // 파일 추가 (새로운 썸네일이 있는 경우만)
    if (thumbnail) {
      formDataToSend.append("thumbnail", thumbnail);
    } else {
      formDataToSend.append("thumbnail", formData.thumbnail);
    }

    // 기본 데이터 추가
    formDataToSend.append("title", formData.title);
    formDataToSend.append("meetingDate", formData.meetingDate);
    formDataToSend.append("startTime", formData.startTime);
    formDataToSend.append("endTime", formData.endTime);

    // 카테고리 정보
    formDataToSend.append("categoryId", parseInt(formData.category));
    formDataToSend.append("subCategoryId", parseInt(formData.subCategory));

    // 주소 정보
    formDataToSend.append("address", formData.address);
    formDataToSend.append("detailAddress", formData.detailAddress || "");
    formDataToSend.append("locName", formData.locName || "");

    // 좌표 데이터 추가
    formDataToSend.append("latitude", parseFloat(coords.y).toFixed(7));
    formDataToSend.append("longitude", parseFloat(coords.x).toFixed(7));

    // 인원수 정보
    formDataToSend.append("minAttendees", parseInt(formData.minAttendees) || 2);

    if (
      formData.maxAttendees &&
      formData.maxAttendees.toString().trim() !== ""
    ) {
      const maxPeople = parseInt(formData.maxAttendees);
      if (!isNaN(maxPeople) && maxPeople > 0) {
        formDataToSend.append("maxAttendees", maxPeople);
      }
    }

    // 신청 마감일
    if (formData.deadlineDateTime) {
      formDataToSend.append(
        "applyDeadline",
        formData.deadlineDateTime.replace("T", " ") + ":00"
      );
    }

    // 모임 내용 및 준비물
    formDataToSend.append("gatheringContent", formData.content.trim());
    formDataToSend.append("preparationItems", formData.preparation || "");

    // 한 줄 소개
    formDataToSend.append("intrOnln", formData.intrOnln || "");

    // 태그 처리
    const tagsToSend =
      formData.tags && formData.tags.length > 0 ? formData.tags : [];
    formDataToSend.append("tags", JSON.stringify(tagsToSend));

    // FormData 내용 확인
    console.log("=== FormData 내용 ===");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    // axios 요청
  try {
    console.log("모임 수정 요청 시작...");
    const response = await myAxios(token).post(`/user/modifyGathering`, formDataToSend);
    console.log("모임 수정 성공:", response);
    alert("모임이 성공적으로 수정되었습니다!");
    navigate(`/gatheringDetail/${gatheringId}`);
  } catch (err) {
    console.error("모임 수정 실패:", err);
  }
};


  return (
    <div>
      <Header />
      <form
        className="GatheringWrite_gathering-write-container_osk"
        onSubmit={submit}
      >
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
                  {uploadStatus === "success" || previewUrl ? (
                    <div className="GatheringWrite_preview-container_osk">
                      <img
                        src={previewUrl}
                        alt="업로드된 이미지"
                        className="GatheringWrite_preview-image_osk"
                      />
                      <div className="GatheringWrite_file-name_osk">
                        {fileName}
                      </div>
                    </div>
                  ) : (
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

                <input
                  type="file"
                  name="GatheringWrite_thumbnail_osk"
                  id="GatheringWrite_thumbnail_osk"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                  accept="image/*"
                />
              </div>

              <div className="GatheringWrite_form-group_osk">
                <label className="GatheringWrite_field-label_osk">
                  모임 이름{" "}
                  <span className="GatheringWrite_required_osk">*</span>
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
                      min={getTodayString()}
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
                      <span className="GatheringWrite_time-separator_osk">
                        ~
                      </span>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        placeholder="종료 시간 입력"
                        className="GatheringWrite_custom-input_osk GatheringWrite_time-input_osk"
                        required
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
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="GatheringWrite_custom-input_osk"
                      required
                    >
                      <option value="">1차 카테고리를 선택해주세요</option>
                      {Array.isArray(category) &&
                        category.map((cat) => (
                          <option
                            key={cat.categoryId}
                            value={cat.categoryId.toString()}
                          >
                            {cat.categoryName}
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
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      className="GatheringWrite_custom-input_osk"
                      disabled={!formData.category}
                      required
                    >
                      <option value="">2차 카테고리를 선택해주세요</option>
                      {Array.isArray(subCategory) &&
                        subCategory
                          .filter(
                            (item) => item.subCategoryId && item.subCategoryName
                          )
                          .map((item) => (
                            <option
                              key={item.subCategoryId}
                              value={item.subCategoryId.toString()}
                            >
                              {item.subCategoryName}
                            </option>
                          ))}
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
                  <span className="GatheringWrite_required_osk">*</span>
                  {errors.deadlineDateTime && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginLeft: "8px",
                      }}
                    >
                      {errors.deadlineDateTime}
                    </span>
                  )}
                </label>
                <input
                  type="datetime-local"
                  name="deadlineDateTime"
                  value={formData.deadlineDateTime}
                  onChange={handleInputChange}
                  className="GatheringWrite_custom-input_osk"
                  min={getMinDeadlineDateTime()}
                  max={getMaxDeadlineDateTime(formData.meetingDate)}
                  required
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
                  모임 소개{" "}
                  <span className="GatheringWrite_required_osk">*</span>
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
                      type="button"
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
              <input
                type="submit"
                className="GatheringWrite_submit-btn_osk"
                value="모임 수정"
              />
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
      </form>
    </div>
  );
}