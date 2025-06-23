import React, { useState, useEffect, memo, useRef } from "react";
import { url, myAxios } from "../../config";
import axios from "axios";
import {
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import aImage from "/detail2.png";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../atoms";
export default function GatheringDetailInquiry({ gatheringId }) {
  const [qnaData, setQnaData] = useState([]);
  const [gatheringData, setGatheringData] = useState({});
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const user = useAtomValue(userAtom);    
  const token = useAtomValue(tokenAtom);
  const userId = user.id;

  useEffect(() => {
    myAxios().get(`/getGatheringInquiries?gatheringId=${gatheringId}`)
      .then((res) => {
        console.log("API Response:", res.data);

        const qnaList = res.data.qnaList;

        let parsedTags = [];
        if (
          res.data.gatheringTags &&
          typeof res.data.gatheringTags === "string"
        ) {
          try {
            // 문자열를 배열로 변환
            const validJsonString = res.data.gatheringTags.replace(/'/g, '"');
            parsedTags = JSON.parse(validJsonString);
          } catch (error) {
            console.error("Tags 파싱 오류:", error);
            parsedTags = [];
          }
        }

        // 모임 데이터 설정
        setGatheringData({
          gatheringId: gatheringId,
          title: res.data.gatheringTitle,
          thumbnailFileName: res.data.gatheringThumbnailFileName,
          meetingDate: res.data.gatheringMeetingDate,
          startTime: res.data.gatheringStartTime,
          endTime: res.data.gatheringEndTime,
          address: res.data.gatheringAddress,
          detailAddress: res.data.gatheringDetailAddress,
          introOnline: res.data.gatheringIntrOnln,
          tags: parsedTags,
        });

        // Q&A 데이터 변환 - 새로운 구조에 맞게 수정
        setQnaData(
          qnaList.map((q) => ({
            id: q.id, // 기존: q.inquiryId
            status: q.status, // 새로 추가: "답변대기" 또는 "답변완료"
            content: q.content, // 기존: q.inquiryContent → questionContent
            author: q.author, // 기존: q.nickName → name
            date: q.date, // 기존: q.inquiryDate → questionDate
            answer: q.answer, // 새로 추가: 답변 정보 (객체 또는 null)

            userId: q.userId || null, // 새 구조에는 없으므로 null
            nickName: q.author,
            profile: q.profile || null, // 새 구조에는 없으므로 null
            questionContent: q.content, // content를 questionContent로도 매핑
            questionDate: q.date, // date를 questionDate로도 매핑
            responseDate: q.answer?.date || null, // answer 객체에서 추출
            responseContent: q.answer?.content || null, // answer 객체에서 추출 (배열)
            responseState: q.status, // status를 responseState로도 매핑
            meetingDate: res.data.gatheringMeetingDate, // 모임 날짜
          }))
        );

        console.log("변환된 tags:", parsedTags);
        console.log("변환된 qnaData:", qnaList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [gatheringId]);

  // 질문하기 모달 관련 함수들
  const toggleQuestionModal = () => {
    setIsQuestionModalOpen(!isQuestionModalOpen);
    // 모달 닫을 때 입력값 초기화
    if (isQuestionModalOpen) {
      setQuestionTitle("");
      setQuestionContent("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!questionTitle.trim()) {
      alert("질문 제목을 입력해주세요.");
      return;
    }
    if (!questionContent.trim()) {
      alert("질문 내용을 입력해주세요.");
      return;
    }

    console.log("질문 제출:", {
      title: questionTitle,
      content: questionContent,
    });

      // const response = await myAxios(token).post(`/user/writeGathering`,
      //   formDataToSend
      // );
    // 성공 시 모달 닫기
    toggleQuestionModal();
  };

  // 페이지네이션 설정
  const questionsPerPage = 5;
  const totalQuestionsCount = qnaData.length;
  const calculatedTotalPages = Math.ceil(
    totalQuestionsCount / questionsPerPage
  );

  useEffect(() => {
    setTotalPages(calculatedTotalPages);
  }, [calculatedTotalPages]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 현재 페이지의 질문들
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = qnaData.slice(startIndex, endIndex);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  // 시간 포맷팅 함수
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${ampm} ${displayHour}:${minutes}`;
  };
  
  return (
    <div className="GatheringDetail_questions-board_osk">
      <div className="GatheringDetail_questions-table_osk">
        {/* Header */}
        <div className="GatheringDetail_questions-header_osk">
          <div className="GatheringDetail_questions-grid-header_osk">
            <div>답변상태</div>
            <div>문의/답변 내용</div>
            <div>작성자</div>
            <div>작성일</div>
          </div>
        </div>

        {/* 질문이 없는 경우 */}
        {currentQuestions.length === 0 ? (
          <div className="GatheringDetail_no-questions_osk">
            <p>아직 등록된 문의가 없습니다.</p>
          </div>
        ) : (
          /* Dynamic Question Rows */
          currentQuestions.map((question, index) => (
            <React.Fragment key={question.id}>
              <div
                className={`GatheringDetail_questions-row_osk ${
                  index % 2 === 1 ? "GatheringDetail_alternate_osk" : ""
                }`}
              >
                <div className="GatheringDetail_questions-grid_osk">
                  <div className="GatheringDetail_status_osk">
                    <span
                      className={`GatheringDetail_status-badge_osk ${
                        question.status === "답변완료"
                          ? "GatheringDetail_status-completed_osk"
                          : "GatheringDetail_status-pending_osk"
                      }`}
                    >
                      {question.status}
                    </span>
                  </div>
                  <div className="GatheringDetail_title_osk">
                    {question.content}
                  </div>
                  <div className="GatheringDetail_author_osk">
                    {question.author}
                  </div>
                  <div className="GatheringDetail_date_osk">
                    {question.date}
                  </div>
                </div>
              </div>

              {/* Answer section */}
              {question.answer && (
                <div className="GatheringDetail_answer-section_osk">
                  <div className="GatheringDetail_answer-header_osk">
                    <span className="GatheringDetail_answer-badge_osk">
                      답변
                    </span>
                    <span className="GatheringDetail_answer-author_osk">
                      {question.answer.author}
                    </span>
                    <span className="GatheringDetail_answer-date_osk">
                      {question.answer.date}
                    </span>
                  </div>
                  <div className="GatheringDetail_answer-content_osk">
                    {/* 답변 내용이 배열인 경우 각 줄을 p 태그로 렌더링 */}
                    {Array.isArray(question.answer.content) ? (
                      question.answer.content.map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))
                    ) : (
                      <p>{question.answer.content}</p>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Question Button */}
      <button
        className="GatheringDetail_question-button_osk"
        onClick={toggleQuestionModal}
      >
        문의하기
      </button>

      {/* Pagination - 질문이 있을 때만 표시 */}
      {qnaData.length > 0 && (
        <div className="GatheringDetail_questions-pagination_osk">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                className={`GatheringDetail_pagination-btn_osk ${
                  currentPage === pageNum ? "GatheringDetail_active_osk" : ""
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            )
          )}
        </div>
      )}
      {isQuestionModalOpen && (
        <form>
          <Modal
            isOpen={isQuestionModalOpen}
            toggle={toggleQuestionModal}
            className="GatheringDetail_question-modal_osk"
            size="lg"
            centered
          >
            <ModalHeader
              toggle={toggleQuestionModal}
              className="GatheringDetail_modal-header_osk"
            >
              <span className="GatheringDetail_modal-title_osk">
                {gatheringData.title}
              </span>
            </ModalHeader>
            <ModalBody className="GatheringDetail_modal-body_osk">
              <div className="GatheringDetail_gathering-info_osk">
                <img
                  src={`${url}/image?filename=${gatheringData.thumbnailFileName}`}
                  alt="모임 이미지"
                  className="GatheringDetail_gathering-image_osk"
                />
                <div className="GatheringDetail_gathering-details_osk">
                  <div className="GatheringDetail_gathering-info-item_osk">
                    <span>
                      제목: {formatDate(gatheringData.gatheringTitle)}
                      <br />
                      소개: {formatDate(gatheringData.gatheringIntrOnln)} <br />
                      <CiCalendar className="GatheringDetail_gathering-info-icon_osk" />
                      모임일: {formatDate(gatheringData.meetingDate)}{" "}
                      {formatTime(gatheringData.startTime)} ~{" "}
                      {formatTime(gatheringData.endTime)}
                    </span>
                  </div>
                  <div className="GatheringDetail_gathering-info-item_osk">
                    <CiLocationOn className="GatheringDetail_gathering-info-icon_osk" />
                    <span>
                      장소: {gatheringData.address}{" "}
                      {gatheringData.detailAddress}
                    </span>
                  </div>
                </div>
              </div>

              {gatheringData.tags && gatheringData.tags.length > 0 && (
                <div className="GatheringDetail_modal-tags_osk">
                  {gatheringData.tags.map((tag, index) => (
                    <span key={index} className="GatheringDetail_modal-tag_osk">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="GatheringDetail_input-section_osk">
                <label className="GatheringDetail_input-label_osk">
                  문의 사항
                </label>
                <textarea
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  placeholder="문의 사항에 대해 자세히 알려주세요"
                  rows={6}
                  className="GatheringDetail_textarea-field_osk"
                />
              </div>
            </ModalBody>
            <ModalFooter className="GatheringDetail_modal-footer_osk">
              <button
                className="GatheringDetail_modal-btn_osk GatheringDetail_modal-btn-cancel_osk"
                onClick={toggleQuestionModal}
              >
                취소
              </button>
              <input
                type="submit"
                className="GatheringDetail_modal-btn_osk GatheringDetail_modal-btn-submit_osk"
                onClick={handleQuestionSubmit}
              >
                문의하기
              </input>
            </ModalFooter>
          </Modal>
        </form>
      )}
    </div>
  );
}
