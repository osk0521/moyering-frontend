import React, { useState, useEffect, memo, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactDOM from "react-dom";
import { CiHeart } from "react-icons/ci";
import { BiChevronRight, BiChevronDown } from "react-icons/bi";
import { url, KAKAO_REST_API_KEY } from "../../config"
import Header from "./Header";
import {Table, Modal, ModalHeader,  ModalBody, ModalFooter, Button,} from "reactstrap";
import "./GatheringDetail.css";
import { FaRegCalendar } from "react-icons/fa";
import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import aImage from "/detail2.png";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";

// 카카오 맵 컴포넌트
const handleJoinClick = () => {
  console.log("참가 신청하기 클릭");
};

const handleWishlistClick = () => {
  console.log("찜하기 클릭");
};

export default function GatheringDetail() {
  const{gatheringId} = useParams();
  
  const [gatheringData, setGatheringData] = useState({
    gatheringId: null,
    title: "",
    userId: null,
    gatheringContent: "",
    thumbnailFileName: "",
    meetingDate: "",
    startTime: "",
    endTime: "",
    address: "",
    detailAddress: "",
    minAttendees: 0,
    maxAttendees: 0,
    applyDeadline: "",
    preparationItems: "",
    tags: [],
    createDate: "",
    categoryId: null,
    subCategoryId: null,
    latitude: 0,
    longitude: 0,
    intrOnln: "",
    status: "",
    locName: "",
  });

  const [hostData, setHostData] = useState({
    name: "",
    profileImage: "",
    followers: 0,
    intro: "",
    likeCategory: "",
    tags: [],
  });

  const [membersData, setMembersData] = useState({
    id:"",
    name: "",
    profileImage: "",
    introduction: "",
  });

  useEffect(()=> {
    axios.get(`${url}/detailGathering/?gatheringId=${gatheringId}`)
        .then(res=> {
            console.log('API Response:', res.data); 
            
            // gathering 데이터 설정
            const gathering = res.data.gathering;
            const host = res.data.host;
            const members = res.data.members;
            //  members: [
//       // {
//       //   id: 1,
//       //   name: "닉네임1",
//       //   profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=👤",
//       //   introduction:
//       //     "자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기",
//       // },
//       // {
//       //   id: 2,
//       //   name: "닉네임2",
//       //   profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=👤",
//       //   introduction:
//       //     "자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기",
//       // },
//       // {
//       //   id: 3,
//       //   name: "닉네임3",
//       //   profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=👤",
//       //   introduction:
//       //     "자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기",
//       // },
//       // {
//       //   id: 4,
//       //   name: "닉네임4",
//       //   profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=👤",
//       //   introduction:
//       //     "자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기",
//       // }, 추후 추가 예정
//     ],
            // tags 필드를 문자열에서 배열로 변환
            let parsedTags = [];
            if (gathering.tags && typeof gathering.tags === 'string') {
                try {
                    // 문자열 "['독서', '소모임', '홍대']"를 배열로 변환
                    const validJsonString = gathering.tags.replace(/'/g, '"');
                    parsedTags = JSON.parse(validJsonString);
                } catch (error) {
                    console.error('Tags 파싱 오류:', error);
                    parsedTags = [];
                }
            }
            
            setGatheringData({
                gatheringId: gathering.gatheringId,
                title: gathering.title,
                userId: gathering.userId,
                gatheringContent: gathering.gatheringContent,
                thumbnailFileName: gathering.thumbnailFileName,
                meetingDate: gathering.meetingDate,
                startTime: gathering.startTime,
                endTime: gathering.endTime,
                address: gathering.address,
                detailAddress: gathering.detailAddress,
                minAttendees: gathering.minAttendees,
                maxAttendees: gathering.maxAttendees,
                applyDeadline: gathering.applyDeadline,
                preparationItems: gathering.preparationItems,
                tags: parsedTags,
                createDate: gathering.createDate,
                categoryId: gathering.categoryId,
                subCategoryId: gathering.subCategoryId,
                latitude: gathering.latitude,
                longitude: gathering.longitude,
                intrOnln: gathering.intrOnln,
                status: gathering.status,
                locName: gathering.locName,
            });

            setHostData({
                userId: host.userId,
                name: host.name,
                profileImage: host.profile,
                followers: 0, // API에서 제공되지 않는 경우 기본값
                intro: host.intro,
                likeCategory: "",
                tags: [], // 호스트 태그가 없는 경우 빈 배열
            });
            setMembersData({
                name: members.name,
                profileImage: members.profile,
                intro: members.intro,
                likeCategory: "",
                tags: [], // 호스트 태그가 없는 경우 빈 배열
            });

            console.log('변환된 tags:', parsedTags);
        })
        .catch(err=> {
            console.log(err)
        })
  }, [gatheringId]);
  
  const [activeTab, setActiveTab] = useState("details");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // 질문하기 모달 상태
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [questions, setQuestions] = useState([]);

  // 캐러셀 상태
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(true);
  };

  // 질문하기 모달 관련 함수들
  const toggleQuestionModal = () => {
    setIsQuestionModalOpen(!isQuestionModalOpen);
    // 모달 닫을 때 입력값 초기화
    if (isQuestionModalOpen) {
      setQuestionTitle("");
      setQuestionContent("");
    }
  };

  const handleQuestionSubmit = () => {
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

    // 여기서 백엔드로 질문 데이터를 전송하는 로직 추가
    // submitQuestion(questionTitle, questionContent);

    // 성공 시 모달 닫기
    toggleQuestionModal();
  };

  // 질문 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const exampleQuestionsData = {
    questions: [
      {
        id: 1,
        status: "답변대기",
        title: "준비물 필수인가요?",
        author: "id18****",
        date: "2025-03-29",
        answer: null,
      },
      {
        id: 2,
        status: "답변완료",
        title: "처의 집문이옵니다.",
        author: "id335****",
        date: "2025-03-29",
        answer: null,
      },
      {
        id: 3,
        status: "답변완료",
        title: "또 다른 질문이용",
        author: "id877****",
        date: "2025-02-21",
        answer: null,
      },
      {
        id: 4,
        status: "답변완료",
        title: "수업에 상황 늦을 것같은데 초반을 놓치면 따라가기 힘들까요?",
        author: "id877****",
        date: "2025-02-21",
        answer: {
          author: "호스트명",
          date: "2025-02-21",
          content: [
            "안녕하세요. 고객님 처의 1대1로 수강생분들의 속도에 맞춰서 수업을 진행합니다.",
            "또한, 시간 강의자료를 업로드해드리오니 크게 문제는 없을 것으로 예상됩니다.",
            "다만, 많이 늦을실 경우에 한정된 시간 내에 완성이 어려우실 수 있습니다.",
          ],
        },
      },
      {
        id: 5,
        status: "답변완료",
        title: "어기도 있어요 질문",
        author: "id18id18id18id18id18id18",
        date: "2025-02-21",
        answer: null,
      },
      {
        id: 6,
        status: "답변완료",
        title: "나두 질문이요",
        author: "id335****",
        date: "2025-01-01",
        answer: null,
      },
    ],
    totalPages: 3,
    currentPage: 1,
  };

  const recommendations = [
    {
      id: 1,
      category: "취미 > 수집",
      title: "레트로 테마",
      date: "2024년 6월 1일 (토)",
      participants: "3/6명",
      image: "./a.png",
    },
    {
      id: 2,
      category: "취미 > 수집",
      title: "레트로 테마",
      date: "2024년 6월 1일 (토)",
      participants: "3/6명",
      image: "./a.png",
    },
    {
      id: 3,
      category: "취미 > 수집",
      title: "레트로 테마",
      date: "2024년 6월 1일 (토)",
      participants: "3/6명",
      image: "./a.png",
    },
  ];
  const totalMembers = gatheringData.members.length;
  const CustomPrevArrow = ({ style, onClick, show }) => {
    if (!show) return null;
    return (
      <div
        className="GatheringDetail_custom-slick-prev_osk"
        style={style}
        onClick={onClick}
      >
        <GrPrevious className="GatheringDetail_arrow-icon_osk" />
      </div>
    );
  };

  const CustomNextArrow = ({ style, onClick, show }) => {
    if (!show) return null;

    return (
      <div
        className="GatheringDetail_custom-slick-next_osk"
        style={style}
        onClick={onClick}
      >
        <GrNext className="GatheringDetail_arrow-icon_osk" />
      </div>
    );
  };

  // 텍스트를 문단으로 나누는 함수
  const splitTextIntoParagraphs = (text) => {
    return text.split("\n\n").filter((paragraph) => paragraph.trim() !== "");
  };

  // 미리보기 텍스트 길이 설정 (문자 수 기준)
  const PREVIEW_LENGTH = 500;

  // 전체 상세 설명 텍스트
  const descriptionParagraphs = splitTextIntoParagraphs(gatheringData.detailedDescription);

  // 미리보기용 텍스트 (PREVIEW_LENGTH 문자까지)
  const previewText =
    fullDescription.length > PREVIEW_LENGTH
      ? fullDescription.substring(0, PREVIEW_LENGTH) + "..."
      : fullDescription;

  // 더보기 버튼을 보여줄지 결정
  const shouldShowMoreButton = fullDescription.length > PREVIEW_LENGTH;

  const questionsPerPage = 5;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  // 탭 클릭 시 해당 섹션으로 스크롤 이동
  const handleTabClick = (tabName) => {
    const element = document.getElementById(`GatheringDetail_${tabName}_osk`);
    if (element) {
      const headerHeight = 60; // 헤더 높이
      const tabsHeight = 60; // 탭 메뉴 높이
      const offsetTop = element.offsetTop - headerHeight - tabsHeight - 20;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    setActiveTab(tabName);
  };
 // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekDay})`;
  };

  // 시간 포맷팅 함수
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? '오후' : '오전';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${ampm} ${displayHour}:${minutes}`;
  };
  // 스크롤 위치에 따라 활성 탭 변경
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "details",
        "host",
        "questions",
        "members",
        "recommendations",
      ];
      const headerHeight = 60;
      const tabsHeight = 60;
      const offset = headerHeight + tabsHeight + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(
          `GatheringDetail_${sections[i]}_osk`
        );
        if (element && window.scrollY + offset >= element.offsetTop) {
          setActiveTab(sections[i]);
          break;
        }
      }
    };

    setQuestions(exampleQuestionsData.questions);
    setTotalPages(exampleQuestionsData.totalPages);
    setCurrentPage(exampleQuestionsData.currentPage);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Header />
      <div className="GatheringDetail_gathering-detail_osk">
        {/* 메인 컨테이너 */}
        <div className="GatheringDetail_main-container_osk">
          {/* 왼쪽 메인 컨텐츠 */}
          <main className="GatheringDetail_main-content_osk">
            {/* 이미지 섹션 */}
            <div className="GatheringDetail_image-section_osk">
              <img
                src={gatheringData.thumbnailFileName ? `${url}/uploads/${gatheringData.thumbnailFileName}` : aImage}
                alt="모임 이미지"
                className="GatheringDetail_main-image_osk"
              />
            </div>

            {/* 탭 메뉴 */}
            <div className="GatheringDetail_tabs_osk">
              <div className="GatheringDetail_tab-list_osk">
                <button
                  className={`GatheringDetail_tab_osk ${
                    activeTab === "details" ? "GatheringDetail_active_osk" : ""
                  }`}
                  onClick={() => handleTabClick("details")}
                >
                  상세 정보
                </button>
                <button
                  className={`GatheringDetail_tab_osk ${
                    activeTab === "host" ? "GatheringDetail_active_osk" : ""
                  }`}
                  onClick={() => handleTabClick("host")}
                >
                  모임장
                </button>
                <button
                  className={`GatheringDetail_tab_osk ${
                    activeTab === "questions"
                      ? "GatheringDetail_active_osk"
                      : ""
                  }`}
                  onClick={() => handleTabClick("questions")}
                >
                  질문
                </button>
                <button
                  className={`GatheringDetail_tab_osk ${
                    activeTab === "members" ? "GatheringDetail_active_osk" : ""
                  }`}
                  onClick={() => handleTabClick("members")}
                >
                  멤버
                </button>
                <button
                  className={`GatheringDetail_tab_osk ${
                    activeTab === "recommendations"
                      ? "GatheringDetail_active_osk"
                      : ""
                  }`}
                  onClick={() => handleTabClick("recommendations")}
                >
                  추천
                </button>
              </div>
            </div>

             {/* 상세 정보 내용 */}
            <div className="GatheringDetail_detail-content_osk">
              {/* 상세 소개 */}
              <div
                id="GatheringDetail_details_osk"
                className="GatheringDetail_detail-section_osk"
              >
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  상세 소개
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  {gatheringData.intrOnln}
                </p>
                
                {/* Toast UI Editor로 작성된 내용을 HTML로 렌더링 */}
                {!isExpanded && shouldShowMoreButton && (
                  <>
                    <div 
                      className="mb-4 text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: previewText }}
                    />
                    <button
                      className="GatheringDetail_more_osk"
                      onClick={handleExpandClick}
                    >
                      더보기 <BiChevronDown />
                    </button>
                  </>
                )}

                {/* 더보기 클릭 후 전체 내용 표시 또는 짧은 텍스트인 경우 바로 표시 */}
                {(isExpanded || !shouldShowMoreButton) && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: gatheringData.gatheringContent }}
                  />
                )}

                {/* 준비물 */}
                <h3
                  className="GatheringDetail_section-title_osk"
                  style={{ marginTop: "32px" }}
                >
                  준비물
                </h3>
                <ul className="GatheringDetail_info-list_osk">
                  <li className="GatheringDetail_info-item_osk">
                    <span className="GatheringDetail_info-label_osk">
                      준비물
                    </span>
                    <span className="GatheringDetail_info-value_osk">
                      {gatheringData.preparationItems}
                    </span>
                  </li>
                </ul>

                {/* 위치 */}
                <h3
                  className="GatheringDetail_section-title_osk"
                  style={{ marginTop: "32px" }}
                >
                  위치
                </h3>
                <div className="GatheringDetail_map-container_osk">
                    {/* 카카오 맵 적용 */}
                </div>
                <p className="GatheringDetail_description_osk">
                  {gatheringData.address} {gatheringData.detailAddress}
                </p>
              </div>

              {/* 모임장 섹션 */}
               <div
                id="GatheringDetail_host_osk"
                className="GatheringDetail_detail-section_osk"
              >
                <h3 className="GatheringDetail_section-title_osk">
                  같이 할 모임장을 소개해요
                </h3>
                <div className="GatheringDetail_host-info_osk">
                  <div className="GatheringDetail_host-avatar_osk">
                    <img
                      src={hostData.profileImage ? `${url}/uploads/${hostData.profileImage}` : aImage}
                      alt="모임장"
                      className="GatheringDetail_host-profile-image_osk"
                    />
                  </div>
                  <div className="GatheringDetail_host-details_osk">
                    <h4>{hostData.name}</h4>
                    <div className="GatheringDetail_host-stats_osk">
                      팔로워 {hostData.followers}명
                    </div>
                    <div className="GatheringDetail_host-description_osk">
                      {hostData.intro}
                    </div>
                    {hostData.tags && hostData.tags.length > 0 && (
                      <div className="GatheringDetail_host-tags_osk">
                        {hostData.tags.slice(0, 5).map((tag, index) => (
                          <span
                            key={index}
                            className="GatheringDetail_host-tag_osk"
                          >
                            {tag}
                          </span>
                        ))}
                        {hostData.tags.length > 5 && (
                          <span className="GatheringDetail_host-tag_osk">
                            +{hostData.tags.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 질문 섹션 */}
              <div
                id="GatheringDetail_questions_osk"
                className="GatheringDetail_detail-section_osk"
              >
                <h3 className="GatheringDetail_section-title_osk">질문</h3>

                <div className="GatheringDetail_questions-board_osk">
                  <div className="GatheringDetail_questions-table_osk">
                    {/* Header */}
                    <div className="GatheringDetail_questions-header_osk">
                      <div className="GatheringDetail_questions-grid-header_osk">
                        <div>답변상태</div>
                        <div>제목</div>
                        <div>작성자</div>
                        <div>작성일</div>
                      </div>
                    </div>

                    {/* 질문이 없는 경우 */}
                    {currentQuestions.length === 0 ? (
                      <div className="GatheringDetail_no-questions_osk">
                        <p>아직 등록된 질문이 없습니다.</p>
                      </div>
                    ) : (
                      /* Dynamic Question Rows */
                      currentQuestions.map((question, index) => (
                        <React.Fragment key={question.id}>
                          <div
                            className={`GatheringDetail_questions-row_osk ${
                              index % 2 === 1
                                ? "GatheringDetail_alternate_osk"
                                : ""
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
                                {question.title}
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
                                {question.answer.content.map(
                                  (paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                  )
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
                    질문하기
                  </button>

                  {/* Pagination - 질문이 있을 때만 표시 */}
                  {questions.length > 0 && (
                    <div className="GatheringDetail_questions-pagination_osk">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            className={`GatheringDetail_pagination-btn_osk ${
                              currentPage === pageNum
                                ? "GatheringDetail_active_osk"
                                : ""
                            }`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* 멤버 섹션 */}
              <div
                id="GatheringDetail_members_osk"
                className="GatheringDetail_detail-section_osk"
              >
                <div className="GatheringDetail_section-header_osk">
                  <h3 className="GatheringDetail_section-title_osk">
                    함께하는 멤버들을 알려드릴게요
                  </h3>
                </div>

                <div className="GatheringDetail_members-slider-container_osk">
                  <Slider
                    dots={totalMembers > 3} // 멤버가 3명 초과일 때만 dots 표시
                    infinite={false}
                    speed={500}
                    slidesToShow={Math.min(3, totalMembers)} // 최대 3명까지 표시, 멤버가 적으면 멤버 수만큼
                    slidesToScroll={1}
                    arrows={totalMembers > 3} // 멤버가 3명 초과일 때만 화살표 표시
                    prevArrow={<CustomPrevArrow show={totalMembers > 3} />}
                    nextArrow={<CustomNextArrow show={totalMembers > 3} />}
                  >
                    {gatheringData.members.map((member) => (
                      <div
                        key={member.id}
                        className="GatheringDetail_member-slide_osk"
                      >
                        <div className="GatheringDetail_member-card_osk">
                          <div className="GatheringDetail_member-avatar_osk">
                            <img
                                src={member.profileImage || aImage}
                                alt={`${member.name} 프로필`}
                              className="GatheringDetail_member-profile-image_osk"
                            />
                          </div>
                          <div className="GatheringDetail_member-info_osk">
                            <h4 className="GatheringDetail_member-name_osk">
                              {member.name}
                              <span className="GatheringDetail_verified_osk">
                                ○
                              </span>
                            </h4>
                            <p className="GatheringDetail_member-description_osk">
                              {member.introduction}
                            </p>
                            <span className="GatheringDetail_more-text_osk">
                              더보기
                              <BiChevronRight />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>

              {/* 추천 섹션 */}
              <div
                id="GatheringDetail_recommendations_osk"
                className="GatheringDetail_section-header_osk"
              >
                <h3 className="GatheringDetail_section-title_osk">
                  함께하면 좋을 모임을 찾아드려요
                </h3>
              </div>
              <div className="GatheringDetail_recommendations_osk">
                {recommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="GatheringDetail_recommendation-card_osk"
                  >
                    <img
                      src={aImage}
                      alt="추천 모임"
                      className="GatheringDetail_card-image_osk"
                    />
                    <div className="GatheringDetail_card-content_osk">
                      <div className="GatheringDetail_card-category_osk">
                        {recommendation.category}
                      </div>
                      <div className="GatheringDetail_card-title_osk">
                        {recommendation.title}
                      </div>
                      <div className="GatheringDetail_card-info_osk">
                        📅 {recommendation.date}
                        <br />
                        👥 {recommendation.participants}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* 오른쪽 사이드바 */}
          <aside className="GatheringDetail_sidebar_osk">
            <div className="GatheringDetail_gathering-card_osk">
              <div className="GatheringDetail_status-badges_osk">
                <span className="GatheringDetail_badge_osk GatheringDetail_badge-category_osk">
                  {getCategoryInfo(gatheringData.categoryId, gatheringData.subCategoryId)}
                </span>
                <span className="GatheringDetail_badge_osk GatheringDetail_badge-location_osk">
                  {gatheringData.locName}
                </span>
              </div>

              <h1 className="GatheringDetail_gathering-title_osk">
                {gatheringData.title}
              </h1>

              <div className="GatheringDetail_info-row_osk">
                <span className="GatheringDetail_info-icon_osk">
                  <CiCalendar />
                </span>
                <span>{formatDate(gatheringData.meetingDate)}</span>
              </div>

              <div className="GatheringDetail_info-row_osk">
                <span className="GatheringDetail_info-icon_osk">
                  <CiClock1 />
                </span>
                <span>
                  {formatTime(gatheringData.startTime)} - {formatTime(gatheringData.endTime)}
                </span>
              </div>

              <div className="GatheringDetail_info-row_osk">
                <span className="GatheringDetail_info-icon_osk">
                  <GoPeople />
                </span>
                <span>
                  {members.length}명 참가 중 (최소{" "}
                  {gatheringData.minAttendees}명, 최대{" "}
                  {gatheringData.maxAttendees}명)
                </span>
              </div>

              <div className="GatheringDetail_info-row_osk">
                <span className="GatheringDetail_info-icon_osk">
                  <CiLocationOn />
                </span>
                <span>{gatheringData.address} {gatheringData.detailAddress}</span>
              </div>

              {/* 태그 표시 */}
              {gatheringData.tags && gatheringData.tags.length > 0 && (
                <div className="GatheringDetail_tags_osk">
                  {gatheringData.tags.map((tag, index) => (
                    <span key={index} className="GatheringDetail_tag_osk">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="GatheringDetail_button-group_osk">
                <button
                  className="GatheringDetail_btn_osk GatheringDetail_btn-outline_osk"
                  onClick={handleWishlistClick}
                >
                  <CiHeart className="GatheringDetail_top-icon_osk" /> 찜하기
                </button>
                <button
                  className="GatheringDetail_btn_osk GatheringDetail_btn-apply_osk"
                  id="GatheringDetail_apply_osk"
                  onClick={handleJoinClick}
                >
                  신청하기
                </button>
              </div>
              <div className="GatheringDetail_notice-text_osk">
                신청 마감: {formatDate(gatheringData.applyDeadline)}까지
              </div>
            </div>
          </aside>
        </div>

        {/* 질문하기 모달 */}
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
                src={gatheringData.thumbnailFileName ? `${url}/uploads/${gatheringData.thumbnailFileName}` : aImage}
                alt="모임 이미지"
                className="GatheringDetail_gathering-image_osk"
              />
              <div className="GatheringDetail_gathering-details_osk">
                <div className="GatheringDetail_gathering-info-item_osk">
                  <CiCalendar className="GatheringDetail_gathering-info-icon_osk" />
                  <span>모임일: {formatDate(gatheringData.meetingDate)} {formatTime(gatheringData.startTime)}</span>
                </div>
                <div className="GatheringDetail_gathering-info-item_osk">
                  <GoPeople className="GatheringDetail_gathering-info-icon_osk" />
                  <span>인원: {members.length}/{gatheringData.maxAttendees}명 (최소 {gatheringData.minAttendees}명)</span>
                </div>
                <div className="GatheringDetail_gathering-info-item_osk">
                  <CiLocationOn className="GatheringDetail_gathering-info-icon_osk" />
                  <span>장소: {gatheringData.address} {gatheringData.detailAddress}</span>
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
                질문 제목
              </label>
              <input
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="질문의 내용"
                className="GatheringDetail_input-field_osk"
              />
            </div>

            <div className="GatheringDetail_input-section_osk">
              <label className="GatheringDetail_input-label_osk">
                상세 내용
              </label>
              <textarea
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                placeholder="질문사항에 대해 자세히 알려주세요"
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
            <button
              className="GatheringDetail_modal-btn_osk GatheringDetail_modal-btn-submit_osk"
              onClick={handleQuestionSubmit}
            >
              질문하기
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}