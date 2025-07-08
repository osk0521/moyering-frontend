import React, { useState, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../../atoms";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { HiOutlineMenu } from "react-icons/hi";
import { myAxios } from "../../../config";

export default function GatheringChatRoom({ gatheringId, roomTitle }) {
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // 초기 메시지 로드 (임시 데이터)
  useEffect(() => {
    if (!gatheringId) return;

    // TODO: 실제 API 호출로 해당 gatheringId의 메시지들을 가져오기
    // 현재는 임시 데이터 사용
    const tempMessages = [
      { id: 1, text: '2023년 5월 24일 토요일', type: 'date' },
      { id: 2, text: 'sko 님이 들어왔습니다.', type: 'notification' },
      { id: 3, text: '테스트를 님이 들어왔습니다.', type: 'notification' },
      { id: 4, sender: '테스트를', text: 'abc', type: 'message', avatar: true },
      { id: 5, text: 'efg', type: 'my-message' },
      { id: 6, text: '채팅방 관리자가 채팅방을 만들었습니다.', type: 'notification' }
    ];
    setMessages(tempMessages);
  }, [gatheringId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // TODO: 실제 메시지 전송 API 호출
      // await myAxios(token, setToken).post(`/gathering/${gatheringId}/message`, {
      //   content: message
      // });

      // 임시로 로컬 상태에 메시지 추가
      const newMessage = {
        id: Date.now(),
        text: message,
        type: 'my-message'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="GatheringChat_chat-area_osk">
      <div className="GatheringChat_chat-header_osk">
        <h2>{roomTitle}</h2>
        <button className="GatheringChat_menu-btn_osk">
          <HiOutlineMenu />
        </button>
      </div>

      <div className="GatheringChat_chat-messages_osk">
        {messages.map(msg => (
          <div key={`msg-${msg.id}`}>
            {msg.type === 'date' && (
              <div className="GatheringChat_date-divider_osk">{msg.text}</div>
            )}
            {msg.type === 'notification' && (
              <div className="GatheringChat_notification_osk">{msg.text}</div>
            )}
            {msg.type === 'message' && (
              <div className="GatheringChat_user-message_osk">
                <div className="GatheringChat_message-avatar_osk"></div>
                <div className="GatheringChat_message-content_osk">
                  <div className="GatheringChat_sender-name_osk">{msg.sender}</div>
                  <div className="GatheringChat_message-text_osk">{msg.text}</div>
                </div>
              </div>
            )}
            {msg.type === 'my-message' && (
              <div className="GatheringChat_my-message-container_osk">
                <div className="GatheringChat_my-message-bubble_osk">{msg.text}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="GatheringChat_chat-input-container_osk">
        <div className="GatheringChat_input-wrapper_osk">
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
            className="GatheringChat_message-input_osk"
          />
          <BsArrowUpCircleFill 
            size={22} 
            onClick={handleSendMessage}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </main>
  );
}