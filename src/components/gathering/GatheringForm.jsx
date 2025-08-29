// GatheringForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { SlPicture } from "react-icons/sl";
import { Editor } from "@toast-ui/editor";
import DaumPostcode from "react-daum-postcode";
import getLatLngFromAddress from '../../hooks/common/getLatLngFromAddress.js';
import { myAxios, url } from '../../config.jsx';
import "@toast-ui/editor/dist/toastui-editor.css";
import "bootstrap/dist/css/bootstrap.min.css";

const getTodayString = () => new Date().toISOString().split("T")[0];

const getMinDeadlineDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 3);
  return now.toISOString().slice(0, 16);
};

const getMaxDeadlineDateTime = (meetingDate) => {
  if (!meetingDate) return "";
  return `${meetingDate}T23:59`;
};

export default function GatheringForm({
  mode = "create",
  initialData = null,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    title: "",
    meetingDate: "",
    startTime: "",
    endTime: "",
    category: "",
    subCategory: "",
    address: "",
    detailAddress: "",
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

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  // 이미지 업로드
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("initial");
  const [isDragOver, setIsDragOver] = useState(false);

  // 카테고리
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // 초기 데이터 세팅
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

  // 카테고리 API 호출
  useEffect(() => {
    myAxios()
      .get(`/category`)
      .then((res) => setCategory(res.data.category))
      .catch(() => {});
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
        )
        .catch(() => {});
    } else {
      setSubCategory([]);
      setFormData((prev) => ({ ...prev, subCategory: "" }));
    }
  }, [formData.category]);

  // 주소 → 좌표 변환
  useEffect(() => {
    if (!formData.address) return;
    getLatLngFromAddress(formData.address)
      .then((coords) => {
        if (coords) {
          setFormData((prev) => ({
            ...prev,
            latitude: coords.lat,
            longitude: coords.lng,
          }));
        }
      })
      .catch(() =>
        setFormData((prev) => ({ ...prev, latitude: 0, longitude: 0 }))
      );
  }, [formData.address]);

  // 에디터 초기화
  useEffect(() => {
    if (!editorRef.current || editor) return;
    const instance = new Editor({
      el: editorRef.current,
      height: "400px",
      initialEditType: "wysiwyg",
      placeholder: "모임에 대한 상세한 설명을 작성해주세요",
      hideModeSwitch: true,
      previewStyle: "vertical",
      initialValue: initialData?.content || "",
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol"],
        ["table", "link"],
        ["image"],
      ],
      hooks: {
        addImageBlobHook: (blob, callback) => {
          const reader = new FileReader();
          reader.onload = (e) => callback(e.target.result, blob.name);
          reader.readAsDataURL(blob);
        },
      },
      events: {
        change: () => {
          setFormData((prev) => ({ ...prev, content: instance.getHTML() }));
        },
      },
    });
    setEditor(instance);
    return () => instance.destroy();
  }, [editorRef.current]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (e.key === "Enter" || value.includes(",")) {
      e.preventDefault();
      const tags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      setFormData((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, ...tags])],
      }));
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const handleTagDelete = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // 이미지 업로드
  const handleFileUpload = (file) => {
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize || !file.type.startsWith("image/")) {
      alert("이미지 파일(최대 100MB)만 업로드 가능합니다.");
      setUploadStatus("error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setFileName(file.name);
      setUploadStatus("success");
    };
    reader.readAsDataURL(file);
    setThumbnail(file);
  };
  const handleFileInputChange = (e) =>
    e.target.files?.[0] && handleFileUpload(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  const getUploadZoneClass = () => {
    let base = "GatheringWrite_upload-zone_osk";
    if (isDragOver) base += " GatheringWrite_upload-zone-dragover_osk";
    if (uploadStatus === "success")
      base += " GatheringWrite_upload-zone-success_osk";
    return base;
  };

  const handlePostcodeComplete = (data) => {
    let fullAddress = data.address;
    if (data.bname) fullAddress += ` ${data.bname}`;
    if (data.buildingName) fullAddress += ` (${data.buildingName})`;

    const addressParts = data.address.split(" ");
    const locName =
      addressParts.length >= 2
        ? `${addressParts[0]} ${addressParts[1]}`
        : addressParts[0];

    setFormData((prev) => ({ ...prev, address: fullAddress, locName }));
    setIsPostcodeOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, thumbnail });
  };

  return (
    <form onSubmit={submitHandler} className="GatheringWrite_gathering-write-container_osk">
      <div className="GatheringWrite_section-header_osk">
        <HiOutlineInformationCircle />
        <h2>{mode === "create" ? "모임 등록" : "모임 수정"}</h2>
      </div>

      <div className="GatheringWrite_form-group_osk">
        <label>
          <SlPicture /> 대표 이미지 *
        </label>
        <div
          className={getUploadZoneClass()}
          onClick={() => document.getElementById("thumbnailInput").click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadStatus === "success" ? (
            <div>
              <img src={previewUrl} alt="preview" style={{ maxWidth: "100%" }} />
              <div>{fileName}</div>
            </div>
          ) : (
            <>
              <FiUpload />
              <div>이미지를 드래그하거나 클릭하여 업로드</div>
            </>
          )}
        </div>
        <input
          type="file"
          id="thumbnailInput"
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
          required
        />
      </div>
      <div>
        <label>모임 날짜 *</label>
        <input
          type="date"
          name="meetingDate"
          value={formData.meetingDate}
          onChange={handleInputChange}
          min={getTodayString()}
          required
        />
      </div>
      <div>
        <label>모임 시간 *</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>1차 카테고리 *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="">선택</option>
          {category.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>2차 카테고리 *</label>
        <select
          name="subCategory"
          value={formData.subCategory}
          onChange={handleInputChange}
          disabled={!formData.category}
          required
        >
          <option value="">선택</option>
          {subCategory.map((s) => (
            <option key={s.subCategoryId} value={s.subCategoryId}>
              {s.subCategoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>주소 *</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          readOnly
          required
        />
        <button type="button" onClick={() => setIsPostcodeOpen(true)}>
          주소 검색
        </button>
        {isPostcodeOpen && <DaumPostcode onComplete={handlePostcodeComplete} />}
      </div>
      <div>
        <label>상세주소</label>
        <input
          type="text"
          name="detailAddress"
          value={formData.detailAddress}
          onChange={handleInputChange}
        />
      </div>

      {/* 인원 */}
      <div>
        <label>최소 인원 *</label>
        <input
          type="number"
          name="minAttendees"
          value={formData.minAttendees}
          onChange={handleNumberInput}
          min="2"
          required
        />
      </div>
      <div>
        <label>최대 인원</label>
        <input
          type="number"
          name="maxAttendees"
          value={formData.maxAttendees}
          onChange={handleNumberInput}
        />
      </div>

      {/* 마감일 */}
      <div>
        <label>신청 마감일 *</label>
        <input
          type="datetime-local"
          name="deadlineDateTime"
          value={formData.deadlineDateTime}
          onChange={handleInputChange}
          min={getMinDeadlineDateTime()}
          max={getMaxDeadlineDateTime(formData.meetingDate)}
          required
        />
      </div>

      {/* 에디터 */}
      <div>
        <label>모임 소개 *</label>
        <div ref={editorRef}></div>
      </div>

      {/* 태그 */}
      <div>
        <label>태그</label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInput}
          placeholder="쉼표 또는 엔터로 추가"
        />
        <div>
          {formData.tags.map((tag) => (
            <span key={tag}>
              {tag}
              <button type="button" onClick={() => handleTagDelete(tag)}>
                x
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 준비물 */}
      <div>
        <label>준비물</label>
        <input
          type="text"
          name="preparation"
          value={formData.preparation}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>한 줄 소개</label>
        <input
          type="text"
          name="intrOnln"
          value={formData.intrOnln}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit">
        {mode === "create" ? "등록하기" : "수정하기"}
      </button>
    </form>
  );
}
