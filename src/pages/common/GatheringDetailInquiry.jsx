// GatheringDetail_questions.jsx
import React, { useState, useEffect, memo, useRef } from "react";
import { useParams } from "react-router-dom";
import "./GatheringDetail.css";

export default function GatheringDetailInquiry() {
  const{gatheringId} = useParams();.
   useEffect(()=> {
    axios.get(`${url}/detailGathering/?gatheringId=${gatheringId}`)
        .then(res=> {
            console.log('API Response:', res.data); 
            
            // gathering 데이터 설정
            const gathering = res.data.gathering;
            const host = res.data.host;
            const member = res.data.member || []; // member 배열 추출
            
            // tags 필드를 문자열에서 배열로 변환
            let parsedTags = [];
            if (gathering.tags && typeof gathering.tags === 'string') {
                try {
                    // 문자열 "['독서', '소모임', '홍대']"를 배열로 변환
                    const validJsonString = gathering.tags.replace(/'/g, '"');
                    parsedTags = JSON.parse(validJsonString);
                } catch (error) {
                    console.error('Tags 파싱 오류:', error);
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

            setHostData({
                nickname: host.nickname,
                profileImage: host.profile,
                followers: 0, // API에서 제공되지 않는 경우 기본값
                intro: host.intro,
                likeCategory: "",
                tags: [], // 호스트 태그가 없는 경우 빈 배열
                categorys: [], // 호스트 카테고리를 배열로 저장
            });
            setMembers(member.map(m => ({
                id: m.gatheringApplyId,
                name: m.name,
                profileImage: m.profile ? `${url}/uploads/${m.profile}` : null,
                introduction: m.intro,
                applyDate: m.applyDate,
                aspiration: m.aspiration,
                isApprove: m.isApprove,
                userId: m.userId
            })));

            console.log('변환된 tags:', parsedTags);
        })
        .catch(err=> {
            console.log(err)
        })
  }, [gatheringId]);
  const questions = [
    { 
      id: 1, 
      status: "답변대기", 
      title: "존비롤 필수인가요?", 
      author: "id18****", 
      date: "2025-03-29", 
      hasAnswer: false 
    },
    { 
      id: 2, 
      status: "답변완료", 
      title: "저의 질문이습니다.", 
      author: "id335****", 
      date: "2025-03-29", 
      hasAnswer: false 
    },
    {
      id: 3,
      status: "답변완료",
      title: "수업에 상착 늘을 것같은데 초반을 툴지면 따라가기 힘들까요?",
      author: "id877****",
      date: "2025-02-21",
      hasAnswer: true,
      answer: {
        content:
          "안녕하세요. 고객님 저희 1대1로 수강생분들의 속도에 맞춰서 수업을 진행합니다.\n\n또한, 사전 강의자료를 업로드해드리오니 크게 문제는 없을 것으로 예상됩니다.\n\n다만, 많이 늦을실 경우에 한정된 시간 내에 완성이 어려우실 수 있습니다.",
        author: "모임장",
        date: "2025-02-21"
      }
    }
  ];

  return (
    <section className={styles.section} id="questions">
      <h2>질문</h2>
      <div className={styles.questionsTable}>
        <div className={styles.questionsHeader}>
          <div>답변상태</div>
          <div>제목</div>
          <div>작성자</div>
          <div>작성일</div>
        </div>

        {questions.map((q, i) => (
          <div key={q.id} className={`${styles.questionsRow} ${i % 2 === 1 ? styles.alternate : ""}`}>
            <div className={styles.questionsGrid}>
              <div>{q.status}</div>
              <div>{q.title}</div>
              <div>{q.author}</div>
              <div>{q.date}</div>
            </div>
            {q.hasAnswer && q.answer && (
              <div className={styles.answerSection}>
                <div className={styles.answerHeader}>
                  <span className={styles.answerBadge}>답변</span>
                  <span className={styles.answerAuthor}>{q.answer.author}</span>
                  <span className={styles.answerDate}>{q.answer.date}</span>
                </div>
                <div className={styles.answerContent}>{q.answer.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}