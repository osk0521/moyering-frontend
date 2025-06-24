import React, { useState,useEffect  } from "react";
import styles from "./ClassRingDetailInquiryList.module.css";
import { myAxios } from "../../config";
import { useNavigate,useParams } from "react-router";
import { url } from '../../config';
import {
    inquiryListAtom,
} from '../../atom/classAtom';
import { useSetAtom, useAtomValue } from "jotai";

export default function ClassRingDetailInquiryList({classId}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const setInquiryListAtom = useSetAtom(inquiryListAtom);
    const inquiryList = useAtomValue(inquiryListAtom);

    const navigate = useNavigate();
    useEffect(() => {
    const fetchInquiry = async () => {
        try {
        const res = await myAxios().get(
            `/classInquiryList/${classId}?page=${currentPage - 1}&size=5`
        );
        setInquiryListAtom(res.data.content);
        setTotalPages(res.data.totalPages);
        } catch (err) {
        console.error("질문 불러오기 실패", err);
        }
    };

    fetchInquiry();
    }, [currentPage]);

    return (
        <div>
            <h2>질문</h2>
            <div className={styles.questionsTable}>
                <div className={styles.questionsHeader}>
                <div>답변상태</div>
                <div>제목</div>
                <div>작성자</div>
                <div>작성일</div>
                </div>
                {inquiryList.map((q, i) => (
                <div key={q.id} className={`${styles.questionsRow} ${i % 2 === 1 ? styles.alternate : ""}`}>
                    <div className={styles.questionsGrid}>
                    <div>{q.iqResContent ? "답변완료" :"답변대기"}</div>
                    <div>{q.content}</div>
                    <div>{q.studentName}</div>
                    <div>{q.inquiryDate}</div>
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
            <div className={styles.questionButtonWrap}><button className={styles.questionButton}>질문하기</button></div>
        </div>  
    );
}