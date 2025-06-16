import React, { useState } from 'react';
import './GatheringChat.css';

export default function Chat() {
  const [activeTab, setActiveTab] = useState('개더링');
  const [message, setMessage] = useState('');

  const chatRooms = [
    { id: 1, name: '테스트링입니다.', lastMessage: '🔔', time: '', unread: false },
    { id: 2, name: '워너 힐맨글로소로 형사들이', lastMessage: '안', time: '', unread: true, count: 1 }
  ];

  const messages = [
    { id: 1, text: '2023년 5월 24일 오전', type: 'date' },
    { id: 2, text: 'abc님이 들어왔습니다.', type: 'notification' },
    { id: 3, text: '테스트를 남이 올렸습니다.', type: 'notification' },
    { id: 4, sender: '테스트를', text: 'abc', type: 'message', avatar: true },
    { id: 5, text: 'efg', type: 'my-message' },
    { id: 6, text: '채팅창 리뉴얼로 채원님을 찾았습니다.', type: 'notification' }
  ];

  return (
    <div className="GatheringChat_chat-app_osk">
      {/* Main Content */}
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
            <button className="GatheringChat_close-btn_osk">×</button>
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
            <button className="GatheringChat_menu-btn_osk">☰</button>
          </div>

          <div className="GatheringChat_chat-messages_osk">
            {messages.map(msg => (
              <div key={msg.id} className={`GatheringChat_message_osk ${msg.type}`}>
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
              <button className="GatheringChat_attach-btn_osk">📎</button>
              <input 
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder=""
                className="GatheringChat_message-input_osk"
              />
              <button className="GatheringChat_send-btn_osk">⬆</button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="GatheringChat_footer_osk">
        <div className="GatheringChat_footer-content_osk">
          <div className="GatheringChat_footer-logo_osk">
            <span className="GatheringChat_logo-icon_osk">😊</span>
            <span className="GatheringChat_logo-text_osk">모여링</span>
          </div>
          <div className="GatheringChat_footer-links_osk">
            <a href="#">고객센터</a>
            <a href="#">고객센터</a>
            <a href="#">고객센터</a>
          </div>
          <div className="GatheringChat_footer-info_osk">
            <p>주소 : 05609 서울특별시 송파구 양재대로 932 다저빌딩 지하 1층 명지 318 아뜨(주)</p>
            <p>주소 : 05609 서울특별시 송파구 양재대로 932 다저빌딩 지하 1층 명지 318 아뜨(주)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}