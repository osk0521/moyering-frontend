import React, { useState, useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../../atoms";
import { CiSearch, CiLocationOn, CiHashtag } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { SlPicture } from "react-icons/sl";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Editor } from "@toast-ui/editor";
import { url, myAxios } from "../../../config";
import getLatLngFromAddress from "../../../hooks/common/getLatLngFromAddress";
import DaumPostcode from "react-daum-postcode";
import "bootstrap/dist/css/bootstrap.min.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import Header from "../../common/Header";
import Footer from "../../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import "./GatheringWrite.css";

// 날짜 유틸
const getTodayString = () => new Date().toISOString().split("T")[0];
const getMinDeadlineDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 3);
  return now.toISOString().slice(0, 16);
};
const getMaxDeadlineDateTime = (meetingDate) =>
  meetingDate ? `${meetingDate}T23:59` : "";

const formatDateTimeLocal = (dateTimeString) => {
  if (!dateTimeString) return "";
  const date = new Date(dateTimeString.replace(" ", "T"));
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
};

export default function GatheringForm({ mode, initialData = null, onSubmit }) {
  const navigate = useNavigate();
  const { gatheringId } = useParams();
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  // 공통 상태
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
    latitude: 0,
    longitude: 0,
  });
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("initial");
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const editorRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (mode === "modify" && initialData) {
      setFormData(initialData);
      if (initialData.thumbnailFileName) {
        setPreviewUrl(`${url}/image?filename=${initialData.thumbnailFileName}`);
        setFileName(initialData.thumbnailFileName);
        setUploadStatus("success");
      }
    }
  }, [mode, initialData]);
  // 수정 모드 데이터 불러오기
  useEffect(() => {
    if (mode === "modify" && gatheringId && token) {
      myAxios(token, setToken)
        .get(`/user/detailForModifyGathering?gatheringId=${gatheringId}`)
        .then((res) => {
          if (!res.data) {
            alert("수정 권한이 없습니다.");
            navigate(-1);
            return;
          }
          const g = res.data;
          
          setFormData({
            title: g.title || "",
            startTime: g.startTime || "",
            endTime: g.endTime || "",
            category: g.categoryId?.toString() || "",
            subCategory: g.subCategoryId?.toString() || "",
            address: g.address || "",
            detailAddress: g.detailAddress || "",
            meetingDate: g.meetingDate || "",
            minAttendees: g.minAttendees || 2,
            maxAttendees: g.maxAttendees || "",
            deadlineDateTime: formatDateTimeLocal(g.applyDeadline) || "",
            content: g.gatheringContent || "",
            preparation: g.preparationItems || "",
            locName: g.locName || "",
            tags: g.tags ? JSON.parse(g.tags.replace(/'/g, '"')) : [],
            intrOnln: g.intrOnln || "",
            latitude: g.latitude || 0,
            longitude: g.longitude || 0,
          });
          if (g.thumbnailFileName) {
            setPreviewUrl(`${url}/image?filename=${g.thumbnailFileName}`);
            setFileName(g.thumbnailFileName);
            setUploadStatus("success");
          }
        });
    }
  }, [mode, gatheringId, token]);

  // 카테고리
  useEffect(() => {
    myAxios()
      .get(`/category`)
      .then((res) => setCategory(res.data.category || []));
  }, []);

  useEffect(() => {
    if (formData.category) {
      myAxios()
        .get(`/subCategory/${formData.category}`)
        .then((res) =>
          setSubCategory(
            res.data.subCategory.map((item) => ({
              subCategoryId: item.subCategoryId,
              subCategoryName: item.subCategoryName,
            }))
          )
        );
    } else {
      setSubCategory([]);
    }
  }, [formData.category]);

  // 주소 → 좌표
  useEffect(() => {
    if (!formData.address) return;
    getLatLngFromAddress(formData.address)
      .then((coords) =>
        setFormData((prev) => ({
          ...prev,
          latitude: coords.lat,
          longitude: coords.lng,
        }))
      )
      .catch(() =>
        setFormData((prev) => ({ ...prev, latitude: 0, longitude: 0 }))
      );
  }, [formData.address]);

  // 파일 업로드
  const handleFileUpload = (file) => {
    if (!file.type.startsWith("image/")) return alert("이미지 파일만 업로드 가능");
    setThumbnail(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    setFileName(file.name);
    setUploadStatus("success");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (/[^0-9]/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

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

  const handleTagDelete = (tag) =>
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  //Toast UI Editor 초기화
 useEffect(() => {
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
                const content = editorInstance.getHTML();
                setFormData((prev) => ({
                  ...prev,
                  content: content,
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
    const timer = setTimeout(initEditor, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [editor]);
  useEffect(() => {
    if (editor && formData.content) {
      try {
        // 에디터가 준비되었는지 확인
        if (typeof editor.setMarkdown === "function") {
          editor.setMarkdown(formData.content);
        }
      } catch (error) {
        console.error("에디터 내용 설정 실패:", error);
      }
    }
  }, [editor, formData.content]);
  const handlePostcodeComplete = (data) => {
    setFormData((prev) => ({
      ...prev,
      address: data.address,
    }));
    setIsPostcodeOpen(false);
  };

  // 제출
  const submit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.meetingDate || !formData.content) {
      return alert("필수 항목을 모두 입력해주세요.");
    }
    const formDataToSend = new FormData();
    if (mode === "modify") formDataToSend.append("gatheringId", gatheringId);
    if (thumbnail) formDataToSend.append("thumbnail", thumbnail);

    Object.entries(formData).forEach(([k, v]) => {
      if (k === "tags") {
        formDataToSend.append("tags", JSON.stringify(v));
      } else {
        formDataToSend.append(k, v);
      }
    });

    try {
      if (mode === "create") {
        const res = await myAxios(token).post(`/user/writeGathering`, formDataToSend);
        navigate(`/gatheringDetail/${res.data}`);
      } else {
        await myAxios(token).post(`/user/modifyGathering`, formDataToSend);
        navigate(`/gatheringDetail/${gatheringId}`);
      }
    } catch {
      alert("저장 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <Header />
      <form className="GatheringWrite_gathering-write-container_osk" onSubmit={submit}>
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
                className="GatheringWrite_upload-zone_osk"
                onClick={() => document.getElementById("thumbnailInput").click()}
              >
                {previewUrl ? (
                  <div className="GatheringWrite_preview-container_osk">
                    <img src={previewUrl} alt="preview" className="GatheringWrite_preview-image_osk" />
                    <div className="GatheringWrite_file-name_osk">{fileName}</div>
                  </div>
                ) : (
                  <div className="GatheringWrite_upload-placeholder_osk">
                    <FiUpload /> 이미지를 업로드하세요
                  </div>
                )}
              </div>
              <input
                type="file"
                id="thumbnailInput"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e.target.files[0])}
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
                  min={getTodayString()}
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
                    placeholder="주소를 입력해주세요"
                    
                    onClick={() => setIsPostcodeOpen(true)}
                    className="GatheringWrite_custom-input_osk"
                    readOnly
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsPostcodeOpen(true)}
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
          
        <div className="GatheringWrite_section_osk">
              <div className="GatheringWrite_form-group_osk">
                <label className="GatheringWrite_field-label_osk">태그</label>
                <div className="GatheringWrite_tag-input-group_osk">
                  <input
                    type="text"
                    name="tags"
                    value={tagInput}
                    onChange={handleTagInput}
                    onKeyDown={handleTagInput}
                    placeholder="태그를 입력하고 Enter 또는 쉼표 사용하여 등록하세요"
                    className="GatheringWrite_custom-input_osk GatheringWrite_tag-input_osk"
                  />
                </div>
              </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="GatheringWrite_tag-item_osk"
                  onClick={() => handleTagDelete(tag)}
                >
                  {/* <CiHashtag size={15}/> */}
                  # {tag} ✕
                </span>
              ))}
              </div>
            </div>
          </div>
          <div className="GatheringWrite_button-group_osk">
            <button type="submit" className="GatheringWrite_submit-btn_osk">
              {mode === "create" ? "모임 등록하기" : "모임 수정하기"}
            </button>
          </div>
        </div>
      </form>
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
      <Footer />
    </div>
  );
}
