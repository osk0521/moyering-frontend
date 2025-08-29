import React from "react";
import {Accordion} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyGatheringList.css";
import Header from "../../../common/Header";
import Footer from "../../../../components/Footer";
import Sidebar from "../common/Sidebar";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { tokenAtom, userAtom } from "../../../../atoms";
import { useGatheringList } from "../../../../hooks/gathering/useGatheringList";
import Pagination from "./Pagination";
import AccordionItemCustom from "./AccordionItemCustom"; // 원본 

export default function MyGatheringList() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const {
    loading,
    activeTab,
    gatheringList,
    applyList,
    pageInfo,
    pageNums,
    searchWord,
    setSearchWord,
    handleSearch,
    handleTabChange,
    handleEditGathering,
    handleCancelGathering,
    handleDetailGathering,
    getStatusCount,
    handlePageChange,
    isGatheringDisabled,
    toggleAccordion,
    activeAccordion,
    categorizeApplicants,
    handleRemoveAccepted,
    updateApproval,
  } = useGatheringList({ token, setToken, user });

  return (
    <div>
      <Header />
      <div className="MyGatherPage_container MyGatheringList_mypage-wrapper_osk">
        <aside>
          <Sidebar />
        </aside>

        <section className="MyGatheringList_gathering-main_osk">
          {/* 헤더 */}
          <div className="MyGatheringList_gathering-header_osk">
            <h3>게더링 목록</h3>
            <div className="MyGatheringList_search-container_osk">
              <input
                type="text"
                placeholder="이름으로 검색"
                className="MyGatheringList_search-input_osk"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          {/* 탭 */}
          <div className="MyGatheringList_tabs_osk">
            {["전체", "진행예정", "진행완료", "취소된 모임"].map((tab) => (
              <button
                key={tab}
                className={`MyGatheringList_tab_osk ${
                  activeTab === tab ? "MyGatheringList_active_osk" : ""
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab} ({getStatusCount(tab)})
              </button>
            ))}
            <button className="MyGatheringList_btn-add_osk">
              <a href="/user/gatheringWrite">새로운 게더링 등록하기</a>
            </button>
          </div>

          {/* 리스트 */}
          {gatheringList.length === 0 ? (
            <div className="MyGatheringList_empty-state_osk">
              <h4>조회된 목록이 없습니다</h4>
              <p>검색 조건을 변경하거나 새로운 모임을 생성해보세요.</p>
            </div>
          ) : (
            <Accordion
              open={activeAccordion}
              toggle={toggleAccordion}
              className="MyGatheringList_gathering-list_osk"
            >
              {gatheringList.map((gathering) => {
                const applicants =
                  activeAccordion === String(gathering.gatheringId)
                    ? categorizeApplicants(applyList)
                    : { pending: [], accepted: [], rejected: [] };

                const isDisabled = isGatheringDisabled(gathering);

                return (
                  <AccordionItemCustom
                    key={gathering.gatheringId}
                    gathering={gathering}
                    applicants={applicants}
                    isDisabled={isDisabled}
                    handleCancelGathering={handleCancelGathering}
                    handleEditGathering={handleEditGathering}
                    handleDetailGathering={handleDetailGathering}
                    handleRemoveAccepted={handleRemoveAccepted}
                    updateApproval={updateApproval}
                  />
                );
              })}
            </Accordion>
          )}

          {/* 페이지네이션 */}
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