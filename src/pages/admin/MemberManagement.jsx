import React, { useState } from 'react';
import Layout from '../common/Layout';
import './MemberManagement.css';
import MemberDetailModal from './MemberDetailModal'; // 회원 상세 모달 컴포넌트 

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [memberType, setMemberType] = useState('전체'); // 일반/강사 필터
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 회원아이디 선택하면 모달 열기 
  const [selectedMember, setSelectedMember] = useState(null); // 회원 선택
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 

  // 회원 더미 데이터
  const memberData = [
    {
      no: 1, // 일련번호 
      type: '일반', // 회원 구분
      username: 'example1', // 아이디 
      name: '회원1', // 회원명
      email: 'example.com', // 이메일
      phone: '010-1111-1234', // 연락처
      joinDate: '2023-02-10', // 가입일
      use_yn: 'Y', // 이용 여부 (탈퇴나 계정정지 하면 모달에서 N로 변경)
    },
    {
      no: 2,
      type: '강사',
      username: 'teacher1',
      name: '강사1',
      email: 'teacher1@example.com',
      phone: '010-2222-2345',
      joinDate: '2023-03-15',
      use_yn: 'Y',
    },
    {
      no: 3,
      type: '일반',
      username: 'user2',
      name: '회원2',
      email: 'user2@example.com',
      phone: '010-3333-3456',
      joinDate: '2023-04-20',
      use_yn: 'N',
    },
    {
      no: 4,
      type: '강사',
      username: 'teacher2',
      name: '강사2',
      email: 'teacher2@example.com',
      phone: '010-4444-4567',
      joinDate: '2023-05-05',
      use_yn: 'Y',
    },
    {
      no: 5,
      type: '일반',
      username: 'user3',
      name: '회원3',
      email: 'user3@example.com',
      phone: '010-5555-5678',
      joinDate: '2023-06-10',
      use_yn: 'Y',
    },
    {
      no: 6,
      type: '강사',
      username: 'teacher3',
      name: '강사3',
      email: 'teacher3@example.com',
      phone: '010-6666-6789',
      joinDate: '2023-07-01',
      use_yn: 'N',
    },
    {
      no: 7,
      type: '일반',
      username: 'user4',
      name: '회원4',
      email: 'user4@example.com',
      phone: '010-7777-7890',
      joinDate: '2023-08-18',
      use_yn: 'Y',
    },
    {
      no: 8,
      type: '강사',
      username: 'teacher4',
      name: '강사4',
      email: 'teacher4@example.com',
      phone: '010-8888-8901',
      joinDate: '2023-09-25',
      use_yn: 'Y',
    },
    {
      no: 9,
      type: '일반',
      username: 'user5',
      name: '회원5',
      email: 'user5@example.com',
      phone: '010-9999-9012',
      joinDate: '2023-10-30',
      use_yn: 'N',
    },
    {
      no: 10,
      type: '강사',
      username: 'teacher5',
      name: '강사5',
      email: 'teacher5@example.com',
      phone: '010-0000-0123',
      joinDate: '2023-11-11',
      use_yn: 'Y',
    }
  ];

  // 검색어 입력받아서 상태에 저장 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 회원 유형 체크 (전체, 일반, 강사)
  const handleMemberTypeChange = (type) => {
    setMemberType(type);
  };

  // 회원 아이디 클릭 시 모달 열기
  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  // 회원 필터 (검색어 + 회원유형 + 가입기간)
  const filteredClasses = memberData.filter((member) => {
    // 대소문자 구분 없이 검색어와 일치하는지 확인
    const matchesSearch =
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) || // 아이디 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || // 이름 
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) || // 이메일
      member.phone.toLowerCase().includes(searchTerm.toLowerCase()); // 연락처

    // 회원 유형 매칭 (전체, 일반, 강사)
    const matchesType = memberType === '전체' || member.type === memberType;

    const join = new Date(member.joinDate); // 가입일 
    const start = startDate ? new Date(startDate) : null; // 시작일 (없으면 NULL)
    const end = endDate ? new Date(endDate) : null; // 종료일 (없으면 NULL)

    const matchesDate =
      (!start || join >= start) &&  // 시작일 없거나, 가입일이 시작일 이후
      (!end || join <= end);  // 종료일 없거나, 가입일이 종료일 이전

    // 3개 조건 모두 true인 회원만 filterMembers 포함 
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <Layout>
      <div className="managementHYHY">
        {/* 페이지 제목 */}
        <div className="page-titleHYHY">
          <h1>회원 관리</h1>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="controls-sectionHYHY">
          <div className="search-sectionHYHY">
            {/* 검색 박스 */}
            <div className="search-boxHYHY">
              <span className="search-iconHYHY">🔍</span>
              <input
                type="text"
                placeholder="회원 아이디, 이메일 검색"
                value={searchTerm}
                onChange={handleSearch}
                className="search-inputHYHY"
              />
            </div>
            
            {/* 가입기간 필터 */}
            <label className="date-labelHYHY">가입기간</label>
            <input
              type="date"
              className="date-inputHYHY"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="date-separatorHYHY">~</span>
            <input
              type="date"
              className="date-inputHYHY"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* 회원 유형 필터 */}
          <div className="filter-sectionHYHY">
            {['전체', '일반', '강사'].map(type => (
              <button 
                key={type}
                className={`filter-btnHY ${memberType === type ? 'active' : ''}`}
                onClick={() => handleMemberTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 필터된 결과 수 */}
        <div className="result-countHYHY">
          총 <strong>{filteredClasses.length}</strong>건
        </div>

        {/* 회원 테이블 */}
        <div className="table-containerHYHY">
          <table className="tableHYHY">
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
              {filteredClasses.map(member => (
                <tr key={member.no}>
                  <td>{member.no}</td>
                  <td>
                    <span className={`member-typeHY ${member.type === '강사' ? 'instructor' : 'general'}`}>
                      {member.type}
                    </span>
                  </td>
                  {/* 회원아이디 클릭하면 회원상세보기 모달창으로 이동 */}
                  <td>
                    <span 
                      className="username-linkHYHY"
                      onClick={() => handleMemberClick(member)}
                    >
                      {member.username}
                    </span>
                  </td>
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

        {/* 회원 상세 모달 */}
        {isModalOpen && selectedMember && (
          <div className="modal-overlayHYHY">
            <div className="modal-contentHYHY">
              <MemberDetailModal 
                member={selectedMember}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MemberManagement;