import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@toast-ui/editor";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { getTodayString, getMinDeadlineDateTime, getMaxDeadlineDateTime } from "./utils";

export default function GatheringForm({ 
  mode = "create",                     
  initialData = null,                
  onSubmit                            
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

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (!editorRef.current || editor) return;
    const instance = new Editor({
      el: editorRef.current,
      height: "400px",
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      hideModeSwitch: true,
      initialValue: initialData?.content || "",
      events: {
        change: () => {
          const html = instance.getHTML();
          setFormData(prev => ({ ...prev, content: html }));
        },
      },
    });
    setEditor(instance);
    return () => instance.destroy();
  }, [editorRef.current]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (e.key === "Enter" || value.includes(",")) {
      e.preventDefault();
      const tags = value.split(",").map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({ ...prev, tags: [...new Set([...prev.tags, ...tags])] }));
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const handleTagDelete = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>{mode === "create" ? "모임 등록" : "모임 수정"}</h2>

      {/* 제목 */}
      <div>
        <label>모임 이름 *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* 날짜 */}
      <div>
        <label>모임 날짜 *</label>
        <input
          type="date"
          name="meetingDate"
          value={formData.meetingDate}
          onChange={handleInputChange}
          required
          min={getTodayString()}
        />
      </div>

      {/* 시간 */}
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

      {/* 카테고리, 주소, 이미지 업로드 등은 생략하고 필요 시 컴포넌트화하여 포함 */}

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
        <div style={{ display: "flex", gap: "4px", marginTop: "5px" }}>
          {formData.tags.map(tag => (
            <span key={tag} style={{ background: "#eee", padding: "4px" }}>
              {tag}
              <button type="button" onClick={() => handleTagDelete(tag)}>x</button>
            </span>
          ))}
        </div>
      </div>

      <button type="submit">
        {mode === "create" ? "등록" : "수정"}하기
      </button>
    </form>
  );
}