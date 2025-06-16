// GatheringChat.jsx
import React, { useState } from 'react';
import './GatheringChat.css';
import { BsPaperclip, BsArrowUpCircleFill } from "react-icons/bs";
import { HiOutlineMenu } from "react-icons/hi";

export default function Chat() {
  const [activeTab, setActiveTab] = useState('개더링');
  const [message, setMessage] = useState('');

  const chatRooms = [
    { id: 1, name: '테스트링입니다.', lastMessage: '🔔', time: '', unread: false },
    { id: 2, name: '워너 브로콜리로 함께가요✨', lastMessage: '111', time: '3분 전', unread: true, count: 1 }
  ];

  const messages = [
    { id: 1, text: '2023년 5월 24일 토요일', type: 'date' },
    { id: 2, text: 'sko 님이 들어왔습니다.', type: 'notification' },
    { id: 3, text: '테스트를 님이 들어왔습니다.', type: 'notification' },
    { id: 4, sender: '테스트를', text: 'abc', type: 'message', avatar: true },
    { id: 5, text: 'efg', type: 'my-message' },
    { id: 6, text: '채팅방 관리자가 채팅방을 만들었습니다.', type: 'notification' }
  ];

  return (
    <div className="GatheringChat_chat-app_osk">
      <div className="GatheringChat_main-content_osk">
        {/* Sidebar */}
        <aside className="GatheringChat_sidebar_osk">
          <div className="GatheringChat_chat-tabs_osk">
            <button 
              className={`GatheringChat_tab_osk ${activeTab === '개더링' ? 'GatheringChat_active_osk' : ''}`}
              onClick={() => setActiveTab('개더링')}
            >
              개더링
            </button>
            <button 
              className={`GatheringChat_tab_osk ${activeTab === 'DM' ? 'GatheringChat_active_osk' : ''}`}
              onClick={() => setActiveTab('DM')}
            >
              DM
            </button>
          </div>
          <div className="GatheringChat_chat-room-list_osk">
            {chatRooms.map(room => (
              <div key={room.id} className="GatheringChat_chat-room-item_osk">
                <div className="GatheringChat_room-avatar_osk"></div>
                <div className="GatheringChat_room-info_osk">
                  <div className="GatheringChat_room-name_osk">{room.name}</div>
                  <div className="GatheringChat_room-last-message_osk">{room.lastMessage}</div>
                </div>
                {room.unread && (
                  <div className="GatheringChat_unread-badge_osk">{room.count}</div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="GatheringChat_chat-area_osk">
          <div className="GatheringChat_chat-header_osk">
            <h2>테스트링입니다.</h2>
            <button className="GatheringChat_menu-btn_osk"><HiOutlineMenu /></button>
          </div>

          <div className="GatheringChat_chat-messages_osk">
            {messages.map(msg => (
              <div key={msg.id}>
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
              {/* <button className="GatheringChat_attach-btn_osk"><BsPaperclip size={18} /></button> */}
              <input 
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
                className="GatheringChat_message-input_osk"
              />
              <BsArrowUpCircleFill size={22} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
