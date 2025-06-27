import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyGatheringList.css";
import { CiSearch } from "react-icons/ci";
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from "../common/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../../../atoms";
import { myAxios, url } from "../../../../config";

export default function MyGatheringList() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [token,setToken] = useAtom(tokenAtom);
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedGatheringId, setSelectedGatheringId] = useState();
  const [gatheringList, setGatheringList] = useState([]);
  const [applyList, setApplyList] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState("");
  const categorizeApplicants = (applyList) => {
    const pending = [];
    const accepted = [];
    const rejected = [];

    applyList.forEach(applicant => {
      const applicantData = {
        nickName: applicant.nickName,
        intro: applicant.intro,
        aspiration: applicant.aspiration,
        profile: applicant.profile,
        userId: applicant.userId,
        gatheringApplyId: applicant.gatheringApplyId,
        tags: [] // API에서 태그 정보가 없으므로 빈 배열로 설정
      };

      if (applicant.isApprove === null) {
        pending.push(applicantData);
      } else if (applicant.isApprove === true) {
        accepted.push(applicantData);
      } else if (applicant.isApprove === false) {
        rejected.push(applicantData);
      }
    });

    return { pending, accepted, rejected };
  };
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);
  const [search, setSearch] = useState({
    page: 1,
    status: "전체",
    searchWord: "",
  });
  const handleCancelGathering = async (gatheringId) => {
    try {
      const confirmCancel = window.confirm('정말로 이 모임을 취소하시겠습니까?');

      if (!confirmCancel) {
        return;
      }

      const response = await myAxios(token,setToken).post(`/user/cancelGathering/${gatheringId}`);

      if (response.status === 200) {
        alert('모임이 성공적으로 취소되었습니다.');
        // 목록 새로고침
        setSearch(prev => ({ ...prev }));
      }
    } catch (error) {
      console.error('모임 취소 오류:', error);
      if (error.response?.data?.message) {
        alert(`모임 취소 실패: ${error.response.data.message}`);
      } else {
        alert('모임 취소에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };
  const handleEditGathering = (gatheringId) => {
    navigate(`/user/gatheringModify/${gatheringId}`);
  };
  const [searchWord, setSearchWord] = useState("");

  // 탭 변경 핸들러 수정
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch((prev) => ({ ...prev, status: tab, page: 1 }));
  };

  // 검색 핸들러
  const handleSearch = () => {
    setSearch((prev) => ({ ...prev, searchWord: searchWord, page: 1 }));
  };

  // 상태별 카운트 계산 함수 수정
  const getStatusCount = (status) => {
    if (status === "전체") return gatheringList.length;

    // 탭 이름과 실제 상태값 매핑
    const statusMap = {
      진행예정: "모집중",
      진행완료: "진행완료",
      "취소된 모임": "취소됨",
    };

    const actualStatus = statusMap[status] || status;
    return gatheringList.filter((g) => g.status === actualStatus).length;
  };

  useEffect(() => {
    if (user || token) {
      let requestBody = {
        page: search.page,
      };

      // 검색어가 있으면 추가
      if (search.searchWord && search.searchWord.trim() !== "") {
        requestBody.word = search.searchWord.trim();
      }

      // 상태 필터 매핑 수정
      if (search.status === "전체") {
        // 전체인 경우 status는 추가하지 않음
      } else if (search.status === "진행예정") {
        requestBody.status = "모집중";
      } else if (search.status === "진행완료") {
        requestBody.status = "진행완료";
      } else if (search.status === "취소된 모임") {
        requestBody.status = "취소됨";
      }

      console.log("Request Body:", requestBody);

      token && myAxios(token,setToken).post(`/user/myGatheringList`, requestBody)
        .then((res) => {
          console.log("API Response:", res);

          // 페이지 정보 설정
          let resPageInfo = res.data.pageInfo;
          setPageInfo(resPageInfo);
          let pages = [];
          for (let i = resPageInfo.startPage; i <= resPageInfo.endPage; i++) {
            pages.push(i);
          }
          setPageNums([...pages]);

          // 데이터 변환 수정
          const transformedData = res.data.list.map((item) => ({
            gatheringId: item.gatheringId,
            thumbnail: `${url}/image?filename=${item.thumbnailFileName}`,
            category: item.categoryName,
            subcategory: item.subCategoryName,
            region: item.locName,
            title: item.title,
            applyDeadline: new Date(item.applyDeadline).toLocaleDateString(
              "ko-KR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            ),
            meetingTime: `${item.meetingDate} ${item.startTime} - ${item.endTime}`,
            // 수참가자 수 문법 오류 수정
            participants: `${item.minAttendees}명 - ${item.maxAttendees ? `${item.maxAttendees}명` : "제한 없음"
              }`,
            location: `${item.address} ${item.detailAddress || ""}`.trim(),
            description: item.intrOnln || "",
            // JSON 파싱 안전하게 처리
            tags: (() => {
              try {
                return item.tags ? JSON.parse(item.tags) : [];
              } catch (e) {
                console.error("Tags parsing error:", e, "Raw tags:", item.tags);
                return [];
              }
            })(),
            status: item.status,
            preparationItems: item.preparationItems,
          }));

          console.log("Transformed Data:", transformedData);
          setGatheringList(transformedData);
        })
        .catch((err) => {
          console.error("데이터 로딩 오류:", err);
        });
    } else {
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/userlogin");
      } else {
        window.history.back();
        return;
      }
    }
  }, [token, search]);

  useEffect(() => {
    if (selectedGatheringId) {
      token && myAxios(token,setToken).get(`/getApplyListByGatheringId/${selectedGatheringId}`)
        .then((res) => {
          console.log("신청자 목록:", res.data);
          setApplyList(res.data);
        })
        .catch((err) => {
          console.error("신청자 목록 로딩 오류:", err);
        });
    }
  }, [selectedGatheringId]);

  const toggleAccordion = (id) => {
    const newActiveAccordion = activeAccordion === id ? "" : id;
    setActiveAccordion(newActiveAccordion);

    // AccordionBody가 열릴 때만 selectedGatheringId 설정
    if (newActiveAccordion !== "") {
      setSelectedGatheringId(parseInt(newActiveAccordion));
    } else {
      setSelectedGatheringId(null);
      setApplyList([]); // AccordionBody가 닫힐 때 applyList 초기화
    }
  };

  return (
    <div>
      <Header />
      <div className="MyGatherPage_container MyGatheringList_mypage-wrapper_osk">
        <Sidebar />
        <section className="MyGatheringList_gathering-main_osk">
          <div className="MyGatheringList_gathering-header_osk">
            <h3>게더링 목록</h3>
            <div className="MyGatheringList_search-container_osk">
              <input
                type="text"
                placeholder="이름으로 검색"
                className="MyGatheringList_search-input_osk"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <CiSearch
                className="MyGatheringList_search-icon_osk"
                onClick={handleSearch}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="MyGatheringList_tabs_osk">
            {["전체", "진행예정", "진행완료", "취소된 모임"].map((tab) => (
              <button
                key={tab}
                className={`MyGatheringList_tab_osk ${activeTab === tab ? "MyGatheringList_active_osk" : ""
                  }`}
                onClick={() => handleTabChange(tab)} // 수정된 핸들러 사용
              >
                {tab} ({getStatusCount(tab)})
              </button>
            ))}
          </div>

          <Accordion
            open={activeAccordion}
            toggle={toggleAccordion}  // 이 부분이 제대로 전달되는지 확인
            className="MyGatheringList_gathering-list_osk"
          >
            {gatheringList.map((item) => {
              const applicants = selectedGatheringId === item.gatheringId && applyList.length > 0
                ? categorizeApplicants(applyList)
                : { pending: [], accepted: [], rejected: [] };

              return (
                <AccordionItem key={item.gatheringId}>
                  <AccordionHeader targetId={String(item.gatheringId)}>
                    <div className="MyGatheringList_card-summary_osk">
                      <img src={item.thumbnail} alt={item.title} className="MyGatheringList_thumbnail_osk" />
                      <div className="MyGatheringList_summary-content_osk">
                        <div className="MyGatheringList_badge-row_osk">
                          <span className="MyGatheringList_badge_osk MyGatheringList_orange_osk">
                            {item.category}
                          </span>
                          <span className="MyGatheringList_badge_osk MyGatheringList_blue_osk">
                            {item.region}
                          </span>
                        </div>
                        <h4 className="MyGatheringList_gathering-title_osk">
                          {item.title}
                        </h4>
                        <div className="MyGatheringList_meta_osk">
                          <div className="MyGatheringList_meta-row_osk">
                            <span className="MyGatheringList_meta-icon_osk">
                              🗓️
                            </span>
                            <span>신청 마감: {item.applyDeadline}까지</span>
                          </div>
                          <div className="MyGatheringList_meta-row_osk">
                            <span className="MyGatheringList_meta-icon_osk">
                              🕘
                            </span>
                            <span>모임 시간: {item.meetingTime}</span>
                          </div>
                          <div className="MyGatheringList_meta-row_osk">
                            <span className="MyGatheringList_meta-icon_osk">
                              👥
                            </span>
                            <span>참석 인원: {item.participants}</span>
                          </div>
                          <div className="MyGatheringList_meta-row_osk">
                            <span className="MyGatheringList_meta-icon_osk">
                              📍
                            </span>
                            <span>{item.location}</span>
                          </div>
                        </div>
                        {item.description && (
                          <p className="MyGatheringList_description_osk">
                            {item.description}
                          </p>
                        )}
                        <div className="MyGatheringList_tags_osk">
                          {Array.isArray(item.tags) &&
                            item.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="MyGatheringList_tag_osk"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="MyGatheringList_actions_osk">
                        <a
                          className="MyGatheringList_btn-cancel_osk"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelGathering(item.gatheringId);
                          }}
                        > 모임 취소
                        </a>
                        <a
                          className="MyGatheringList_btn-edit_osk"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGathering(item.gatheringId);
                          }}
                        >
                          수정하기
                        </a>
                      </div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody accordionId={String(item.gatheringId)}>
                    {/* 미처리 신청자 섹션 */}
                    <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_yellow_osk">
                      <h5 className="MyGatheringList_section-title_osk">미처리 ({applicants.pending.length})</h5>
                      {applicants.pending.map((applicant, i) => (
                        <div className="MyGatheringList_applicant_osk" key={i}>
                          <div className="MyGatheringList_info_osk">
                            <img src={`${url}/image?filename=${applicant.profile}`} alt={applicant.nickName} className="MyGatheringList_info_applicant-profile_osk"/>
                            <strong className="MyGatheringList_applicant-name_osk">{applicant.nickName}</strong>
                            {applicant.aspiration && (
                              <p className="MyGatheringList_applicant-aspiration_osk">지원동기: {applicant.aspiration}</p>
                            )}
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

                    {/* 수락된 신청자 섹션 */}
                    <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_green_osk">
                      <h5 className="MyGatheringList_section-title_osk">수락됨 ({applicants.accepted.length})</h5>
                      {applicants.accepted.map((applicant, i) => (
                        <div className="MyGatheringList_applicant_osk" key={i}>
                          <div className="MyGatheringList_info_osk">
                            <img src={`${url}/image?filename=${applicant.profile}`} alt={applicant.nickName} className="MyGatheringList_info_applicant-profile_osk"/>
                            <strong className="MyGatheringList_applicant-name_osk">{applicant.nickName}</strong>
                            {applicant.aspiration && (
                              <p className="MyGatheringList_applicant-aspiration_osk">지원동기: {applicant.aspiration}</p>
                            )}
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

                    {/* 거절된 신청자 섹션 */}
                    <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_red_osk">
                      <h5 className="MyGatheringList_section-title_osk">거절함 ({applicants.rejected.length})</h5>
                      {applicants.rejected.map((applicant, i) => (
                        <div className="MyGatheringList_applicant_osk" key={i}>
                          <div className="MyGatheringList_info_osk">
                            <img src={`${url}/image?filename=${applicant.profile}`} alt={applicant.nickName} className="MyGatheringList_info_applicant-profile_osk"/>
                            <strong className="MyGatheringList_applicant-name_osk">{applicant.nickName}</strong>
                            {applicant.aspiration && (
                              <p className="MyGatheringList_applicant-aspiration_osk">지원동기: {applicant.aspiration}</p>
                            )}
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
              );
            })}
          </Accordion>
          {pageInfo.allPage > 1 && (
            <div className="MyGatheringList_pagination_osk">
              {pageNums.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() =>
                    setSearch((prev) => ({ ...prev, page: pageNum }))
                  }
                  className={
                    pageInfo.curPage === pageNum
                      ? "MyGatheringList_active_osk"
                      : ""
                  }
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer/>
    </div>
  );
}