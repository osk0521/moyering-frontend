import React from "react";
import {
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Button,
} from "reactstrap";
import { CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { myAxios, url } from "../../../../config";

export default function AccordionItemCustom({
  gathering,
  applicants,
  isDisabled,
  handleCancelGathering,
  handleEditGathering,
  handleDetailGathering,
  handleRemoveAccepted,
  updateApproval,
}) {
  return (
    <AccordionItem key={gathering.gatheringId}>
      <AccordionHeader targetId={String(gathering.gatheringId)}>
        <div className="MyGatheringList_card-summary_osk">
          {/* 썸네일 */}
          <img
            src={gathering.thumbnail}
            alt={gathering.title}
            className="MyGatheringList_thumbnail_osk"
          />

          {/* 기본 정보 */}
          <div className="MyGatheringList_summary-content_osk">
            <div className="MyGatheringList_badge-row_osk">
              <span className="MyGatheringList_badge_osk MyGatheringList_red_osk">
                {gathering.category}
              </span>
              <span className="MyGatheringList_badge_osk MyGatheringList_blue_osk">
                <CiLocationOn /> {gathering.region}
              </span>
            </div>

            <h4
              className="MyGatheringList_gathering-title_osk"
              onClick={(e) => {
                e.stopPropagation();
                handleDetailGathering(gathering.gatheringId);
              }}
            >
              {gathering.title}
            </h4>

            <div className="MyGatheringList_meta_osk">
              <div className="MyGatheringList_meta-row_osk">
                <span className="MyGatheringList_meta-icon_osk">
                  <CiCalendar />
                </span>
                <span className="MyGatheringList_meta-row-info_osk">
                  신청 마감: {gathering.applyDeadline}까지
                </span>
              </div>
              <div className="MyGatheringList_meta-row_osk">
                <span className="MyGatheringList_meta-icon_osk">
                  <CiClock1 />
                </span>
                <span className="MyGatheringList_meta-row-info_osk">
                  모임 시간: {gathering.meetingTime}
                </span>
              </div>
              <div className="MyGatheringList_meta-row_osk">
                <span className="MyGatheringList_meta-icon_osk">
                  <GoPeople />
                </span>
                <span className="MyGatheringList_meta-row-info_osk">
                  참석 인원: {gathering.participants}, 지원자 총{" "}
                  {gathering.appliedCount} 명, {gathering.acceptedCount} 명 참여
                  중
                </span>
              </div>
              <div className="MyGatheringList_meta-row_osk">
                <span className="MyGatheringList_meta-icon_osk">
                  <CiLocationOn />
                </span>
                <span className="MyGatheringList_meta-row-info_osk">
                  {gathering.location}
                </span>
              </div>
            </div>

            {gathering.description && (
              <p className="MyGatheringList_description_osk">
                {gathering.description}
              </p>
            )}

            <div className="MyGatheringList_tags_osk">
              {Array.isArray(gathering.tags) &&
                gathering.tags.map((tag, idx) => (
                  <span key={idx} className="MyGatheringList_tag_osk">
                    #{tag}
                  </span>
                ))}
            </div>
          </div>

          {/* 수정/취소 버튼 */}
          <div className="MyGatheringList_actions_osk">
            {!isDisabled && (
              <>
                <a
                  className="MyGatheringList_btn-cancel_osk"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelGathering(gathering.gatheringId);
                  }}
                >
                  모임 취소
                </a>
                <a
                  className="MyGatheringList_btn-edit_osk"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditGathering(gathering.gatheringId);
                  }}
                >
                  수정하기
                </a>
              </>
            )}
          </div>
        </div>
      </AccordionHeader>

      <AccordionBody accordionId={String(gathering.gatheringId)}>
        {/* 미처리 신청자 */}
        {applicants.pending.length > 0 && (
          <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_yellow_osk">
            <h5 className="MyGatheringList_section-title_osk">
              미처리 ({applicants.pending.length})
            </h5>
            {applicants.pending.map((applicant, i) => (
              <div className="MyGatheringList_applicant_osk" key={i}>
                <div className="MyGatheringList_info_osk">
                  <img
                    src={`${url}/image?filename=${applicant.profile}`}
                    alt={applicant.nickName}
                    className="MyGatheringList_info_applicant-profile_osk"
                  />
                  <strong className="MyGatheringList_applicant-name_osk">
                    {applicant.nickName}
                  </strong>
                  {applicant.aspiration && (
                    <p className="MyGatheringList_applicant-aspiration_osk">
                      지원동기 및 포부: {applicant.aspiration}
                    </p>
                  )}
                </div>
                {!isDisabled && (
                  <div className="MyGatheringList_btn-group_osk">
                    <Button
                      onClick={() =>
                        updateApproval(applicant.gatheringApplyId, true)
                      }
                      className="MyGatheringList_btn-accept_osk"
                    >
                      수락
                    </Button>
                    <Button
                      onClick={() =>
                        updateApproval(applicant.gatheringApplyId, false)
                      }
                      className="MyGatheringList_btn-reject_osk"
                    >
                      거절
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 수락된 신청자 */}
        {applicants.accepted.length > 0 && (
          <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_green_osk">
            <h5 className="MyGatheringList_section-title_osk">
              수락됨 ({applicants.accepted.length})
            </h5>
            {applicants.accepted.map((applicant, i) => (
              <div className="MyGatheringList_applicant_osk" key={i}>
                <div className="MyGatheringList_info_osk">
                  <img
                    src={`${url}/image?filename=${applicant.profile}`}
                    alt={applicant.nickName}
                    className="MyGatheringList_info_applicant-profile_osk"
                  />
                  <strong className="MyGatheringList_applicant-name_osk">
                    {applicant.nickName}
                  </strong>
                </div>
                {!isDisabled && (
                  <Button
                    onClick={() =>
                      handleRemoveAccepted(applicant.gatheringApplyId)
                    }
                    className="MyGatheringList_btn-remove_osk"
                  >
                    내보내기
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 거절된 신청자 */}
        {applicants.rejected.length > 0 && (
          <div className="MyGatheringList_accordion-body-section_osk MyGatheringList_red_osk">
            <h5 className="MyGatheringList_section-title_osk">
              거절함 ({applicants.rejected.length})
            </h5>
            {applicants.rejected.map((applicant, i) => (
              <div className="MyGatheringList_applicant_osk" key={i}>
                <div className="MyGatheringList_info_osk">
                  <img
                    src={`${url}/image?filename=${applicant.profile}`}
                    alt={applicant.nickName}
                    className="MyGatheringList_info_applicant-profile_osk"
                  />
                  <strong className="MyGatheringList_applicant-name_osk">
                    {applicant.nickName}
                  </strong>
                </div>
                {!isDisabled && (
                  <Button
                    onClick={() =>
                      updateApproval(applicant.gatheringApplyId, true)
                    }
                    className="MyGatheringList_btn-accept_osk"
                  >
                    수락
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </AccordionBody>
    </AccordionItem>
  );
}