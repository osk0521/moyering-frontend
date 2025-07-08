import React, { useState, useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "../../../atoms";
import './GatheringChat.css';
import { BsPaperclip, BsArrowUpCircleFill } from "react-icons/bs";
import { HiOutlineMenu } from "react-icons/hi";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../common/Header";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router-dom";
import { url, myAxios } from "../../../config";
import GatheringChatRoom from "./GatheringChatRoom";

export default function GatheringChatRoomList() {

  const user = useAtomValue(userAtom);    
  const [token,setToken] = useAtom(tokenAtom)
  const userId = user.id;
  const navigate = useNavigate();

  const [chatRooms, setChatRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('개더링');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  
  // 초기 데이터 로드
  useEffect(() => {
    if (!token) return;

    const loadChatRooms = async () => {
      try {
        const response = await myAxios(token, setToken).get('/user/messageRoomList');
        if (response.data?.myMessageRoomList) {
          const activeChatRooms = response.data.myMessageRoomList.filter(room => 
            !room.hasLeft && room.gatheringState !== null
          );
          const sortedRooms = activeChatRooms.sort((a, b) => 
            new Date(b.meetingDate) - new Date(a.meetingDate)
          );
          setChatRooms(sortedRooms);
          // 첫 번째 방을 기본 선택
          if (sortedRooms.length > 0) {
            setSelectedRoomId(sortedRooms[0].gatheringId);
          }
        }
      } catch (error) {
        console.error('채팅방 리스트 로드 실패:', error);
      }
    };

    loadChatRooms();
  }, [token, setToken]);

  // 30초마다 채팅방 리스트 새로고침
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      // 백그라운드에서 조용히 업데이트 (로딩 상태 표시 안함)
      myAxios(token, setToken)
        .get('/user/messageRoomList')
        .then(response => {
          if (response.data?.myMessageRoomList) {
            const activeChatRooms = response.data.myMessageRoomList.filter(room => 
              !room.hasLeft && room.gatheringState !== null
            );
            const sortedRooms = activeChatRooms.sort((a, b) => 
              new Date(b.meetingDate) - new Date(a.meetingDate)
            );
            setChatRooms(sortedRooms);
          }
        })
        .catch(error => {
          console.warn('채팅방 리스트 백그라운드 업데이트 실패:', error);
        });
    }, 30000);

    return () => clearInterval(interval);
  }, [token, setToken]);

  const handleRoomClick = (gatheringId) => {
    setSelectedRoomId(gatheringId);
  };

  const selectedRoom = chatRooms.find(room => room.gatheringId === selectedRoomId);

  return (
  <div>
    <Header />
    <div className="GatheringChat_chat-app_osk">
      <div className="GatheringChat_main-content_osk">
        <aside className="GatheringChat_sidebar_osk">
          <div className="GatheringChat_chat-tabs_osk">
            <button 
              className={`GatheringChat_tab_osk ${activeTab === '개더링' ? 'GatheringChat_active_osk' : ''}`}
              onClick={() => setActiveTab('개더링')}
            >
              개더링
            </button>
            {/* <button 
              className={`GatheringChat_tab_osk ${activeTab === 'DM' ? 'GatheringChat_active_osk' : ''}`}
              onClick={() => setActiveTab('DM')}
            >
              DM
            </button> */}
          </div>
          <div className="GatheringChat_chat-room-list_osk">
            {chatRooms.map(room => (
              <div 
                key={`room-${room.gatheringId}`} 
                className={`GatheringChat_chat-room-item_osk ${selectedRoomId === room.gatheringId ? ' GatheringChat_chat-room-selected-item_osk' : ''}`}
                onClick={() => handleRoomClick(room.gatheringId)}
              >
                <div className="GatheringChat_room-avatar_osk">
                  {room.thumbnailFileName && (
                    <img 
                      src={`${url}/image?filename=${room.thumbnailFileName}`} 
                      alt={room.gatheringTitle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  )}
                </div>
                <div className="GatheringChat_room-info_osk">
                  <div className="GatheringChat_room-name_osk">{room.gatheringTitle}</div>
                  <div className="GatheringChat_room-last-message_osk">
                    모임일: {room.meetingDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
        {/* Chat Area */}
        {selectedRoomId ? (
          <GatheringChatRoom 
            gatheringId={selectedRoomId} 
            roomTitle={selectedRoom?.gatheringTitle || '채팅방'}
          />
        ) : (
          <main className="GatheringChat_chat-area_osk">
            <div className="GatheringChat_chat-header_osk">
              <h2>채팅방을 선택해주세요</h2>
            </div>
          </main>
        )}
      </div>
    </div>
    <Footer />
    </div>
  );
}