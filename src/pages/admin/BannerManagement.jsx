import React, { useState } from 'react';
import Layout from "./Layout";
import './MemberManagement.css';
import MemberDetailModal from './MemberDetailModal'; // 회원 상세 모달 컴포넌트 

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [memberType, setMemberType] = useState('전체');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const memberData = [
    { no: 1, type: '일반', username: 'example1', name: '회원1', email: 'example.com', phone: '010-1111-1234', joinDate: '2023-02-10', use_yn: 'Y' },
    { no: 2, type: '강사', username: 'teacher1', name: '강사1', email: 'teacher1@example.com', phone: '010-2222-2345', joinDate: '2023-03-15', use_yn: 'Y' },
    { no: 3, type: '일반', username: 'user2', name: '회원2', email: 'user2@example.com', phone: '010-3333-3456', joinDate: '2023-04-20', use_yn: 'N' },
    { no: 4, type: '강사', username: 'teacher2', name: '강사2', email: 'teacher2@example.com', phone: '010-4444-4567', joinDate: '2023-05-05', use_yn: 'Y' },
    { no: 5, type: '일반', username: 'user3', name: '회원3', email: 'user3@example.com', phone: '010-5555-5678', joinDate: '2023-06-10', use_yn: 'Y' },
    { no: 6, type: '강사', username: 'teacher3', name: '강사3', email: 'teacher3@example.com', phone: '010-6666-6789', joinDate: '2023-07-01', use_yn: 'N' },
    { no: 7, type: '일반', username: 'user4', name: '회원4', email: 'user4@example.com', phone: '010-7777-7890', joinDate: '2023-08-18', use_yn: 'Y' },
    { no: 8, type: '강사', username: 'teacher4', name: '강사4', email: 'teacher4@example.com', phone: '010-8888-8901', joinDate: '2023-09-25', use_yn: 'Y' },
    { no: 9, type: '일반', username: 'user5', name: '회원5', email: 'user5@example.com', phone: '010-9999-9012', joinDate: '2023-10-30', use_yn: 'N' },
    { no: 10, type: '강사', username: 'teacher5', name: '강사5', email: 'teacher5@example.com', phone: '010-0000-0123', joinDate: '2023-11-11', use_yn: 'Y' }
  ];

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleMemberTypeChange = (type) => setMemberType(type);
  const handleMemberClick = (member) => { setSelectedMember(member); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedMember(null); };

  const filteredMembers = memberData.filter((member) => {
    const matchesSearch = member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = memberType === '전체' || member.type === memberType;
    const join = new Date(member.joinDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesDate = (!start || join >= start) && (!end || join <= end);
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <Layout>
      <div className="member-managementHY">
        <div className="page-titleHY">
          <h1>회원 관리</h1>
        </div>

        <div className="controls-sectionHY">
          <div className="search-sectionHY">
            <div className="search-boxHY">
              <span className="search-iconHY">🔍</span>
              <input type="text" placeholder="       회원 아이디, 이메일 검색" value={searchTerm} onChange={handleSearch} className="search-inputHY" />
            </div>
            <label className="date-labelHY">가입기간</label>
            <input type="date" className="date-inputHY" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span className="date-separatorHY">~</span>
            <input type="date" className="date-inputHY" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="filter-sectionHY">
            {['전체', '일반', '강사'].map(type => (
              <button key={type} className={`filter-btn ${memberType === type ? 'active' : ''}`} onClick={() => handleMemberTypeChange(type)}>{type}</button>
            ))}
          </div>
        </div>

        <div className="result-countHY">총 <strong>{filteredMembers.length}</strong>건</div>

        <div className="table-containerHY">
          <table className="member-tableHY">
            <thead>
              <tr>
                <th>No</th>
                <th>회원 구분</th>
                <th>아이디</th>
                <th>회원명</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>가입일</th>
                <th>사용여부</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.no}>
                  <td>{member.no}</td>
                  <td><span className={`member-type ${member.type === '강사' ? 'instructor' : 'general'}`}>{member.type}</span></td>
                  <td><span className="username-linkHY" onClick={() => handleMemberClick(member)}>{member.username}</span></td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.joinDate}</td>
                  <td>{member.use_yn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedMember && (
          <div className="modal-overlayHY">
            <div className="modal-contentHY">
              <MemberDetailModal member={selectedMember} onClose={handleCloseModal} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MemberManagement;
