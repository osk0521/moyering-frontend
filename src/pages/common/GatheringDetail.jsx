import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { CiCalendar, CiClock1, CiHeart, CiLocationOn } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { GrNext, GrPrevious } from "react-icons/gr";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios, url } from "../../config";
import { useNavigate } from "react-router-dom";
import KakaoMap from "./KakaoMap";
import "./GatheringDetail.css";
import GatheringDetailInquiry from "./GatheringDetailInquiry";
import Header from "./Header";
import aImage from "/detail2.png";
export default function GatheringDetail() {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const userId = user.id;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [aspirationContent, setAspirationContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 약간의 지연을 두어 스토리지 로딩 완료 대기
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const { gatheringId } = useParams();

  const navigate = useNavigate();
  const handleModifyButtonClick = () => {
    navigate(`/user/gatheringModify/${gatheringId}`);
  };

  useEffect(() => {
    if (!isLoaded) return; // 로딩 완료 전에는 실행하지 않음
    if (token) {
      myAxios(token)
        .get(`/user/detailGathering?gatheringId=${gatheringId}`)
        .then((res) => {
          console.log("추가 데이터 API 응답:", res.data);
          setIsLiked(res.data.isLiked);
          setIsApplied(!res.data.canApply);
        })
        .catch((err) => {
          console.log("에러 발생:", err.response?.status, err.response?.data);
        });
    } else {
      console.log("토큰이 없음 " + token + " user " + user);
    }
  }, [gatheringId, token, isLoaded]);
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
    category: "",
    subCategory: "",
    latitude: 0,
    longitude: 0,
    intrOnln: "",
    status: "",
    locName: "",
    isLiked: "",
    canApply: "",
  });

  const [organizerData, setorganizerData] = useState({
    nickname: "",
    profileImage: "",
    followers: 0,
    intro: "",
    likeCategory: "",
    tags: [],
  });

  //
  const [members, setMembers] = useState([]);

  const handleApplyButtonClick = () => {
    if (!user || !token) {
      if (
        confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/userlogin");
      } else {
        return;
      }
    } else {
      if (isApplied) {
        alert("이미 지원된 게더링입니다.");
        return;
      }
      // 모달 열기
      setIsApplyModalOpen(true);
    }
  };

  // 4. 실제 신청 처리 함수 (모달에서 폼 제출시)
  const handleApplySubmit = async (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!aspirationContent.trim()) {
      alert("호스트에게 남길 말을 입력해주세요.");
      return;
    }

    if (aspirationContent.length > 500) {
      alert("메시지는 500자 이내로 작성해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        gatheringId: parseInt(gatheringId),
        aspiration: aspirationContent.trim(),
      };
      const response = await myAxios(token).post(
        "/user/applyGathering",
        formData
      );

      // 성공 처리
      console.log("API 성공:", response.data);
      setIsApplied(true);
      setIsApplyModalOpen(false);
      setAspirationContent("");
      alert("모임 신청이 완료되었습니다!");
    } catch (error) {
      console.error("신청 처리 중 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleLikeButtonClick = () => {
    if (!user || !token) {
      if (
        confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/userlogin");
      } else {
        return;
      }
    } else {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);

      myAxios(token)
        .post(`/user/toggleGatheringLike?gatheringId=${gatheringId}`)
        .then((res) => {
          console.log("API 성공:", res.data);
          // 서버 응답과 다르다면 다시 설정
          if (Boolean(res.data) !== newLikedState) {
            setIsLiked(Boolean(res.data));
          }
        })
        .catch((err) => {
          console.log("API 에러:", err);
          // 에러 시 원래 상태로 복원
          setIsLiked(!newLikedState);
          alert("처리 중 오류가 발생했습니다.");
        });
    }
  };

  useEffect(() => {
    myAxios()
      .get(`/detailGathering?gatheringId=${gatheringId}`)
      .then((res) => {
        console.log("API Response:", res.data);

        // gathering 데이터 설정
        const gathering = res.data.gathering;
        const organizer = res.data.organizer;
        const member = res.data.member || []; // member 배열 추출
        // const totalLikeNum = res.data.totalLikeNum;
        // tags 필드를 문자열에서 배열로 변환
        let parsedTags = [];
        if (gathering.tags && typeof gathering.tags === "string") {
          try {
            // 문자열 "['독서', '소모임', '홍대']"를 배열로 변환
            const validJsonString = gathering.tags.replace(/'/g, '"');
            parsedTags = JSON.parse(validJsonString);
          } catch (error) {
            console.error("Tags 파싱 오류:", error);
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
          category: gathering.categoryName,
          subCategory: gathering.subCategoryName,
          latitude: gathering.latitude,
          longitude: gathering.longitude,
          intrOnln: gathering.intrOnln,
          status: gathering.status,
          locName: gathering.locName,
        });

        const organizerCategories = organizer
          ? [
              organizer.category1,
              organizer.category2,
              organizer.category3,
              organizer.category4,
              organizer.category5,
            ].filter((category) => category && category.trim() !== "")
          : [];
        setorganizerData({
          nickname: organizer.nickName,
          profileImage: organizer.profile,
          followers: organizer.followers || 0, // followers가 객체가 아닌 숫자값으로 설정
          intro: organizer.intro || "",
          tags: organizerCategories,
        });
        setMembers(
          member.map((m) => ({
            id: m.gatheringApplyId,
            name: m.name,
            profileImage: m.profile ? `${url}/image/${m.profile}` : null,
            introduction: m.intro,
            applyDate: m.applyDate,
            aspiration: m.aspiration,
            isApprove: m.isApprove,
            userId: m.userId,
          }))
        );

        console.log("변환된 tags:", parsedTags);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [gatheringId]);

  const [activeTab, setActiveTab] = useState("details");
  const [isExpanded, setIsExpanded] = useState(false);

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

  const totalMembers = members.length;
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

  // HTML 태그를 제거하고 순수 텍스트만 추출하는 함수
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // HTML 콘텐츠를 지정된 길이로 자르는 함수
  const truncateHtmlContent = (html, maxLength) => {
    const textContent = stripHtmlTags(html);
    if (textContent.length <= maxLength) {
      return html;
    }

    // 텍스트가 길면 간단하게 처리
    const doc = new DOMParser().parseFromString(html, "text/html");
    const textNodes = doc.body.textContent || "";
    const truncatedText = textNodes.substring(0, maxLength) + "...";

    // 기본적인 HTML 구조 유지하면서 텍스트만 자르기
    return `<p>${truncatedText}</p>`;
  };

  // 미리보기 텍스트 길이 설정 (문자 수 기준)
  const PREVIEW_LENGTH = 500;

  // 전체 상세 설명 텍스트 (gatheringContent 사용)
  const fullDescription = gatheringData.gatheringContent || "";

  // HTML 태그를 제거한 순수 텍스트로 길이 판단
  const plainTextContent = stripHtmlTags(fullDescription);

  // 더보기 버튼을 보여줄지 결정 (순수 텍스트 기준)
  const shouldShowMoreButton = plainTextContent.length > PREVIEW_LENGTH;

  // 미리보기용 HTML 콘텐츠
  const previewHtmlContent = shouldShowMoreButton
    ? truncateHtmlContent(fullDescription, PREVIEW_LENGTH)
    : fullDescription;

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekDay})`;
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
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";

    try {
      const date = new Date(dateTimeString);

      if (isNaN(date.getTime())) {
        return "";
      }

      // 날짜 부분만 추출 (YYYY-MM-DD 형식)
      const dateOnly = date.toISOString().split("T")[0];

      // 시간 부분만 추출 (HH:mm 형식)
      const timeOnly = date.toTimeString().slice(0, 5);

      // 기존 함수들 활용
      const formattedDate = formatDate(dateOnly);
      const formattedTime = formatTime(timeOnly);

      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      console.error("날짜 변환 오류:", error);
      return "";
    }
  };
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
  const toggleApplyModal = () => {
    setIsApplyModalOpen(!isApplyModalOpen);
    // 모달 닫을 때 입력값 초기화
    if (isApplyModalOpen) {
      setAspirationContent("");
    }
  };
  const handleExpandClick = () => {
    setIsExpanded(true);
  };
  // 스크롤 위치에 따라 활성 탭 변경
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "details",
        "organizer",
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
                src={`${url}/image?filename=${gatheringData.thumbnailFileName}`}
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
                    activeTab === "organizer" ? "GatheringDetail_active_osk" : ""
                  }`}
                  onClick={() => handleTabClick("organizer")}
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
                  문의
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
                      dangerouslySetInnerHTML={{ __html: previewHtmlContent }}
                    />
                    <button
                      className="GatheringDetail_more_osk"
                      onClick={handleExpandClick}
                    >
                      더보기 <BiChevronDown />
                    </button>
                  </>
                )}

                {(isExpanded || !shouldShowMoreButton) && (
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: gatheringData.gatheringContent,
                    }}
                  />
                )}

                {/* 위치 */}
                <h3
                  className="GatheringDetail_section-title_osk"
                  style={{ marginTop: "32px" }}
                >
                  위치
                </h3>
                <div className="GatheringDetail_map-container_osk">
                  {gatheringData?.latitude && gatheringData?.longitude ? (
                    <KakaoMap
                      latitude={gatheringData.latitude}
                      longitude={gatheringData.longitude}
                      address={`${gatheringData.address} ${gatheringData.detailAddress}`}
                    />
                  ) : (
                    <div>지도를 로드할 데이터를 불러오는 중입니다...</div>
                  )}
                </div>
                <p className="GatheringDetail_description_osk">
                  {gatheringData.address} {gatheringData.detailAddress}
                </p>
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
                {/* 준비물 */}
                {gatheringData.preparationItems && (
                  <>
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
                  </>
                )}
              </div>

              {/* 모임장 섹션 */}
              <div
                id="GatheringDetail_organizer_osk"
                className="GatheringDetail_detail-section_osk"
              >
                <h3 className="GatheringDetail_section-title_osk">
                  같이 할 모임장을 소개해요
                </h3>
                <div className="GatheringDetail_organizer-info_osk">
                  <div className="GatheringDetail_organizer-avatar_osk">
                    <img
                      src={`${url}/image?filename=${organizerData.profileImage}`}
                      alt={organizerData.nickname}
                      className="GatheringDetail_organizer-profile-image_osk"
                    />
                  </div>
                  <div className="GatheringDetail_organizer-details_osk">
                    <h4>{organizerData.nickname}</h4>
                    <div className="GatheringDetail_organizer-stats_osk">
                      팔로워 {organizerData.followers}명
                    </div>
                    <div className="GatheringDetail_organizer-description_osk">
                      {organizerData.intro}
                    </div>
                    {organizerData.tags && organizerData.tags.length > 0 && (
                      <div className="GatheringDetail_organizer-tags_osk">
                        {organizerData.tags.slice(0, 5).map((tag, index) => (
                          <span
                            key={index}
                            className="GatheringDetail_organizer-tag_osk"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 문의 섹션 */}
              <div
                id="GatheringDetail_questions_osk"
                className="GatheringDetail_detail-section_osk"
              >
                <h3 className="GatheringDetail_section-title_osk">문의</h3>
                <GatheringDetailInquiry gatheringId={gatheringId} />
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

                {members.length === 0 ? (
                  <div className="GatheringDetail_no-members_osk">
                    <p>아직 참가한 멤버가 없습니다.</p>
                  </div>
                ) : (
                  <div className="GatheringDetail_members-slider-container_osk">
                    <Slider
                      dots={totalMembers > 3}
                      infinite={false}
                      speed={500}
                      slidesToShow={Math.min(3, totalMembers)}
                      slidesToScroll={1}
                      arrows={totalMembers > 3}
                      prevArrow={<CustomPrevArrow show={totalMembers > 3} />}
                      nextArrow={<CustomNextArrow show={totalMembers > 3} />}
                    >
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="GatheringDetail_member-slide_osk"
                        >
                          <div className="GatheringDetail_member-card_osk">
                            <div className="GatheringDetail_member-avatar_osk">
                              <img
                                src={`${url}/image?filename=${member.profileImage}`}
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
                )}
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
                  {gatheringData.category} &gt; {gatheringData.subCategory}
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
                  {formatTime(gatheringData.startTime)} -{" "}
                  {formatTime(gatheringData.endTime)}
                </span>
              </div>

              <div className="GatheringDetail_info-row_osk">
                <span className="GatheringDetail_info-icon_osk">
                  <GoPeople />
                </span>
                <span>
                  {members.length}명 참가 중 (최소 {gatheringData.minAttendees}
                  명, 최대 {gatheringData.maxAttendees}명)
                </span>
              </div>

              <div className="GatheringDetail_info-row_osk">
                <span className="GatheringDetail_info-icon_osk">
                  <CiLocationOn />
                </span>
                <span>
                  {gatheringData.address} {gatheringData.detailAddress}
                </span>
              </div>

              <div className="GatheringDetail_button-group_osk">
                <button
                  className="GatheringDetail_btn_osk GatheringDetail_btn-outline_osk"
                  onClick={handleLikeButtonClick}
                >
                  {isLiked ? (
                    <>
                      <FaHeart className="GatheringDetail_top-icon_osk GatheringDetail_liked_osk" />{" "}
                      찜해제
                    </>
                  ) : (
                    <>
                      <CiHeart className="GatheringDetail_top-icon_osk" />{" "}
                      찜하기
                    </>
                  )}
                </button>

                {/* userId와 gatheringData.userId가 일치하는지 확인하여 버튼 변경 */}
                {userId === gatheringData.userId ? (
                  <button
                    className="GatheringDetail_btn_osk GatheringDetail_btn-modify_osk"
                    id="GatheringDetail_modify_osk"
                    onClick={handleModifyButtonClick}
                  >
                    수정하기
                  </button>
                ) : (
                  <button
                    className="GatheringDetail_btn_osk GatheringDetail_btn-apply_osk"
                    id="GatheringDetail_apply_osk"
                    onClick={handleApplyButtonClick}
                  >
                    신청하기
                  </button>
                )}
              </div>
              <div className="GatheringDetail_notice-text_osk">
                신청 마감: {formatDateTime(gatheringData.applyDeadline)}까지
              </div>
            </div>
          </aside>
        </div>
      </div>
      {isApplyModalOpen && (
        <Modal
          isOpen={isApplyModalOpen}
          toggle={toggleApplyModal}
          className="GatheringDetail_apply-modal_osk"
          size="lg"
          centered
        >
          <form onSubmit={handleApplySubmit}>
            {" "}
            {/* ← onSubmit 위치 수정 */}
            <ModalHeader
              toggle={toggleApplyModal}
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
                      제목: {gatheringData.title} <br />
                    </span>
                  </div>

                  <div className="GatheringDetail_gathering-info-item_osk">
                    <span>
                      소개: {gatheringData.introOnline} <br />
                    </span>
                  </div>
                  <div className="GatheringDetail_gathering-info-item_osk">
                    <CiCalendar className="GatheringDetail_gathering-info-icon_osk" />
                    <span>
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
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="GatheringDetail_input-section_osk">
                <label
                  htmlFor="aspiration-textarea"
                  className="GatheringDetail_input-label_osk"
                >
                  호스트에게 남기고 싶은 말{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  id="aspiration-textarea"
                  value={aspirationContent}
                  onChange={(e) => setAspirationContent(e.target.value)}
                  placeholder="호스트에게 남기고 싶은 말을 적어주세요"
                  rows={6}
                  className="GatheringDetail_textarea-field_osk"
                  maxLength={500}
                  required
                  disabled={isSubmitting}
                />
                <small className="GatheringDetail_char-count_osk">
                  {aspirationContent.length}/500자
                </small>
              </div>
            </ModalBody>
            <ModalFooter className="GatheringDetail_modal-footer_osk">
              <button
                type="button"
                className="GatheringDetail_modal-btn_osk GatheringDetail_modal-btn-cancel_osk"
                onClick={toggleApplyModal}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="GatheringDetail_modal-btn_osk GatheringDetail_modal-btn-submit_osk"
                disabled={isSubmitting || !aspirationContent.trim()}
              >
                {isSubmitting ? "신청 중..." : "신청하기"}
              </button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
}