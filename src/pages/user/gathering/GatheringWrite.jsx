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
import getLatLngFromAddress from '../../../hooks/common/getLatLngFromAddress'
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
import DaumPostcode from "react-daum-postcode";
import "bootstrap/dist/css/bootstrap.min.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import Header from "../../common/Header";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router-dom";
import "./GatheringWrite.css";
import GatheringForm from "../../../components/gathering/GatheringForm";
// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// 현재 시간에서 3시간 후의 datetime-local 형식 반환
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

// 특정 날짜의 23:59를 datetime-local 형식으로 반환
const getMaxDeadlineDateTime = (meetingDate) => {
  if (!meetingDate) return "";
  return `${meetingDate}T23:59`;
};

const validateDateTime = (formData) => {
  const errors = {};
  if (formData.meetingDate && formData.meetingDate < getTodayString()) {
    errors.meetingDate = "";
    // errors.meetingDate = "모임 날짜는 오늘 이후여야 합니다.";
  }

  if (formData.startTime && formData.endTime) {
    if (formData.startTime >= formData.endTime) {
      errors.timeRange = "";
      // errors.timeRange = "종료 시간은 시작 시간보다 늦어야 합니다.";
    }
  }

  for (const key in errors) {
    if (!errors[key]) {
      delete errors[key];
    }
  }

  return errors;
};
export default function GatheringWrite() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);

  const handleSubmit = async (formData) => {
    const formDataToSend = new FormData();

    formDataToSend.append("thumbnail", formData.thumbnail);
    formDataToSend.append("userId", user.id);
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
    formDataToSend.append("minAttendees", parseInt(formData.minAttendees));
    if (formData.maxAttendees) {
      formDataToSend.append("maxAttendees", parseInt(formData.maxAttendees));
    }
    formDataToSend.append("applyDeadline", formData.deadlineDateTime.replace("T", " ") + ":00");
    formDataToSend.append("gatheringContent", formData.content);
    formDataToSend.append("preparationItems", formData.preparation || "");
    formDataToSend.append("intrOnln", formData.intrOnln || "");
    formDataToSend.append("status", "모집중");
    formDataToSend.append("canceled", "false");
    formDataToSend.append("tags", JSON.stringify(formData.tags || []));

    try {
      const res = await myAxios(token).post("/user/writeGathering", formDataToSend);
      const newId = res.data;
      navigate(`/gatheringDetail/${newId}`);
    } catch (err) {
      console.error("모임 등록 실패", err);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return <GatheringForm mode="create" onSubmit={handleSubmit} />;
}