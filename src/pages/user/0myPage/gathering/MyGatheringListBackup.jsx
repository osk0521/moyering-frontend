import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyGatheringList.css";
import { CiSearch } from "react-icons/ci";
import Header from '../../../common/Header';
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
  const [page, setPage] = useState(1); 
  const [searchWord, setSearchWord] = useState("");
  const handleSearch = (searchTerm) => {
    const validated = validateGatheringParams(1, searchTerm);
    setSearchWord(validated.searchWord);
    setPage(validated.page);
  };

  // 페이지 변경 함수 (파라미터 검증 포함)
  const handlePageChange = (newPage) => {
    const validated = validateGatheringParams(newPage, searchWord);
    setPage(validated.page);
  };

  useEffect(() => {
    if (user || token) {
      if(activeTab == "전체") {
        token && myAxios(token,setToken).post(`/user/myGatheringList`, requestBody)
          .then((res) => {
            console.log("API Response:", res);
            setGatheringList(res.data);
          })
          .catch((err) => {
            if (err.response) {
              console.log("데이터 로딩 오류:", err);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      if (
        window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")
      ) {
        navigate("/userlogin");
      } else {
        window.history.back();
        return;
      }
    }
  }, [token, activeTab, page, searchWord]);

  useEffect(() => {
    myAxios().get(`/getApplyListByGatheringId/${gatheringId}`)
      .then((res) => {
        console.log('신청자 목록:', response.data);
        setApplyList(response.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log("데이터 로딩 오류:", err);
        }
      });
  }, [selectedGatheringId]);

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
    <div>
      <Header />
    <div className="MyGatheringList_mypage-wrapper_osk">
      <Sidebar />
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
                {/* <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_yellow_osk">
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
                </div> */}
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
    </div>
  );
}