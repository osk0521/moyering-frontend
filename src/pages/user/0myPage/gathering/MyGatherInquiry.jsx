import React, { useState } from 'react';
import './MyGatherInquiry.css';

export default function GatherInquiry() {
  const [activeTab, setActiveTab] = useState('participated');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [openId, setOpenId] = useState(null);
  const [replyText, setReplyText] = useState({}); // { id: '답변 내용' }

  const participated = [
    { id: 1, title: '보컬모임', date: '25.06.01', status: '대기', user: '홍길동', question: '악기 가져와야 하나요?', answer: '' },
    { id: 2, title: '산책모임', date: '25.06.03', status: '답변완료', user: '홍길동', question: '비오면 취소되나요?', answer: '비가 많이 올 경우엔 취소될 수 있어요!' },
  ];

  const hosted = [
    { id: 3, title: '도자기모임', date: '25.06.05', status: '대기', user: '이소리', question: '주차 가능할까요?', answer: '' },
    { id: 4, title: '요리모임', date: '25.06.06', status: '답변완료', user: '이준수', question: '재료는 뭘 준비해야 하나요?', answer: '재료는 현장에서 제공됩니다!' },
  ];

  const data = activeTab === 'participated' ? participated : hosted;
  const filtered = selectedStatus === '전체' ? data : data.filter(item => item.status === selectedStatus);

  const toggleAccordion = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const handleReplyChange = (id, text) => {
    setReplyText(prev => ({ ...prev, [id]: text }));
  };

  const handleReplySubmit = (id) => {
    alert(`답변 등록됨: ${replyText[id]}`);
    setReplyText(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <main className="MyGatherInquiryList_gather-inquiry-page_osk">
      <aside className="MyGatherInquiryList_sidebar_osk">
        <div className="MyGatherInquiryList_sidebar-box_osk">회원정보</div>
        <div className="MyGatherInquiryList_sidebar-box_osk">마이메뉴</div>
      </aside>

      <section className="MyGatherInquiryList_inquiry-section_osk">
        <h2 className="MyGatherInquiryList_inquiry-title_osk">게더링 문의</h2>

        <div className="MyGatherInquiryList_inquiry-tabs_osk">
          <button
            className={activeTab === 'participated' ? 'GatherInquiry_active_osk' : ''}
            onClick={() => { setActiveTab('participated'); setSelectedStatus('전체'); }}
          >내가 참여한 모임 문의</button>
          <button
            className={activeTab === 'hosted' ? 'GatherInquiry_active_osk' : ''}
            onClick={() => { setActiveTab('hosted'); setSelectedStatus('전체'); }}
          >내가 개최한 모임 문의</button>
        </div>

        <div className="MyGatherInquiryList_filter-row_osk">
          <label>답변 상태:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="전체">전체</option>
            <option value="대기">대기</option>
            <option value="답변완료">답변완료</option>
          </select>
        </div>

        <div className="MyGatherInquiryList_inquiry-list_osk">
          {filtered.map(item => (
            <div key={item.id} className="MyGatherInquiryList_inquiry-box_osk">
              <div className="MyGatherInquiryList_accordion-header_osk" onClick={() => toggleAccordion(item.id)}>
                <p className="MyGatherInquiryList_meta_osk">
                  <strong>{item.title}</strong> | {item.date}
                  <span className="MyGatherInquiryList_inquirer-name_osk"> | 문의자: {item.user}</span>
                </p>
                <span className={`GatherInquiry_status_osk ${item.status === '답변완료' ? 'GatherInquiry_done_osk' : 'GatherInquiry_pending_osk'}`}>{item.status}</span>
              </div>

              {openId === item.id && (
                <div className="MyGatherInquiryList_accordion-body_osk">
                  <p className="MyGatherInquiryList_question_osk">Q. {item.question}</p>
                  {item.answer ? (
                    <div className="MyGatherInquiryList_answer_osk">
                      <p><strong>A.</strong> {item.answer}</p>
                    </div>
                  ) : activeTab === 'hosted' ? (
                    <>
                      <textarea
                        className="MyGatherInquiryList_answer-textarea_osk"
                        placeholder="답변을 입력해주세요"
                        value={replyText[item.id] || ''}
                        onChange={(e) => handleReplyChange(item.id, e.target.value)}
                      />
                      <button className="MyGatherInquiryList_submit-btn_osk" onClick={() => handleReplySubmit(item.id)}>
                        답변 등록
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}