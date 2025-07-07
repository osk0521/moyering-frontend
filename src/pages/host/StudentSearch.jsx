import React, { useEffect, useState } from 'react';
import './StudentSearch.css';
import { myAxios } from './../../config';
import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from './../../atoms';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);
  const [students, setStudents] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [enrolledClasses, setEnrolledClasses] = useState({});

  useEffect(() => {
    token &&
      myAxios(token, setToken)
        .get("/host/studentList", {
          params: {
            hostId: user.hostId,
          },
        })
        .then((res) => {
          setStudents(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [token]);


  const handleSearch = (page = 0) => {
    const params = {
      hostId: user.hostId,
      page: page,
      size: 10,
      keyword: searchQuery,
    };

    token &&
      myAxios(token, setToken)
        .post('/host/student/search', params)
        .then((res) => {
          setStudents(res.data.content);
          setPageInfo(res.data.pageInfo);
        })
        .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const handleReset = () => {
    setSearchQuery('');
    handleSearch(0);
  };

  const fetchPage = (page) => {
    handleSearch(page - 1);
  };

  const handleRowClick = (index, userId) => {
    const alreadyExpanded = expandedIndex === index;
    setExpandedIndex(alreadyExpanded ? null : index);

    if (!alreadyExpanded && !enrolledClasses[userId]) {
      token && myAxios(token, setToken).get('/host/student/classes', {
        params: {
          hostId: user.hostId,
          userId: userId
        }
      })
        .then(res => {
          console.log("특정 클래스")
          console.log(res.data);
          setEnrolledClasses(res.data)
        })
        .catch(err => {
          console.log(err);
        })

    }
  }


  return (
    <>
      <div className="KHJ-class-search-container">
        <h3>수강생 조회</h3>
        <div className="KHJ-search-section">
          <label>검색어</label>
          <div className="KHJ-search-input-container">
            <input
              type="text"
              placeholder="이름을 입력하세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleReset}>초기화</button>
          </div>
        </div>
      </div>

      <div className="KHJ-class-result-container">
        <h4 className="KHJ-inquiry-result">검색 결과 : {students.length}건</h4>
        <table className="KHJ-inquiry-table">
          <thead>
            <tr>
              <th>No</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>이메일</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <React.Fragment key={student.id}>
                <tr onClick={() => handleRowClick(index, student.userId)} className="KHJ-inquiry-summary-row">
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.tel}</td>
                  <td>{student.email}</td>
                </tr>

                {expandedIndex === index && (
                  <tr className="KHJ-inquiry-detail-row">
                    <td colSpan="4">
                      <div className="KHJ-inquiry-dropdown-wrapper open">
                        <div className="KHJ-inquiry-content-wrapper">
                          <div className="KHJ-inquiry-content-box">
                            {enrolledClasses?.length > 0 ? (
                              <table className="KHJ-subclass-table">
                                <thead>
                                  <tr>
                                    <th>클래스 이름</th>
                                    <th>시작 날짜</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {enrolledClasses.map((cls, i) => (
                                    <tr key={cls.calendarId || i}>
                                      <td>{cls.name}</td>
                                      <td>{cls.startDate}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p>수강 중인 클래스가 없습니다.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {pageInfo.allPage > 1 && (
          <div className="KHJ-pagination">
            {(() => {
              const totalPage = pageInfo.allPage;
              const currentPage = pageInfo.curPage;
              const maxButtons = 5;

              let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
              let end = start + maxButtons - 1;

              if (end > totalPage) {
                end = totalPage;
                start = Math.max(1, end - maxButtons + 1);
              }

              const pages = [];

              if (currentPage > 1) {
                pages.push(
                  <button key="prev" onClick={() => fetchPage(currentPage - 1)} className="KHJ-page-button">
                    ◀ 이전
                  </button>
                );
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => fetchPage(i)}
                    className={`KHJ-page-button ${i === currentPage ? 'active' : ''}`}
                  >
                    {i}
                  </button>
                );
              }

              if (currentPage < totalPage) {
                pages.push(
                  <button key="next" onClick={() => fetchPage(currentPage + 1)} className="KHJ-page-button">
                    다음 ▶
                  </button>
                );
              }
              return pages;
            })()}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentSearch;