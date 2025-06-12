import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyGatheringList.css";
import { CiSearch } from "react-icons/ci";

const dummyData = [
  {
    id: 1,
    title: "모임명",
    date: "2023년 11월 25일 (토)",
    time: "오전 9:00 - 오후 3:00",
    location: "서울대입구역 2호선(서울 관악구 봉천동 979-2)",
    region: "서울/성동구/상왕십리동",
    category: "요리/베이킹",
    tags: ["독서", "대화", "브랜딩", "봉사활동", "명상"],
    description: "강남 숨은 맛집을 함께 찾아다니며 맛있는 음식을 즐겨요!",
    status: "진행 예정",
    thumbnail: "/img/sample.jpg",
    deadline: "2023년 11월 23일까지",
    cancelable: true,
    participants: "8/15명 참가 중 (최소 10명 ~ 최대 48명)",
    applicants: {
      pending: [
        {
          name: "책벌레",
          intro: "안녕하세요! 독서를 좋아하는 20대 직장인입니다. 주말에 책을 읽으며 좋은 시간을 보내고 싶습니다.",
          tags: ["소설", "에세이", "인문학"],
        },
        {
          name: "책벌레",
          intro: "안녕하세요! 독서를 좋아하는 20대 직장인입니다. 주말에 책을 읽으며 좋은 시간을 보내고 싶습니다.",
          tags: ["소설", "에세이", "인문학"],
        },
      ],
      accepted: [
        {
          name: "산행자",
          intro: "등산과 아웃도어 활동을 즐깁니다. 주말에 좋은 사람들과 함께 즐거운 시간을 보내고 싶습니다.",
          tags: ["등산", "명상", "여행"],
        },
      ],
      rejected: [
        {
          name: "산행자",
          intro: "등산과 아웃도어 활동을 즐깁니다. 주말에 좋은 사람들과 함께 즐거운 시간을 보내고 싶습니다.",
          tags: ["등산", "명상", "여행"],
        },
      ],
    },
  },
  {
    id: 2,
    title: "모임명",
    date: "2023년 11월 25일 (토)",
    time: "오전 9:00 - 오후 3:00",
    location: "서울대입구역 2호선(서울 관악구 봉천동 979-2)",
    region: "서울/성동구/상왕십리동",
    category: "요리/베이킹",
    tags: ["독서", "대화", "브랜딩", "봉사활동", "명상"],
    description: "강남 숨은 맛집을 함께 찾아다니며 맛있는 음식을 즐겨요!",
    status: "진행 완료",
    thumbnail: "/img/sample.jpg",
    deadline: "2023년 11월 23일까지",
    cancelable: true,
    participants: "8/15명 참가 중 (최소 10명 ~ 최대 48명)",
    applicants: {
      pending: [],
      accepted: [
        {
          name: "산행자",
          intro: "등산과 아웃도어 활동을 즐깁니다.",
          tags: ["등산", "명상", "여행"],
        },
      ],
      rejected: [],
    },
  },
  {
    id: 3,
    title: "모임명",
    date: "2023년 11월 25일 (토)",
    time: "오전 9:00 - 오후 3:00",
    location: "서울대입구역 2호선(서울 관악구 봉천동 979-2)",
    region: "서울/성동구/상왕십리동",
    category: "요리/베이킹",
    tags: ["독서", "대화", "브랜딩", "봉사활동", "명상"],
    description: "강남 숨은 맛집을 함께 찾아다니며 맛있는 음식을 즐겨요!",
    status: "취소된 모임",
    thumbnail: "/img/sample.jpg",
    deadline: "2023년 11월 23일까지",
    cancelable: true,
    participants: "8/15명 참가 중 (최소 10명 ~ 최대 48명)",
    applicants: {
      pending: [],
      accepted: [],
      rejected: [],
    },
  },
];

