// import React, { useState, useEffect } from 'react';

// const VisitorStats = () => {
//   const [stats, setStats] = useState(null);
  
//   useEffect(() => {
//     fetchStats();
//     // 1분마다 자동 갱신
//     const interval = setInterval(fetchStats, 60000);
//     return () => clearInterval(interval);
//   }, []);
  
//   const fetchStats = async () => {
//     try {
//       const response = await fetch('/api/visitor-stats');
//       const data = await response.json();
//       setStats(data);
//     } catch (error) {
//       console.error('통계 조회 실패:', error);
//     }
//   };
  
//   if (!stats) return <div>Loading...</div>;
  
//   return (
//     <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px' }}>
//       <h3>📊 방문자 현황</h3>
//       <p><strong>오늘 방문자:</strong> {stats.visitorCount}명</p>
//       <p><strong>회원:</strong> {stats.memberCount}명 | <strong>비회원:</strong> {stats.guestCount}명</p>
//       <button onClick={fetchStats}>🔄 새로고침</button>
//     </div>
//   );
// };

// export default VisitorStats;