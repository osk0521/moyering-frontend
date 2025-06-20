// GatheringDetail_questions.jsx
import React, { useState, useEffect, memo, useRef } from "react";
import { useParams } from "react-router-dom";
import "./GatheringDetail.css";

export default function GatheringDetailInquiry({ gatheringId }) {
//   const{gatheringId} = useParams();
const exampleQuestionsData = {
    questions: [
      {
        id: 1,
        status: "답변대기",
        content: "준비물 필수인가요?",
        author: "id18****",
        date: "2025-03-29",
        answer: null,
      },
      {
        id: 2,
        status: "답변완료",
        content: "처의 집문이옵니다.",
        author: "id335****",
        date: "2025-03-29",
        answer: null,
      },
      {
        id: 3,
        status: "답변완료",
        content: "또 다른 질문이용",
        author: "id877****",
        date: "2025-02-21",
        answer: null,
      },
      {
        id: 4,
        status: "답변완료",
        content: "수업에 상황 늦을 것같은데 초반을 놓치면 따라가기 힘들까요?",
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
        content: "어기도 있어요 질문",
        author: "id18id18id18id18id18id18",
        date: "2025-02-21",
        answer: null,
      },
      {
        id: 6,
        status: "답변완료",
        content: "나두 질문이요",
        author: "id335****",
        date: "2025-01-01",
        answer: null,
      },
    ],
    totalPages: 3,
    currentPage: 1,
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

  const questionsPerPage = 5;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

    setQuestions(exampleQuestionsData.questions);
    setTotalPages(exampleQuestionsData.totalPages);
    setCurrentPage(exampleQuestionsData.currentPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
   useEffect(()=> {
    axios.get(`${url}/getGatheringInquiries/?gatheringId=${gatheringId}`)
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
            
            setInquiryData({
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