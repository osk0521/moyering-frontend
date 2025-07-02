import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button,} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { CiCalendar, CiClock1, CiSearch, CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import "./MyGatheringList.css";
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
  const [token, setToken] = useAtom(tokenAtom);
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedGatheringId, setSelectedGatheringId] = useState();
  const [gatheringList, setGatheringList] = useState([]);
  const [applyList, setApplyList] = useState([]);
  const [allCnt, setAllCnt] = useState(0);
  const [scheduledCnt, setScheduledCnt] = useState(0);
  const [inProgressCnt, setInProgressCnt] = useState(0);
  const [canceledCnt, setCanceledCnt] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState("");

  // 모임이 취소되었거나 과거 모임인지 확인하는 함수
  const isGatheringDisabled = (item) => {
    // 취소된 모임인 경우
    if (item.canceled === true || item.status === "취소됨") {
      return true;
    }
    
    // 모임 날짜와 시간이 현재보다 과거인 경우
    try {
      const meetingDateTime = new Date(`${item.meetingDate} ${item.startTime}`);
      const now = new Date();
      return meetingDateTime < now;
    } catch (error) {
      console.error("날짜 파싱 오류:", error);
      return false;
    }
  };

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

      const response = await myAxios(token, setToken).post(`/user/cancelGathering/${gatheringId}`);

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
  const handleDetailGathering = (gatheringId) => {
    navigate(`/gatheringDetail/${gatheringId}`);
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
  
  // 상태별 카운트
  const getStatusCount = (status) => {
    if (status === "전체") return allCnt;
    if (status === "진행예정") return scheduledCnt;
    if (status === "진행완료") return inProgressCnt;
    if (status === "취소된 모임") return canceledCnt;
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

      token && myAxios(token, setToken).post(`/user/myGatheringList`, requestBody)
        .then((res) => {
          console.log("API Response:", res);
          setAllCnt(res.data.allCnt);
          if (res.data.allCnt > 0) {
            setScheduledCnt(res.data.scheduledCnt);
            setInProgressCnt(res.data.inProgressCnt);
            setCanceledCnt(res.data.canceledCnt);
            // 페이지 정보 설정
            let resPageInfo = res.data.pageInfo;
            setPageInfo(resPageInfo);
            let pages = [];
            for (let i = resPageInfo.startPage; i <= resPageInfo.endPage; i++) {
              pages.push(i);
            }
            setPageNums([...pages]);

            // 데이터 변환 
            const transformedData = res.data.list.map((item) => ({
              gatheringId: item.gatheringId,
              thumbnail: `${url}/image?filename=${item.thumbnailFileName}`,
              category: item.categoryName +` > `+ item.subCategoryName,
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
              appliedCount:item.appliedCount,
              acceptedCount:item.acceptedCount,
              meetingTime: `${item.meetingDate} ${item.startTime} - ${item.endTime}`,
              meetingDate: item.meetingDate, // 날짜 비교를 위해 추가
              startTime: item.startTime, // 시간 비교를 위해 추가
              participants: `${item.minAttendees}명 - ${item.maxAttendees ? `${item.maxAttendees}명` : "제한 없음"}`,
              location: `${item.address} ${item.detailAddress || ""}`.trim(),
              description: item.intrOnln || "",
              tags: (() => {
                try {
                  return item.tags ? JSON.parse(item.tags) : [];
                } catch (e) {
                  console.error("Tags parsing error:", e, "Raw tags:", item.tags);
                  return [];
                }
              })(),
              status: item.status,
              canceled: item.canceled, // 취소 상태 추가
              preparationItems: item.preparationItems,

            }));
          console.log("Transformed Data:", transformedData);
          setGatheringList(transformedData);
          }
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
  
 const updateApproval = async (applyId, isApprove) => {
  try {
    // 🔥 추가: 즉시 UI 업데이트 (이 부분만 추가!)
    setApplyList(prevList => 
      prevList.map(applicant => 
        applicant.gatheringApplyId === applyId 
          ? { ...applicant, isApprove: isApprove }
          : applicant
      )
    );
    const response = await myAxios(token, setToken).post(`/updateApproval?applyId=${applyId}&isApprove=${isApprove}`);
    return response.data;
    
  } catch (error) {
    console.error('승인 상태 변경 실패:', error);
    
    // 실패 시 원래 데이터로 복원
    if (selectedGatheringId) {
      try {
        const rollbackResponse = await myAxios(token, setToken).get(`/getApplyListByGatheringId/${selectedGatheringId}`);
        setApplyList(rollbackResponse.data);
      } catch (rollbackError) {
        console.error('데이터 복원 실패:', rollbackError);
      }
    }
    
    alert('상태 변경에 실패했습니다. 다시 시도해주세요.');
    throw error;
  }
};
const handleRemoveAccepted = async (applyId) => {
  if (window.confirm('정말로 이 참가자를 내보내시겠습니까?')) {
    await updateApproval(applyId, false);
  }
};
  useEffect(() => {
    if (selectedGatheringId) {
      token && myAxios(token, setToken).get(`/getApplyListByGatheringId/${selectedGatheringId}`)
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
    // 먼저 해당 gathering의 신청자 목록을 확인
    const gatheringId = parseInt(id);
    
    // 현재 accordion이 닫혀있는 상태에서 열려고 하는 경우
    if (activeAccordion !== id) {
      // 신청자 목록을 먼저 가져와서 확인
      if (token) {
        myAxios(token, setToken).get(`/getApplyListByGatheringId/${gatheringId}`)
          .then((res) => {
            const applicants = categorizeApplicants(res.data);
            const totalApplicants = applicants.pending.length + applicants.accepted.length + applicants.rejected.length;
            
            if (totalApplicants === 0) {
              alert('신청자가 없습니다.');
              return; // accordion을 열지 않음
            }
            
            // 신청자가 있는 경우에만 accordion 열기
            setActiveAccordion(id);
            setSelectedGatheringId(gatheringId);
            setApplyList(res.data);
          })
          .catch((err) => {
            console.error("신청자 목록 로딩 오류:", err);
            alert('신청자 목록을 불러오는데 실패했습니다.');
          });
      }
    } else {
      // accordion을 닫는 경우
      setActiveAccordion("");
      setSelectedGatheringId(null);
      setApplyList([]);
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
                className={`MyGatheringList_tab_osk ${activeTab === tab ? "MyGatheringList_active_osk" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab} ({getStatusCount(tab)})
              </button>
            ))}
            <button className="MyGatheringList_btn-add_osk">
              <a href="/user/gatheringWrite">
                새로운 게더링 등록하기
              </a>
            </button>
          </div>
          {allCnt <= 0 ? (
            <div className="MyGatheringList_empty-state_osk">
              <div className="MyGatheringList_empty-content_osk">
                <h4>조회된 목록이 없습니다</h4>
                <p>검색 조건을 변경하거나 새로운 모임을 생성해보세요.</p>
              </div>
            </div>
          ) : (
            <Accordion
              open={activeAccordion}
              toggle={toggleAccordion}
              className="MyGatheringList_gathering-list_osk"
            >
              {gatheringList.map((item) => {
                const applicants = selectedGatheringId === item.gatheringId && applyList.length > 0
                  ? categorizeApplicants(applyList)
                  : { pending: [], accepted: [], rejected: [] };
                const isDisabled = isGatheringDisabled(item);
                
                return (
                  <AccordionItem key={item.gatheringId}>
                    <AccordionHeader targetId={String(item.gatheringId)}>
                      <div className="MyGatheringList_card-summary_osk">
                        <img src={item.thumbnail} alt={item.title} className="MyGatheringList_thumbnail_osk" />
                        <div className="MyGatheringList_summary-content_osk">
                          <div className="MyGatheringList_badge-row_osk">
                            <span className="MyGatheringList_badge_osk MyGatheringList_red_osk">
                              {item.category}
                            </span>
                            <span className="MyGatheringList_badge_osk MyGatheringList_blue_osk">
                              {item.region}
                            </span>
                          </div>
                          <h4 className="MyGatheringList_gathering-title_osk"
                           onClick={(e) => {
                                  e.stopPropagation();
                                  handleDetailGathering(item.gatheringId);
                                }}
                          >{item.title}
                          </h4>
                          <div className="MyGatheringList_meta_osk">
                            <div className="MyGatheringList_meta-row_osk">
                              <span className="MyGatheringList_meta-icon_osk">
                                <CiCalendar /> 
                              </span>
                              <span>신청 마감: {item.applyDeadline}까지</span>
                            </div>
                            <div className="MyGatheringList_meta-row_osk">
                              <span className="MyGatheringList_meta-icon_osk">
                                <CiClock1 />
                              </span>
                              <span>모임 시간: {item.meetingTime}</span>
                            </div>
                            <div className="MyGatheringList_meta-row_osk">
                              <span className="MyGatheringList_meta-icon_osk">
                                <GoPeople />
                              </span>
                              <span>참석 인원: {item.participants}, 지원자 총 {item.appliedCount} 명, {item.acceptedCount} 명 참여 중,</span>
                            </div>
                            <div className="MyGatheringList_meta-row_osk">
                              <span className="MyGatheringList_meta-icon_osk">
                                <CiLocationOn />
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
                          {!isDisabled && (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
                    </AccordionHeader>
                    <AccordionBody accordionId={String(item.gatheringId)}>
                      {/* 미처리 신청자 섹션 - 0명이면 숨김 */}
                      {applicants.pending.length > 0 && (
                        <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_yellow_osk">
                          <h5 className="MyGatheringList_section-title_osk">미처리 ({applicants.pending.length})</h5>
                          {applicants.pending.map((applicant, i) => (
                            <div className="MyGatheringList_applicant_osk" key={i}>
                              <div className="MyGatheringList_info_osk">
                                <img src={`${url}/image?filename=${applicant.profile}`} alt={applicant.nickName} className="MyGatheringList_info_applicant-profile_osk" />
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
                              {!isDisabled && (
                                <div className="MyGatheringList_btn-group_osk">
                                  <Button onClick={() => updateApproval(applicant.gatheringApplyId, true)} className="MyGatheringList_btn-accept_osk">수락</Button>
                                  <Button onClick={() => updateApproval(applicant.gatheringApplyId, false)} className="MyGatheringList_btn-reject_osk">거절</Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 수락된 신청자 섹션 - 0명이면 숨김 */}
                      {applicants.accepted.length > 0 && (
                        <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_green_osk">
                          <h5 className="MyGatheringList_section-title_osk">수락됨 ({applicants.accepted.length})</h5>
                          {applicants.accepted.map((applicant, i) => (
                            <div className="MyGatheringList_applicant_osk" key={i}>
                              <div className="MyGatheringList_info_osk">
                                <img src={`${url}/image?filename=${applicant.profile}`} alt={applicant.nickName} className="MyGatheringList_info_applicant-profile_osk" />
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
                              {!isDisabled && (
                                <Button onClick={() => handleRemoveAccepted(applicant.gatheringApplyId)} className="MyGatheringList_btn-remove_osk">내보내기</Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 거절된 신청자 섹션 - 0명이면 숨김 */}
                      {applicants.rejected.length > 0 && (
                        <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_red_osk">
                          <h5 className="MyGatheringList_section-title_osk">거절함 ({applicants.rejected.length})</h5>
                          {applicants.rejected.map((applicant, i) => (
                            <div className="MyGatheringList_applicant_osk" key={i}>
                              <div className="MyGatheringList_info_osk">
                                <img src={`${url}/image?filename=${applicant.profile}`} alt={applicant.nickName} className="MyGatheringList_info_applicant-profile_osk" />
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
                              {!isDisabled && (
                                <Button onClick={() => updateApproval(applicant.gatheringApplyId, true)} className="MyGatheringList_btn-accept_osk">수락</Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionBody>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
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
      <Footer />
    </div>
  );
}