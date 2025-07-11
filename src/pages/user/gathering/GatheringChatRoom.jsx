import React, { useState, useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../../atoms";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { HiOutlineMenu } from "react-icons/hi";
import { url, myAxios } from "../../../config";

export default function GatheringChatRoom({ gatheringId, roomTitle, roomStatus, ownerUserId }) {
  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
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

  // 날짜별로 메시지 그룹화
  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const date = msg.writeDate.split(' ')[0]; // YYYY-MM-DD 형식
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });
    return grouped;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // 시간 포맷팅 (오전/오후 시:분 형식)
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    if (!token || !gatheringId) return;
    
    myAxios(token, setToken)
      .get('/user/messageRoom/' + gatheringId)
      .then(response => {
        if (response.data?.myMessageRoomList) {
          const messages = response.data.myMessageRoomList;
          console.log('원본 메시지들:', messages);
          
          // 메시지 처리
          const processedMessages = messages.map(msg => ({
            ...msg,
            isMyMessage: msg.senderId === user.id,
            // messageHide가 true면 이미 서버에서 "주최자가 가린 메시지 입니다"로 처리됨
          }));
          
          // 날짜순으로 정렬 (오래된 것부터)
          processedMessages.sort((a, b) => new Date(a.writeDate) - new Date(b.writeDate));
          
          console.log('최종 처리된 메시지들:', processedMessages);
          setMessages(processedMessages);
        } else {
          console.log('myMessageRoomList가 없음');
          setMessages([]);
        }
      })
      .catch(error => {
        console.error('=== 에러 ===');
        console.error('메시지 리스트 로드 실패:', error);
        setMessages([]);
      });
  }, [token, setToken, gatheringId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // 비활성화 상태일 때 메시지 전송 차단
    if (roomStatus === '비활성화') {
      alert('이 채팅방은 비활성화되어 메시지를 보낼 수 없습니다.');
      return;
    }

    try {
      const messageData = {
        gatheringId: parseInt(gatheringId),
        content: message.trim()
      };

      const response = await myAxios(token, setToken)
        .post('/user/sendMessage', messageData);

      if (response.status === 200) {
        setMessage('');
        const newMessage = {
          gatheringId: parseInt(gatheringId),
          senderId: user.id,
          senderNickname: user.nickname || '나',
          senderProfile: user.profile,
          messageContent: message.trim(),
          writeDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
          messageHide: false,
          isMyMessage: true
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 메시지 렌더링
  const renderMessage = (msg, index) => {
    // 내 메시지인 경우
    if (msg.isMyMessage) {
      return (
        <div key={`${msg.messageId}-${index}`} className="GatheringChat_my-message-container_osk">
          <div className="GatheringChat_my-message-content_osk">
            <div className="GatheringChat_my-message-bubble_osk">
              {msg.messageHide || msg.messageContent === "주최자가 가린 메시지 입니다" 
                ? "주최자가 가린 메시지입니다" 
                : msg.messageContent}
            </div>
            <div className="GatheringChat_my-message-time_osk">
              {formatTime(msg.writeDate)}
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
      );
    }
    return (
      <div key={`${msg.messageId}-${index}`} className="GatheringChat_user-message_osk">
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
          <div className="GatheringChat_message-text_osk">
            {msg.messageHide || msg.messageContent === "주최자가 가린 메시지 입니다" 
              ? "주최자가 가린 메시지입니다" 
              : msg.messageContent}
          </div>
          <div className="GatheringChat_message-time_osk">
            {formatTime(msg.writeDate)}
          </div>
        </div>
      </div>
    );
  };
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <main className="GatheringChat_chat-area_osk">
      <div className="GatheringChat_chat-header_osk">
        <h2>
          {roomTitle || '채팅방'}
          {roomStatus === '비활성화' && (
            <span style={{ 
              marginLeft: '10px', 
              fontSize: '14px', 
              color: '#999',
              fontWeight: 'normal'
            }}>
              (비활성화)
            </span>
          )}
        </h2> 
        {user.id === ownerUserId && (
          <button className="GatheringChat_menu-btn_osk">
            <HiOutlineMenu />
          </button>
        )}
      </div>

      <div className="GatheringChat_chat-messages_osk">
        {messages.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            메시지가 없습니다.
          </div>
        ) : (
          Object.keys(groupedMessages)
            .sort() // 날짜순 정렬
            .map(date => (
              <div key={date}>
                {/* 날짜 구분선 */}
                <div className="GatheringChat_date-divider_osk">
                  {formatDate(date)}
                </div>
                {/* 해당 날짜의 메시지들 */}
                {groupedMessages[date].map((msg, index) => renderMessage(msg, index))}
              </div>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {gatheringId && (
        <div className="GatheringChat_chat-input-container_osk">
          {roomStatus === '비활성화' ? (
            // 비활성화 상태일 때 표시할 메시지
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#999',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              margin: '10px'
            }}>
              이 채팅방은 비활성화되어 메시지를 보낼 수 없습니다.
            </div>
          ) : (
            // 활성화 상태일 때 입력창 표시
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
                style={{ 
                  cursor: 'pointer',
                  color: message.trim() ? '#ff6b35' : '#ccc'
                }}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}