export default function MyGatheringList() {
  const [filter, setFilter] = useState("전체");
  const [activeAccordion, setActiveAccordion] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleAccordion = (id) =>
    setActiveAccordion(activeAccordion === id ? "" : id);

  const getFilteredData = () => {
    let filtered = filter === "전체" ? dummyData : dummyData.filter((d) => d.status === filter);
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
    <div className="MyGatheringList_mypage-wrapper_osk">
      {/* <aside className="MyGatheringList_sidebar_osk">
        <div className="MyGatheringList_profile_osk">
          <img src="/img/profile.png" alt="프로필" />
          <div className="MyGatheringList_username_osk">USERNAME</div>
          <Button color="warning">마이페이지</Button>
          <Button color="secondary">로그아웃</Button>
        </div>
        <nav className="MyGatheringList_menu_osk">
          <div className="MyGatheringList_menu-section_osk">
            <strong>클래스 신청</strong>
            <div>수강 클래스</div>
            <div>관심 내역</div>
          </div>
          <div className="MyGatheringList_menu-section_osk">
            <strong>게더링</strong>
            <div>참여한 게더링</div>
            <div>개설한 게더링</div>
            <div>세팅 승인</div>
          </div>
          <div className="MyGatheringList_menu-section_osk">
            <strong>소셜링</strong>
            <div>찜한 피드</div>
            <div>작성 목록</div>
            <div>댓글 목록</div>
          </div>
          <div className="MyGatheringList_menu-section_osk">
            <strong>회원정보</strong>
            <div>마이 북마크</div>
            <div>포인트 내역</div>
            <div>회원 정보 수정</div>
            <div>고객센터</div>
          </div>
        </nav>
      </aside> */}

      <main className="MyGatheringList_gathering-main_osk">
        <div className="MyGatheringList_gathering-header_osk">
          <h3>게더링 목록</h3>
          <div className="MyGatheringList_search-container_osk">
            <input
              type="text"
              placeholder="이름으로 검색"
              className="MyGatheringList_search-input_osk"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CiSearch className="MyGatheringList_search-icon_osk" />
          </div>
        </div>

        <div className="MyGatheringList_tabs_osk">
          {["전체", "진행 예정", "진행 완료", "취소된 모임"].map((tab) => (
            <button
              key={tab}
              className={`MyGatheringList_tab_osk ${filter === tab ? "MyGatheringList_active_osk" : ""}`}
              onClick={() => {
                setFilter(tab);
                setPage(1);
              }}
            >
              {tab} ({getStatusCount(tab)})
            </button>
          ))}
        </div>

        <Accordion
          open={activeAccordion}
          toggle={toggleAccordion}
          className="MyGatheringList_gathering-list_osk"
        >
          {paginated.map((item) => (
            <AccordionItem key={item.id}>
              <AccordionHeader targetId={String(item.id)}>
                <div className="MyGatheringList_card-summary_osk">
                  <img
                    src={item.thumbnail}
                    alt="thumbnail"
                    className="MyGatheringList_thumbnail_osk"
                  />
                  <div className="MyGatheringList_summary-content_osk">
                    <div className="MyGatheringList_badge-row_osk">
                      <span className="MyGatheringList_badge_osk MyGatheringList_orange_osk">{item.category}</span>
                      <span className="MyGatheringList_badge_osk MyGatheringList_blue_osk">{item.region}</span>
                    </div>
                    <h4 className="MyGatheringList_gathering-title_osk">{item.title}</h4>
                    <div className="MyGatheringList_meta_osk">
                      <div className="MyGatheringList_meta-row_osk">
                        <span className="MyGatheringList_meta-icon_osk">🗓️</span>
                        <span>신청 마감: 2023년 11월 23일까지</span>
                      </div>
                      <div className="MyGatheringList_meta-row_osk">
                        <span className="MyGatheringList_meta-icon_osk">🕘</span>
                        <span>참석 가능: 주말 2시간 전체</span>
                      </div>
                      <div className="MyGatheringList_meta-row_osk">
                        <span className="MyGatheringList_meta-icon_osk">👥</span>
                        <span>{item.participants}</span>
                      </div>
                      <div className="MyGatheringList_meta-row_osk">
                        <span className="MyGatheringList_meta-icon_osk">📍</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <p className="MyGatheringList_description_osk">{item.description}</p>
                    <div className="MyGatheringList_tags_osk">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="MyGatheringList_tag_osk">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="MyGatheringList_actions_osk">
                      <Button className="MyGatheringList_btn-cancel_osk">모임 취소</Button>
                      <Button className="MyGatheringList_btn-edit_osk">수정하기</Button>
                    </div>
                  </div>
                </div>
              </AccordionHeader>
              <AccordionBody accordionId={String(item.id)}>
                <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_yellow_osk">
                  <h5 className="MyGatheringList_section-title_osk">미처리 ({item.applicants.pending.length})</h5>
                  {item.applicants.pending.map((applicant, i) => (
                    <div className="MyGatheringList_applicant_osk" key={i}>
                      <div className="MyGatheringList_info_osk">
                        <strong className="MyGatheringList_applicant-name_osk">{applicant.name}</strong>
                        <p className="MyGatheringList_applicant-intro_osk">{applicant.intro}</p>
                        <div className="MyGatheringList_applicant-tags_osk">
                          {applicant.tags.map((t, idx) => (
                            <span className="MyGatheringList_tag_osk" key={idx}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="MyGatheringList_btn-group_osk">
                        <Button className="MyGatheringList_btn-accept_osk">수락</Button>
                        <Button className="MyGatheringList_btn-reject_osk">거절</Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_green_osk">
                  <h5 className="MyGatheringList_section-title_osk">수락됨 ({item.applicants.accepted.length})</h5>
                  {item.applicants.accepted.map((applicant, i) => (
                    <div className="MyGatheringList_applicant_osk" key={i}>
                      <div className="MyGatheringList_info_osk">
                        <strong className="MyGatheringList_applicant-name_osk">{applicant.name}</strong>
                        <p className="MyGatheringList_applicant-intro_osk">{applicant.intro}</p>
                        <div className="MyGatheringList_applicant-tags_osk">
                          {applicant.tags.map((t, idx) => (
                            <span className="MyGatheringList_tag_osk" key={idx}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button className="MyGatheringList_btn-remove_osk">내보내기</Button>
                    </div>
                  ))}
                </div>
                
                <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_red_osk">
                  <h5 className="MyGatheringList_section-title_osk">거절함 ({item.applicants.rejected.length})</h5>
                  {item.applicants.rejected.map((applicant, i) => (
                    <div className="MyGatheringList_applicant_osk" key={i}>
                      <div className="MyGatheringList_info_osk">
                        <strong className="MyGatheringList_applicant-name_osk">{applicant.name}</strong>
                        <p className="MyGatheringList_applicant-intro_osk">{applicant.intro}</p>
                        <div className="MyGatheringList_applicant-tags_osk">
                          {applicant.tags.map((t, idx) => (
                            <span className="MyGatheringList_tag_osk" key={idx}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button className="MyGatheringList_btn-accept_osk">수락</Button>
                    </div>
                  ))}
                </div>
              </AccordionBody>
            </AccordionItem>
          ))}
        </Accordion>

        {pageCount > 1 && (
          <div className="MyGatheringList_pagination_osk">
            {Array.from({ length: pageCount }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={page === idx + 1 ? "MyGatheringList_active_osk" : ""}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}