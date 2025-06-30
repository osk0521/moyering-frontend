import React, { useState } from "react";
import { Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyGatheringApplyList.css";
import { CiSearch, CiLocationOn, CiCalendar } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import Sidebar from "../common/Sidebar";
import Header from '../../../common/Header';
import Footer from "../../../../components/Footer";

const isGatheringInFuture = (gatheringDate, gatheringTime) => {
  try {
    // "2024년 10월 25일" 형식을 파싱
    const dateMatch = gatheringDate.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
    if (!dateMatch) return false;
    
    const [, year, month, day] = dateMatch;
    
    // "15:00" 형식을 파싱
    const timeMatch = gatheringTime.match(/(\d{1,2}):(\d{2})/);
    if (!timeMatch) return false;
    
    const [, hours, minutes] = timeMatch;
    
    // 모임 날짜/시간 객체 생성
    const gatheringDateTime = new Date(
      parseInt(year),
      parseInt(month) - 1, // JavaScript Date는 월이 0부터 시작
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    
    // 현재 날짜/시간과 비교
    const now = new Date();
    
    return gatheringDateTime > now;
  } catch (error) {
    console.error('날짜 파싱 오류:', error);
    return false;
  }
};

// 더미 데이터
const dummyData = [
  {
    id: 1,
    title: "서울 도심 카페 탐방",
    description:
      "서울의 숨겨진 카페들을 함께 탐험해봐요. 매주 새로운 카페에서 만나 이야기를 나눠요.",
    status: "수락됨",
    category: "카페",
    date: "2025년 10월 13일",
    time: "14:00",
    location: "서울 강남구 테헤란로 152",
    participants: "참여자 4명 (정원 6명)",
    duration: "약 2시간",
    image: "/api/placeholder/300/200",
    tags: ["카페", "힐링", "수다"],
  },
  {
    id: 2,
    title: "한강 자전거 라이딩",
    description:
      "한강의 아름다운 길을 따라 자전거를 타며 운동해요. 초보자도 환영합니다!",
    status: "수락됨",
    category: "운동",
    date: "2024년 10월 13일",
    time: "10:00",
    location: "서울 영등포구 여의서로 330",
    participants: "참여자 5명 (정원 8명)",
    duration: "약 3시간",
    image: "/api/placeholder/300/200",
    tags: ["운동", "자전거", "한강"],
  },
  {
    id: 3,
    title: "프로그래밍 스터디",
    description:
      "함께 코딩 실력을 늘려가며 다양한 프로젝트를 진행해요. 초보자도 대환영입니다!",
    status: "수락됨",
    category: "스터디",
    date: "2024년 10월 13일",
    time: "19:00",
    location: "서울 서초구 강남대로 373",
    participants: "참여자 3명 (정원 6명)",
    duration: "약 2시간",
    image: "/api/placeholder/300/200",
    tags: ["개발", "스터디", "프로그래밍"],
  },
  {
    id: 4,
    title: "등산 모임",
    description: "맑은 공기와 아름다운 풍경을 만끽하며 건강한 하루를 보내요!",
    status: "거절됨",
    category: "등산",
    date: "2024년 10월 13일",
    time: "06:00",
    location: "서울 종로구 북악산로",
    participants: "참여자 10명 (정원 15명)",
    duration: "약 4시간",
    image: "/api/placeholder/300/200",
    tags: ["등산", "운동", "자연"],
  },
  {
    id: 5,
    title: "서울 도심 카페 탐방",
    description:
      "서울의 숨겨진 카페들을 함께 탐험해봐요. 매주 새로운 카페에서 만나 이야기를 나눠요.",
    status: "대기중",
    category: "카페",
    date: "2024년 10월 25일",
    time: "15:00",
    location: "서울 강남구 테헤란로 152",
    participants: "참여자 6명 (정원 8명)",
    duration: "약 2시간",
    image: "/api/placeholder/300/200",
    tags: ["카페", "힐링", "수다"],
  },
];

export default function MyGatheringApplyList() {
  const [filter, setFilter] = useState("전체");
  const [activeAccordion, setActiveAccordion] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleAccordion = (id) =>
    setActiveAccordion(activeAccordion === id ? "" : id);

  // 참여 취소 처리 함수
  const handleCancelParticipation = (gathering) => {
    const isConfirmed = window.confirm(`'${gathering.title}' 게더링 참여를 정말 취소하시겠습니까?`);
    
    if (isConfirmed) {
      console.log('참여 취소 처리:', gathering);
      
      // 여기에 실제 API 호출 로직을 추가할 수 있습니다
      // 예: cancelGatheringParticipation(gathering.id);
      
      // 성공 메시지 (선택사항)
      alert('참여가 취소되었습니다.');
      
      // 필요하다면 상태 업데이트나 페이지 새로고침 등을 할 수 있습니다
      // window.location.reload(); // 또는 상태 업데이트
    }
  };

  const getFilteredData = () => {
    let filtered =
      filter === "전체"
        ? dummyData
        : dummyData.filter((d) => d.status === filter);
    if (searchTerm) {
      filtered = filtered.filter((d) =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filtered = getFilteredData();
  const paginated = filtered.slice((page - 1) * 5, page * 5);
  const pageCount = Math.ceil(filtered.length / 5);

  const getStatusCount = (status) => {
    if (status === "전체") return dummyData.length;
    return dummyData.filter((d) => d.status === status).length;
  };
  
  return (
    <div>
      <Header />
      <div className="MyGatheringApplyList_mypage-wrapper_osk">
        <Sidebar />
        <main className="MyGatheringApplyList_gathering-main_osk">
          <div className="MyGatheringApplyList_gathering-header_osk">
            <h3>지원한 게더링 목록</h3>
            <div className="MyGatheringApplyList_search-container_osk">
              <input
                type="text"
                placeholder="제목으로 검색"
                className="MyGatheringApplyList_search-input_osk"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CiSearch className="MyGatheringApplyList_search-icon_osk" />
            </div>
          </div>

          <div className="MyGatheringApplyList_tabs_osk">
            {["전체", "수락됨", "대기중", "거절됨"].map((tab) => (
              <button
                key={tab}
                className={`MyGatheringApplyList_tab_osk ${filter === tab ? "MyGatheringApplyList_active_osk" : ""}`}
                onClick={() => {
                  setFilter(tab);
                  setPage(1);
                }}
              >
                {tab} ({getStatusCount(tab)})
              </button>
            ))}
          </div>

          <div className="MyGatheringApplyList_gathering-list_osk">
            {paginated.map((gathering) => (
              <div key={gathering.id} className="MyGatheringApplyList_gathering-list-item_osk">
                <div className="MyGatheringApplyList_gathering-image_osk">
                  <img src={gathering.image} alt={gathering.title} />
                </div>
                <div className="MyGatheringApplyList_gathering-content_osk">
                  <div className="MyGatheringApplyList_gathering-card_osk MyGatheringApplyList_gathering-header_osk">
                      <span
                        className={`MyGatheringApplyList_status-badge_osk ${
                          {
                            "수락됨": "MyGatheringApplyList_accepted_osk",
                            "대기중": "MyGatheringApplyList_pending_osk", 
                            "거절됨": "MyGatheringApplyList_rejected_osk",
                            "취소됨": "MyGatheringApplyList_rejected_osk"
                          }[gathering.status] || ""
                        }`}
                      >
                      {gathering.status}
                    </span>
                    <h4 className="MyGatheringApplyList_gathering-title_osk">{gathering.title}</h4>
                  </div>
                  <p className="MyGatheringApplyList_gathering-description_osk">{gathering.description}</p>
                  <div className="MyGatheringApplyList_gathering-info_osk">
                    <div className="MyGatheringApplyList_info-row_osk">
                      <span className="MyGatheringApplyList_info-label_osk"><CiCalendar /> 개최일:</span>
                      <span className="MyGatheringApplyList_info-value_osk">
                        {gathering.date} {gathering.time}
                      </span>
                    </div>
                    <div className="MyGatheringApplyList_info-row_osk">
                      <span className="MyGatheringApplyList_info-label_osk"><CiLocationOn /> 장소:</span>
                      <span className="MyGatheringApplyList_info-value_osk">{gathering.location}</span>
                    </div>
                    <div className="MyGatheringApplyList_info-row_osk">
                      <span className="MyGatheringApplyList_info-label_osk"><GoPeople /> 참여:</span>
                      <span className="MyGatheringApplyList_info-value_osk">{gathering.participants}</span>
                    </div>
                  </div>
                  <div className="MyGatheringApplyList_gathering-tags_osk">
                    {gathering.tags.map((tag, index) => (
                      <span key={index} className="MyGatheringApplyList_tag_osk">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="MyGatheringApplyList_gathering-actions_osk">
                  {(gathering.status === "수락됨" || gathering.status === "대기중") && 
                  isGatheringInFuture(gathering.date, gathering.time) && (
                    <button 
                      className="MyGatheringApplyList_apply-complete-btn_osk"
                      onClick={() => handleCancelParticipation(gathering)}
                    >
                      참여 취소
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="MyGatheringApplyList_pagination_osk">
              {Array.from({ length: pageCount }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={page === idx + 1 ? "ApplyList_active_osk" : ""}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer/>
    </div>
  );
}