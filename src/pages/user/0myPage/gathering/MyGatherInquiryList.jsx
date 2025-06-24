import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MyGatherInquiryList.css";
import Sidebar from "../common/Sidebar";
import Header from "../../../common/Header";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../../../atoms";
import { myAxios, url } from "../../../../config";
export default function GatherInquiry() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const [participated, setParticipated] = useState([]);
  const [organized, setOrganized] = useState([]);
  const [activeTab, setActiveTab] = useState("participated");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [openId, setOpenId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    if (user || token) {
      console.log("전달하는 토큰:", token); // 이 값이 실제로 무엇인지
      if(activeTab == "participated"){
      myAxios(token).get(`/user/getGatheringInquiriesByUserId`)
        .then((res) => {
          console.log("API Response:", res.data);
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
    } else {
      if (
        confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/userlogin");
      } else {
        history.back();
        return;
      }
    }
  }, [token, activeTab, selectedStatus, startDate, endDate]);

  const data = activeTab === "participated" ? participated : organized;
  const filtered =
    selectedStatus === "전체"
      ? data
      : data.filter((item) => item.status === selectedStatus);

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleReplyChange = (id, text) => {
    setReplyText((prev) => ({ ...prev, [id]: text }));
  };

  const handleReplySubmit = (id) => {
    alert(`답변 등록됨: ${replyText[id]}`);
    setReplyText((prev) => ({ ...prev, [id]: "" }));
  };

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };
  return (
    <div>
      <Header />
      <main className="MyGatherInquiryList_gather-inquiry-page_osk">
        <Sidebar />
        <section className="MyGatherInquiryList_inquiry-section_osk">
          <div className="MyGatherInquiryList_inquiry-header_osk">
            <h2 className="MyGatherInquiryList_inquiry-title_osk">문의내역</h2>

            <div className="MyGatherInquiryList_date-filter_osk">
              <span className="MyGatherInquiryList_date-label_osk">
                등록 기간
              </span>
              <div className="MyGatherInquiryList_date-picker-container_osk">
                <DatePicker
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  placeholderText="전체"
                  className="MyGatherInquiryList_date-picker_osk"
                  dateFormat="yyyy.MM.dd"
                  isClearable={false}
                />
                {(startDate || endDate) && (
                  <button
                    type="button"
                    className="MyGatherInquiryList_clear-button_osk"
                    onClick={clearDates}
                    aria-label="Clear dates"
                  >
                    ✕
                  </button>
                )}
              </div>
              <span className="MyGatherInquiryList_date-label_osk">상태</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="MyGatherInquiryList_status-select_osk"
              >
                <option value="전체">전체</option>
                <option value="대기">대기</option>
                <option value="답변완료">답변완료</option>
              </select>
            </div>
          </div>

          <div className="MyGatherInquiryList_inquiry-tabs_osk">
            <button
              className={
                activeTab === "participated"
                  ? "MyGatherInquiryList_active_osk"
                  : ""
              }
              onClick={() => {
                setActiveTab("participated");
                setSelectedStatus("전체");
              }}
            >
              내가 참여한 모임문의
            </button>
            <button
              className={
                activeTab === "organizerId "
                  ? "MyGatherInquiryList_active_osk"
                  : ""
              }
              onClick={() => {
                setActiveTab("organizerId ");
                setSelectedStatus("전체");
              }}
            >
              내가 주최한 모임문의
            </button>
          </div>

          <div className="MyGatherInquiryList_inquiry-list_osk">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="MyGatherInquiryList_inquiry-box_osk"
              >
                <div
                  className="MyGatherInquiryList_accordion-header_osk"
                  onClick={() => toggleAccordion(item.id)}
                >
                  <div className="MyGatherInquiryList_inquiry-info_osk">
                    <div className="MyGatherInquiryList_user-info_osk">
                      <div className="MyGatherInquiryList_user-avatar_osk"></div>
                      <span className="MyGatherInquiryList_username_osk">
                        {item.user}
                      </span>
                    </div>
                    <div className="MyGatherInquiryList_inquiry-details_osk">
                      <h3 className="MyGatherInquiryList_inquiry-title-item_osk">
                        {item.title}
                      </h3>
                      <div className="MyGatherInquiryList_inquiry-dates_osk">
                        <span>문의 등록일: {item.date}</span>
                        <span>모임일: {item.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {openId === item.id && (
                  <div className="MyGatherInquiryList_accordion-body_osk">
                    <p className="MyGatherInquiryList_question_osk">
                      Q. {item.question}
                    </p>
                    {item.answer ? (
                      <div className="MyGatherInquiryList_answer_osk">
                        <p>
                          <strong>A.</strong> {item.answer}
                        </p>
                      </div>
                    ) : activeTab === "organizerId " ? (
                      <div className="MyGatherInquiryList_answer-form_osk">
                        <textarea
                          className="MyGatherInquiryList_answer-textarea_osk"
                          placeholder="우처 네임님의 문의에 소중한 답변을 등록해 주세요"
                          value={replyText[item.id] || ""}
                          onChange={(e) =>
                            handleReplyChange(item.id, e.target.value)
                          }
                        />
                        <div className="MyGatherInquiryList_submit-btn-container_osk">
                          <button
                            className="MyGatherInquiryList_submit-btn_osk"
                            onClick={() => handleReplySubmit(item.id)}
                          >
                            등록
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="MyGatherInquiryList_pagination_osk">
            <button className="MyGatherInquiryList_pagination-btn_osk">
              ‹
            </button>
            <button className="MyGatherInquiryList_pagination-btn_osk MyGatherInquiryList_pagination-active_osk">
              1
            </button>
            <button className="MyGatherInquiryList_pagination-btn_osk">
              2
            </button>
            <button className="MyGatherInquiryList_pagination-btn_osk">
              3
            </button>
            <button className="MyGatherInquiryList_pagination-btn_osk">
              ›
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}