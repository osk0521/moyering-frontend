import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyGatheringApplyList.css";
import { CiCalendar, CiClock1, CiSearch, CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from "../common/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../../../atoms";
import { myAxios, url } from "../../../../config";
import { useGatheringApplyList } from "../../../../hooks/gathering/useGatheringApplyList";
import Pagination from "./Pagination";
const isGatheringDisabled = (item) => {
  // 취소된 모임인 경우
  if (item.canceled === true) {
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

export default function MyGatheringApplyList() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [activeTab, setActiveTab] = useState("전체");
  const [applyList, setApplyList] = useState([]);
  const [allCnt, setAllCnt] = useState(0);
  const [undefinedCnt, setUndefinedCnt] = useState(0);
  const [inProgressCnt, setInProgressCnt] = useState(0);
  const [canceledCnt, setCanceledCnt] = useState(0);
  const [searchWord, setSearchWord] = useState("");
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

  // 참여 취소 처리 함수
const handleCancelApply = async (gathering) => {
  try {
    const isConfirmed = window.confirm(`'${gathering.title}' 게더링 참여를 정말 취소하시겠습니까?`);
    if (!isConfirmed) {
      return;
    }
    
    const response = await myAxios(token, setToken).post(`/user/cancelGatheringApply/${gathering.gatheringApplyId}`);

    if (response.status === 200) {
      alert('게더링 참여가 성공적으로 취소되었습니다.');
      
      // 취소된 항목을 목록에서 제거
      setApplyList(prevList => 
        prevList.filter(item => item.gatheringApplyId !== gathering.gatheringApplyId)
      );
      
      // 전체 카운트 감소
      setAllCnt(prevCount => prevCount - 1);
      
      // 현재 항목의 상태에 따라 해당 카운트 감소
      if (gathering.status === "수락됨") {
        setInProgressCnt(prevCount => prevCount - 1);
      } else if (gathering.status === "대기중") {
        setUndefinedCnt(prevCount => prevCount - 1);
      } else if (gathering.status === "거절됨" || gathering.status === "취소됨") {
        setCanceledCnt(prevCount => prevCount - 1);
      }
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
const {
  loading,
  handlePageChange
} = useGatheringApplyList({ token, setToken, navigate, user });
  const handleDetailGathering = (gatheringId) => {
    navigate(`/gatheringDetail/${gatheringId}`);
  };
  const tabs = [
    { display: "전체", value: "전체" },
    { display: "수락됨", value: "수락됨" },
    { display: "대기중", value: "대기중" },
    { display: "거절됨/취소된 게더링", value: "거절됨" }
  ];
  const handleSearch = () => {
    setSearch((prev) => ({ ...prev, searchWord: searchWord, page: 1 }));
  };

  const handleTabChange = (tabValue) => {
    // activeTab은 표시용 텍스트로 설정
    const selectedTab = tabs.find(tab => tab.value === tabValue);
    setActiveTab(selectedTab.display);

    // API 요청에는 value 값을 사용
    setSearch((prev) => ({ ...prev, status: tabValue, page: 1 }));
  };


  // 상태별 카운트
  const getStatusCount = (tabValue) => {
    if (tabValue === "전체") return allCnt;
    if (tabValue === "대기중") return undefinedCnt;
    if (tabValue === "수락됨") return inProgressCnt;
    if (tabValue === "거절됨") return canceledCnt;
  };

  // 승인 상태를 한글로 변환하는 함수
  const getApprovalStatus = (isApprove, canceled) => {
    if (canceled) return "취소됨";
    if (isApprove === false) return "거절됨";
    if (isApprove === null) return "대기중";
    if (isApprove === true) return "수락됨";
    return "대기중";
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

      // 상태 필터 추가
      if (search.status !== "전체") {
        requestBody.status = search.status;
      }
      console.log("requestBody : ", requestBody);
      token && myAxios(token, setToken).post(`/user/myApplyList`, requestBody)
        .then((res) => {
          console.log("API Response:", res.data);
          setAllCnt(res.data.allCnt);

          if (res.data.allCnt > 0) {
            setUndefinedCnt(res.data.undefinedCnt); // 대기중
            setInProgressCnt(res.data.inProgressCnt); // 수락됨 (진행중)
            setCanceledCnt(res.data.canceledCnt); // 거절됨/취소됨

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
              gatheringApplyId: item.gatheringApplyId,
              gatheringId: item.gatheringId,
              title: item.title,
              image: `${url}/image?filename=${item.thumbnailFileName}`,
              description: item.intrOnln || "설명이 없습니다.",
              date: item.meetingDate,
              time: `${item.startTime} - ${item.endTime}`,
              meetingDate: item.meetingDate,
              startTime: item.startTime,
              endTime: item.endTime,
              location: item.address ? `${item.address} (${item.locName})` : item.locName,
              participants: `${item.minAttendees}명 - ${item.maxAttendees ? `${item.maxAttendees}명` : "제한 없음"}`,
              currentAttendees: item.currentAttendees,
              acceptedCount: item.acceptedCount,
              applyDeadline: new Date(item.applyDeadline).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              tags: (() => {
                try {
                  return item.tags ? JSON.parse(item.tags) : [];
                } catch (e) {
                  console.error("Tags parsing error:", e, "Raw tags:", item.tags);
                  return [];
                }
              })(),
              status: getApprovalStatus(item.isApprove, item.canceled),
              canceled: item.canceled,
              isApprove: item.isApprove,
              aspiration: item.aspiration,
              applyDate: item.applyDate,
              hostNickName: item.nickName,
              hostProfile: item.profile,
            }));

            console.log("Transformed Data:", transformedData);
            setApplyList(transformedData);
          } else {
            setApplyList([]);
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

  return (
    <div>
      <Header />
      <div className="MyGatherPage_container MyGatheringApplyList_mypage-wrapper_osk">
        <aside>
          <Sidebar />
        </aside>
        <section className="MyGatheringApplyList_gathering-main_osk">
          <div className="MyGatheringApplyList_gathering-header_osk">
            <h3>지원한 게더링 목록</h3>
            <div className="MyGatheringApplyList_search-container_osk">
              <input
                type="text"
                placeholder="제목으로 검색"
                className="MyGatheringApplyList_search-input_osk"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <CiSearch className="MyGatheringApplyList_search-icon_osk"  onClick={handleSearch}
                style={{ cursor: "pointer" }} />
            </div>
          </div>

          <div className="MyGatheringApplyList_tabs_osk">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`MyGatheringApplyList_tab_osk ${activeTab === tab.display ? "MyGatheringApplyList_active_osk" : ""}`}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.display} ({getStatusCount(tab.value)})
              </button>
            ))}
          </div>

          <div className="MyGatheringApplyList_gathering-list_osk">
            {applyList.length === 0 ? (
              <div className="MyGatheringList_empty-state_osk">
                <div className="MyGatheringList_empty-content_osk">
                  <h4>조회된 목록이 없습니다</h4>
                  <p>검색 조건을 변경하거나 새로운 모임에 지원해보세요.</p>
                </div>
              </div>
            ) : (
              applyList.map((gathering) => (
                <div key={gathering.gatheringApplyId} className="MyGatheringApplyList_gathering-list-item_osk">
                  <div className="MyGatheringApplyList_gathering-image_osk">
                    <img
                      src={gathering.image}
                      alt={gathering.title}
                      onClick={() => handleDetailGathering(gathering.gatheringId)}
                      onError={(e) => {
                        e.target.src = '/default-gathering-image.jpg'; // 기본 이미지 경로
                      }}
                    />
                  </div>
                  <div className="MyGatheringApplyList_gathering-content_osk">
                    <div className="MyGatheringApplyList_gathering-card_osk MyGatheringApplyList_gathering-header_osk">
                      <span
                        className={`MyGatheringApplyList_status-badge_osk ${{
                            "수락됨": "MyGatheringApplyList_accepted_osk",
                            "대기중": "MyGatheringApplyList_pending_osk",
                            "거절됨": "MyGatheringApplyList_rejected_osk",
                            "취소됨": "MyGatheringApplyList_rejected_osk"
                          }[gathering.status] || ""
                          }`}
                      >
                        {gathering.status}
                      </span>
                      <h4
                        className="MyGatheringApplyList_gathering-title_osk"
                        onClick={() => handleDetailGathering(gathering.gatheringId)}
                        style={{ cursor: 'pointer' }}
                      >
                        {gathering.title}
                      </h4>
                    </div>
                    <p className="MyGatheringApplyList_gathering-description_osk">
                      {gathering.description}
                    </p>

                    <div className="MyGatheringApplyList_gathering-info_osk">
                      <div className="MyGatheringApplyList_info-row_osk">
                        <span className="MyGatheringApplyList_info-label_osk">
                          <CiCalendar /> 개최일:
                        </span>
                        <span className="MyGatheringApplyList_info-value_osk">
                          {gathering.date} {gathering.time}
                        </span>
                      </div>
                      <div className="MyGatheringApplyList_info-row_osk">
                        <span className="MyGatheringApplyList_info-label_osk">
                          <CiLocationOn /> 장소:
                        </span>
                        <span className="MyGatheringApplyList_info-value_osk">
                          {gathering.location}
                        </span>
                      </div>
                      <div className="MyGatheringApplyList_info-row_osk">
                        <span className="MyGatheringApplyList_info-label_osk">
                          <GoPeople /> 참여:
                        </span>
                        <span className="MyGatheringApplyList_info-value_osk">
                          {gathering.participants}
                        </span>
                      </div>
                      <div className="MyGatheringApplyList_info-row_osk">
                        <span className="MyGatheringApplyList_info-label_osk">
                          <CiClock1 /> 지원일:
                        </span>
                        <span className="MyGatheringApplyList_info-value_osk">
                          {gathering.applyDate}
                        </span>
                      </div>
                      {gathering.aspiration && (
                        <div className="MyGatheringApplyList_info-row_osk">
                          <span className="MyGatheringApplyList_info-label_osk">
                            지원동기:
                          </span>
                          <span className="MyGatheringApplyList_info-value_osk">
                            {gathering.aspiration}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="MyGatheringApplyList_gathering-tags_osk">
                      {gathering.tags.map((tag, index) => (
                        <span key={index} className="MyGatheringApplyList_tag_osk">
                          {`#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="MyGatheringApplyList_gathering-actions_osk">
                    {(gathering.status === "수락됨" || gathering.status === "대기중") &&
                      !isGatheringDisabled(gathering) && (
                        <button
                          className="MyGatheringApplyList_apply-complete-btn_osk"
                          onClick={() => handleCancelApply(gathering)}
                        >
                          참여 취소
                        </button>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>

         <Pagination
            pageInfo={pageInfo}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </section>
      </div>
      <Footer />
    </div>
  );
}