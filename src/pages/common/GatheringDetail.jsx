import React, { useState, useEffect, memo, useRef } from "react";
import { CiHeart } from "react-icons/ci";
import { BiChevronRight, BiChevronDown } from "react-icons/bi";
import {
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button, 
  Carousel, 
  CarouselItem, 
  CarouselControl, 
  CarouselIndicators
} from "reactstrap";
import "./GatheringDetail.css";
import { FaRegCalendar } from "react-icons/fa";
import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import aImage from "/detail2.png";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
// 카카오 맵 컴포넌트
const KakaoMap = memo(({
  address = "서울대입구역 2호선(서울 관악구 봉천동 979-2)",
  width = "100%",
  height = "300px",
  level = 3,
  showMarker = true,
  showControls = true,
}) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [centerCoords, setCenterCoords] = useState(null);

  // 주소를 좌표로 변환하는 함수
  const geocodeAddress = async (address) => {
    try {
      setLoading(true);

      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        throw new Error("카카오 맵 서비스가 로드되지 않았습니다.");
      }

      return new Promise((resolve, reject) => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = {
              latitude: parseFloat(result[0].y),
              longitude: parseFloat(result[0].x),
            };
            resolve(coords);
          } else {
            // 주소 검색 실패 시 기본 좌표 (서울 시청) 사용
            resolve({
              latitude: 37.5666805,
              longitude: 126.9784147,
            });
          }
        });
      });
    } catch (err) {
      console.error("주소 변환 오류:", err);
      // 오류 발생 시 기본 좌표 반환
      return {
        latitude: 37.5666805,
        longitude: 126.9784147,
      };
    }
  };

  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("카카오 맵 API가 로드되지 않았습니다.");
        setError("카카오 맵 API를 로드할 수 없습니다.");
        setLoading(false);
        return;
      }

      if (!centerCoords) return;

      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(
            centerCoords.latitude,
            centerCoords.longitude
          ),
          level: level,
        };

        const mapInstance = new window.kakao.maps.Map(
          mapContainer.current,
          options
        );

        if (showMarker) {
          // 마커 생성
          const markerPosition = new window.kakao.maps.LatLng(
            centerCoords.latitude,
            centerCoords.longitude
          );
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          // 마커를 지도에 표시
          marker.setMap(mapInstance);

          // 인포윈도우 생성
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px; font-size:12px;">${address}</div>`,
          });

          // 마커에 클릭 이벤트 등록
          window.kakao.maps.event.addListener(marker, "click", () => {
            infowindow.open(mapInstance, marker);
          });
        }

        // 지도 컨트롤 추가
        if (showControls) {
          // 줌 컨트롤 추가
          const zoomControl = new window.kakao.maps.ZoomControl();
          mapInstance.addControl(
            zoomControl,
            window.kakao.maps.ControlPosition.RIGHT
          );
        }

        setMap(mapInstance);
        setLoading(false);
      });
    };

    initializeMap();
  }, [centerCoords, level, showMarker, showControls, address]);

  // 주소가 변경될 때마다 좌표 변환
  useEffect(() => {
    const loadCoordinates = async () => {
      if (address) {
        try {
          const coords = await geocodeAddress(address);
          setCenterCoords(coords);
          setError(null);
        } catch (err) {
          setError("주소를 찾을 수 없습니다.");
          console.error("주소 변환 오류:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCoordinates();
  }, [address]);

  // 카카오 맵 API 스크립트 로드
  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    if (document.querySelector('script[src*="dapi.kakao.com"]')) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    // 지오코딩 서비스를 사용하기 위해 services 라이브러리 추가
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d5da5075e3807c37906c708e46d9cb11&autoload=false&libraries=services`;
    document.head.appendChild(script);
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">지도를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-red-50 rounded-lg border border-red-200"
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-red-500 text-lg mb-1">📍</div>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width, height }}>
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg border border-gray-200"
        style={{ width: "100%", height: "100%" }}
      />
      {centerCoords && (
        <div className="mt-2 text-xs text-gray-500">📍 {address}</div>
      )}
    </div>
  );
});

const handleJoinClick = () => {
  console.log("참가 신청하기 클릭");
};

const handleWishlistClick = () => {
  console.log("찜하기 클릭");
};

export default function GatheringDetail() {
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

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Carousel 관련 함수들
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === Math.ceil(gatheringData.members.length / 3) - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? Math.ceil(gatheringData.members.length / 3) - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  // 멤버를 3개씩 그룹으로 나누는 함수
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  
  // 샘플 데이터
  const gatheringData = {
    id: 487893,
    title: "모임명",
    additionalInfo:
      "모든 연령대가 즐길 수 있는 루미큐브부터 전략적인 보드게임까지 다양하게 준비되어 있습니다. 게임을 통해 서로 소통하고 친해질 수 있는 좋은 기회입니다.",
    detailedDescription: `보드게임은 단순한 놀이를 넘어서 사람들 간의 소통과 교감을 이끌어내는 훌륭한 매개체입니다. 우리 모임에서는 다양한 장르의 보드게임을 통해 참가자들이 자연스럽게 어울릴 수 있는 환경을 제공합니다.
  
  초보자를 위한 배려도 빼놓지 않았습니다. 게임 룰을 모르시는 분들을 위해 경험이 풍부한 운영진과 기존 멤버들이 친절하게 안내해드립니다. 복잡해 보이는 전략 게임도 차근차근 설명해드리니 걱정하지 마세요.
  
  우리가 준비한 게임들은 다음과 같습니다. 먼저 가족 단위나 초보자들이 쉽게 접근할 수 있는 루미큐브, 우노, 할리갈리 같은 가벼운 게임부터 시작합니다. 이런 게임들은 룰이 간단하면서도 재미있어서 처음 만나는 사람들과도 금세 친해질 수 있습니다.
  
  중급자들을 위해서는 스플렌더, 킹도미노, 아줄 같은 전략적 사고가 필요한 게임들을 준비했습니다. 이러한 게임들은 단순한 운에만 의존하지 않고 계획과 전략이 중요해서 더욱 깊이 있는 재미를 제공합니다.
  
  고급자들을 위한 무거운 게임들도 물론 있습니다. 테라포밍 마스, 윙스팬, 그레이트 웨스턴 트레일 같은 게임들은 복잡한 시스템과 깊이 있는 전략이 필요하지만, 그만큼 성취감과 만족도가 높습니다.
  
  모임의 분위기는 경쟁적이기보다는 화합을 중시합니다. 승부보다는 함께 즐기는 것이 우선이며, 서로 도움을 주고받으며 게임을 배워나가는 과정 자체를 소중히 여깁니다.
  
  카페 환경도 보드게임을 즐기기에 최적화되어 있습니다. 넓은 테이블과 편안한 의자, 적절한 조명이 갖춰져 있어 오랜 시간 게임을 해도 피로하지 않습니다. 또한 다양한 음료와 간단한 간식도 제공되어 게임 중간중간 휴식을 취하며 대화를 나눌 수 있습니다.
  
  정기적으로 참여하시는 분들을 위한 특별한 혜택도 준비되어 있습니다. 월 정기 모임 참가자들에게는 할인 혜택을 제공하며, 생일이나 특별한 날에는 깜짝 이벤트도 진행합니다.
  
  새로운 게임 소개도 정기적으로 이루어집니다. 매월 새로운 게임을 체험해볼 수 있는 시간을 마련하여 지루할 틈이 없습니다. 해외에서 새로 출시된 게임이나 크라우드펀딩을 통해 화제가 된 게임들도 빠르게 도입하여 소개해드립니다.`,
    firstCategory: "스포츠",
    secondCategory: "실내 & 수상 스포츠",
    location: "서울/성동구/상왕십리동",
    locationDetail: "서울대입구역 2호선(서울 관악구 봉천동 979-2)",
    date: "2023년 11월 25일 (토)",
    time: "오전 9:00 - 오후 3:00",
    maxParticipants: 48,
    minParticipants: 10,
    host: {
      name: "모임장",
      profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=🎨",
      fallowers: 120,
      introduction: "안녕하세요! 저는 모임장입니다. 다양한 활동을 함께 즐겨요!",
      likeCategory: "스포츠, 여행, 문화",
      tags: ["독서", "대화", "브랜딩", "봉사활동", "맛집"],
    },
    members: [
      {
        id: 1,
        name: "닉네임1",
        profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=👤",
        introduction:
          "자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기",
      },
      {
        id: 2,
        name: "닉네임2",
        profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=👤",
        introduction:
          "자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기",
      },
      {
        id: 3,
        name: "닉네임3",
        profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=👤",
        introduction:
          "자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기",
      },
      {
        id: 4,
        name: "닉네임4",
        profileImage: "https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=👤",
        introduction:
          "자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기자기소개자기소개자기소개자기소개자기",
      },
    ],
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

  // 텍스트를 문단으로 나누는 함수
  const splitTextIntoParagraphs = (text) => {
    return text.split("\n\n").filter((paragraph) => paragraph.trim() !== "");
  };

  // 미리보기 텍스트 길이 설정 (문자 수 기준)
  const PREVIEW_LENGTH = 500;

  // 전체 상세 설명 텍스트
  const fullDescription = gatheringData.detailedDescription;
  const descriptionParagraphs = splitTextIntoParagraphs(fullDescription);

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

  // 멤버 그룹 생성 (3개씩)
  const memberGroups = chunkArray(gatheringData.members, 3);

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
    <div className="GatheringDetail_gathering-detail_osk">
      {/* 메인 컨테이너 */}
      <div className="GatheringDetail_main-container_osk">
        {/* 왼쪽 메인 컨텐츠 */}
        <main className="GatheringDetail_main-content_osk">
          {/* 이미지 섹션 */}
          <div className="GatheringDetail_image-section_osk">
            <img
              src={aImage}
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
                  activeTab === "questions" ? "GatheringDetail_active_osk" : ""
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
                {gatheringData.title}
              </p>
              <img
                src={aImage}
                alt="상세 이미지"
                className="w-full max-w-md mx-auto my-4 rounded-lg shadow-md"
              />
              <p className="mb-4 text-gray-700 leading-relaxed">
                {gatheringData.additionalInfo}
              </p>
              {/* 더보기 기능 적용 부분 */}
              {!isExpanded && shouldShowMoreButton && (
                <>
                  {/* 미리보기 텍스트 */}
                  <div className="mb-4 text-gray-700 leading-relaxed whitespace-pre-line">
                    {previewText}
                  </div>
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
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
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
                  <span className="GatheringDetail_info-label_osk">준비물</span>
                  <span className="GatheringDetail_info-value_osk">
                    편안한 복장, 개인 음료, 간단한 간식 (선택사항)
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  {/* 카카오 맵 적용 */}
                  <KakaoMap
                    address={gatheringData.locationDetail}
                    width="100%"
                    height="300px"
                    level={3}
                    showMarker={true}
                    showControls={true}
                  />
                  <p className="mt-3 text-gray-700 font-medium">
                    {gatheringData.location} {gatheringData.locationDetail}
                  </p>
                </div>
              </div>
              <p className="GatheringDetail_description_osk">
                {gatheringData.location} {gatheringData.locationDetail}
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
                    src={aImage}
                    alt="모임장"
                    className="GatheringDetail_host-profile-image_osk"
                  />
                </div>
                <div className="GatheringDetail_host-details_osk">
                  <h4>{gatheringData.host.name}</h4>
                  <div className="GatheringDetail_host-stats_osk">
                    {gatheringData.host.fallowers}
                  </div>
                  <div className="GatheringDetail_host-description_osk">
                    {gatheringData.host.introduction}
                  </div>
                  <div className="GatheringDetail_host-tags_osk">
                    {gatheringData.host.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="GatheringDetail_host-tag_osk"
                      >
                        {tag}
                      </span>
                    ))}
                    {gatheringData.host.tags.length > 5 && (
                      <span className="GatheringDetail_host-tag_osk">
                        +{gatheringData.host.tags.length - 5}
                      </span>
                    )}
                  </div>
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
                              {question.answer.content.map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                              ))}
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
              
              <div className="GatheringDetail_members-carousel-container_osk">
                <Carousel
                  activeIndex={activeIndex}
                  next={next}
                  previous={previous}
                  className="GatheringDetail_members-carousel_osk"
                >
                  <CarouselIndicators
                    items={memberGroups.map((_, index) => ({ key: index }))}
                    activeIndex={activeIndex}
                    onClickHandler={goToIndex}
                  />
                  
                  {memberGroups.map((group, index) => (
                    <CarouselItem
                      onExiting={() => setAnimating(true)}
                      onExited={() => setAnimating(false)}
                      key={index}
                    >
                      <div className="GatheringDetail_members-slide_osk">
                        {group.map((member) => (
                          <div
                            key={member.id}
                            className="GatheringDetail_member-card_osk"
                          >
                            <div className="GatheringDetail_member-avatar_osk">
                              <img
                                src={aImage}
                                alt="멤버"
                                className="GatheringDetail_member-profile-image_osk"
                              />
                            </div>
                            <div className="GatheringDetail_member-info_osk">
                              <h4 className="GatheringDetail_member-name_osk">
                                {member.name}
                                <span className="GatheringDetail_verified_osk">○</span>
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
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                  
                  <CarouselControl
                    direction="prev"
                    directionText="Previous"
                    onClickHandler={previous}
                  />
                  <CarouselControl
                    direction="next"
                    directionText="Next"
                    onClickHandler={next}
                  />
                </Carousel>
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
                스포츠 &gt; 실내 &amp; 수상 스포츠
              </span>
              <span className="GatheringDetail_badge_osk GatheringDetail_badge-location_osk">
                서울/성동구/상왕십리동
              </span>
            </div>

            <h1 className="GatheringDetail_gathering-title_osk">모임명</h1>

            <div className="GatheringDetail_info-row_osk">
              <span className="GatheringDetail_info-icon_osk">
                <CiCalendar />
              </span>
              <span>2023년 11월 25일 (토)</span>
            </div>

            <div className="GatheringDetail_info-row_osk">
              <span className="GatheringDetail_info-icon_osk">
                <CiClock1 />
              </span>
              <span>오전 9:00 - 오후 3:00</span>
            </div>

            <div className="GatheringDetail_info-row_osk">
              <span className="GatheringDetail_info-icon_osk">
                <GoPeople />
              </span>
              <span>
                {gatheringData.members.length}명 참가 중 (최소{" "}
                {gatheringData.minParticipants}명, 최대{" "}
                {gatheringData.maxParticipants}명)
              </span>
            </div>

            <div className="GatheringDetail_info-row_osk">
              <span className="GatheringDetail_info-icon_osk">
                <CiLocationOn />
              </span>
              <span>서울대입구역 2호선(서울 관악구 봉천동 979-2)</span>
            </div>

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
              신청 마감: 2025년 05월 23일까지
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
            서울 도심 카페 탐방
          </span>
        </ModalHeader>
        <ModalBody className="GatheringDetail_modal-body_osk">
          <div className="GatheringDetail_gathering-info_osk">
            <img
              src="/detail2.png"
              alt="카페 이미지"
              className="GatheringDetail_gathering-image_osk"
            />
            <div className="GatheringDetail_gathering-details_osk">
              <div className="GatheringDetail_gathering-info-item_osk">
                <CiCalendar className="GatheringDetail_gathering-info-icon_osk" />
                <span>수업일: 2023년 10월 15일 오후 02:00</span>
              </div>
              <div className="GatheringDetail_gathering-info-item_osk">
                <GoPeople className="GatheringDetail_gathering-info-icon_osk" />
                <span>인원: 6/8명 (최소 4명)</span>
              </div>
              <div className="GatheringDetail_gathering-info-item_osk">
                <CiLocationOn className="GatheringDetail_gathering-info-icon_osk" />
                <span>장소: 서울 강남구 테헤란로 152</span>
              </div>
            </div>
          </div>

          <div className="GatheringDetail_modal-tags_osk">
            <span className="GatheringDetail_modal-tag_osk">카페</span>
            <span className="GatheringDetail_modal-tag_osk">문화</span>
            <span className="GatheringDetail_modal-tag_osk">서울</span>
          </div>

          <div className="GatheringDetail_input-section_osk">
            <label className="GatheringDetail_input-label_osk">질문 제목</label>
            <input
              type="text"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="질문의 내용"
              className="GatheringDetail_input-field_osk"
            />
          </div>

          <div className="GatheringDetail_input-section_osk">
            <label className="GatheringDetail_input-label_osk">상세 내용</label>
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
  );
}