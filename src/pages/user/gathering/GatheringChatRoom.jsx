import React, { useState, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../../atoms";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { HiOutlineMenu } from "react-icons/hi";
import { url, myAxios } from "../../../config";

export default function GatheringChatRoom({ gatheringId, roomTitle }) {
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // null 값 처리
  if (!gatheringId || gatheringId === 'null' || roomTitle === 'null' || roomTitle === null) {
    return (
      <main className="GatheringChat_chat-area_osk">
        <div className="GatheringChat_chat-header_osk">
          <h2>채팅방 정보가 없습니다</h2>
        </div>
        <div className="GatheringChat_chat-messages_osk">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            올바른 채팅방을 선택해주세요.
          </div>
        </div>
      </main>
    );
  }

 // 먼저 이 간단한 버전으로 테스트해보세요
useEffect(() => {
  if (!token || !gatheringId) return;
  console.log('=== 시작 ===');
  console.log('gatheringId:', gatheringId);
  console.log('user:', user);
  
  myAxios(token, setToken)
    .get('/user/messageRoom/' + gatheringId)
    .then(response => {
      console.log('=== API 응답 ===');
      console.log('전체 응답:', response);
      console.log('response.data:', response.data);
      console.log('myMessageRoomList 존재 여부:', !!response.data?.myMessageRoomList);
      console.log('myMessageRoomList 길이:', response.data?.myMessageRoomList?.length);
      
      if (response.data?.myMessageRoomList) {
        const messages = response.data.myMessageRoomList;
        console.log('원본 메시지들:', messages);
        
        // 일단 원본 메시지를 그대로 설정해서 렌더링 되는지 확인
        const simpleMessages = messages.map((msg, index) => ({
          ...msg,
          type: 'message', // 일단 모든 메시지를 'message' 타입으로
          isMyMessage: msg.senderId === user.id
        }));
        
        console.log('처리된 메시지들:', simpleMessages);
        setMessages(simpleMessages);
      } else {
        console.log('myMessageRoomList가 없음');
        setMessages([]);
      }
    })
    .catch(error => {
      console.error('=== 에러 ===');
      console.error('메시지 리스트 로드 실패:', error);
    });
}, [token, setToken, gatheringId, user.id]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const newMessage = {
        messageId: Date.now(),
        messageContent: message,
        type: 'my-message',
        senderId: user.id,
        senderNickname: user.nickname || '나',
        writeDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        messageHide: false,
        isMyMessage: true
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
        <h2>{roomTitle || '채팅방'}</h2>
        <button className="GatheringChat_menu-btn_osk">
          <HiOutlineMenu />
        </button>
      </div>

      <div className="GatheringChat_chat-messages_osk">
        {!gatheringId && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            채팅방을 선택해주세요.
          </div>
        )}
        {gatheringId && messages.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            메시지가 없습니다.
          </div>
        )}
        {gatheringId && messages.map((msg, index) => (
          <div key={index}>
            {msg.type === 'date' && (
              <div className="GatheringChat_date-divider_osk">{msg.writeDate}</div>
            )}
            {msg.type === 'notification' && (
              <div className="GatheringChat_notification_osk">주최자가 가린 메시지입니다</div>
            )}
            {msg.type === 'message' && (
              <div className="GatheringChat_user-message_osk">
                <div className="GatheringChat_message-avatar_osk">
                  <img
                    src={msg.senderProfile ? `${url}/image?filename=${msg.senderProfile}` : '/default-profile.png'}
                    alt={msg.senderNickname || '사용자'}
                    className="GatheringChat_message-avatar-img_osk"
                    onError={(e) => {
                      e.target.src = '/default-profile.png';
                    }}
                  />
                </div>
                <div className="GatheringChat_message-content_osk">
                  <div className="GatheringChat_sender-name_osk">{msg.senderNickname}</div>
                  <div className="GatheringChat_message-text_osk">{msg.messageContent}</div>
                  <div className="GatheringChat_message-time_osk">
                    {msg.writeDate.split(' ')[1]?.substring(0, 5)}
                  </div>
                </div>
              </div>
            )}
            {msg.type === 'my-message' && (
              <div className="GatheringChat_my-message-container_osk">
                <div className="GatheringChat_my-message-content_osk">
                  <div className="GatheringChat_my-message-bubble_osk">{msg.messageContent}</div>
                  <div className="GatheringChat_my-message-time_osk">
                    {msg.writeDate.split(' ')[1]?.substring(0, 5)}
                  </div>
                </div>
                <div className="GatheringChat_message-avatar_osk">
                  <img
                    src={msg.senderProfile ? `${url}/image?filename=${msg.senderProfile}` : '/default-profile.png'}
                    alt={msg.senderNickname || '나'}
                    className="GatheringChat_message-avatar-img_osk"
                    onError={(e) => {
                      e.target.src = '/default-profile.png';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {gatheringId && (
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
      )}
    </main>
  );
}