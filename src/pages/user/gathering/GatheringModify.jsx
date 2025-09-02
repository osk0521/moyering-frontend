// GatheringModify.jsx
import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../../atoms";
import { useNavigate, useParams } from "react-router-dom";
import { myAxios, url } from "../../../config";
import "./GatheringWrite.css";
import Header from "../../common/Header";
import Footer from "../../../components/Footer";
import GatheringForm from "./GatheringForm";

export default function GatheringModify() {
  const navigate = useNavigate();
  const { gatheringId } = useParams();
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [initialData, setInitialData] = useState(null);

  // 기존 데이터 불러오기
  useEffect(() => {
    if (gatheringId && token) {
      myAxios(token, setToken)
        .get(`/user/detailForModifyGathering?gatheringId=${gatheringId}`)
        .then((res) => {
          if (!res.data) {
            alert("작성자만 수정할 수 있습니다.");
            navigate(-1);
            return;
          }
          const g = res.data;
          let parsedTags = [];
          if (g.tags && typeof g.tags === "string") {
            try {
              parsedTags = JSON.parse(g.tags.replace(/'/g, '"'));
            } catch {
              parsedTags = [];
            }
          }
          setInitialData({
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
            deadlineDateTime: g.applyDeadline || "",
            content: g.gatheringContent || "",
            preparation: g.preparationItems || "",
            locName: g.locName || "",
            tags: parsedTags,
            intrOnln: g.intrOnln || "",
            latitude: g.latitude || 0,
            longitude: g.longitude || 0,
            thumbnailFileName: g.thumbnailFileName || "",
          });
        })
        .catch((err) => console.error(err));
    }
  }, [gatheringId, token]);

  const handleSubmit = async (formData) => {
    const formDataToSend = new FormData();

    formDataToSend.append("gatheringId", gatheringId);
    if (formData.thumbnail) {
      formDataToSend.append("thumbnail", formData.thumbnail);
    }
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
    formDataToSend.append("minAttendees", parseInt(formData.minAttendees) || 2);
    if (formData.maxAttendees) {
      formDataToSend.append("maxAttendees", parseInt(formData.maxAttendees));
    }
    if (formData.deadlineDateTime) {
      formDataToSend.append(
        "applyDeadline",
        formData.deadlineDateTime.replace("T", " ") + ":00"
      );
    }
    formDataToSend.append("gatheringContent", formData.content);
    formDataToSend.append("preparationItems", formData.preparation || "");
    formDataToSend.append("intrOnln", formData.intrOnln || "");
    formDataToSend.append("tags", JSON.stringify(formData.tags || []));

    try {
      await myAxios(token).post("/user/modifyGathering", formDataToSend);
      navigate(`/gatheringDetail/${gatheringId}`);
    } catch (err) {
      console.error("모임 수정 실패", err);
      alert("수정에 실패했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  // if (!initialData) return <div>로딩중...</div>;

  return <GatheringForm mode="modify" />;
}