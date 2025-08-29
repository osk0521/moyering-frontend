import React from "react";
import { useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../../atoms";
import { useNavigate } from "react-router-dom";
import { myAxios } from "../../../config";
import GatheringForm from "../../../components/gathering/GatheringForm";
import "./GatheringWrite.css";
import Header from "../../common/Header";
import Footer from "../../../components/Footer";
export default function GatheringWrite() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);

  const handleSubmit = async (formData) => {
    const formDataToSend = new FormData();

    // 대표 이미지
    if (formData.thumbnail) {
      formDataToSend.append("thumbnail", formData.thumbnail);
    }
    formDataToSend.append("userId", user.id);

    // 기본 데이터
    formDataToSend.append("title", formData.title);
    formDataToSend.append("meetingDate", formData.meetingDate);
    formDataToSend.append("startTime", formData.startTime);
    formDataToSend.append("endTime", formData.endTime);
    formDataToSend.append("categoryId", parseInt(formData.category));
    formDataToSend.append("subCategoryId", parseInt(formData.subCategory));
    formDataToSend.append("address", formData.address);
    formDataToSend.append("detailAddress", formData.detailAddress || "");
    formDataToSend.append("locName", formData.locName || "");
    formDataToSend.append("latitude", formData.latitude);
    formDataToSend.append("longitude", formData.longitude);

    // 인원수
    formDataToSend.append("minAttendees", parseInt(formData.minAttendees));
    if (formData.maxAttendees) {
      formDataToSend.append("maxAttendees", parseInt(formData.maxAttendees));
    }

    // 마감일
    formDataToSend.append(
      "applyDeadline",
      formData.deadlineDateTime.replace("T", " ") + ":00"
    );

    // 모임 내용
    formDataToSend.append("gatheringContent", formData.content);
    formDataToSend.append("preparationItems", formData.preparation || "");
    formDataToSend.append("intrOnln", formData.intrOnln || "");
    formDataToSend.append("status", "모집중");
    formDataToSend.append("canceled", "false");

    // 태그
    formDataToSend.append("tags", JSON.stringify(formData.tags || []));

    try {
      const res = await myAxios(token).post("/user/writeGathering", formDataToSend);
      navigate(`/gatheringDetail/${res.data}`);
    } catch (err) {
      console.error("모임 등록 실패", err);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  return <GatheringForm mode="create" onSubmit={handleSubmit} />;
}