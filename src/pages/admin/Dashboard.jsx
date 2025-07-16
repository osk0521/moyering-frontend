import React, { useEffect, useState } from 'react';
import Layout from "./Layout";
import './Dashboard.css';
import { myAxios } from './../../config';
import { tokenAtom } from '../../atoms';
import { useAtom } from 'jotai';

const Dashboard = () => {
  // 차트 기간 상태 관리
  const [mainChartPeriod, setMainChartPeriod] = useState('월별');
  const [trendChartPeriod, setTrendChartPeriod] = useState('월별');
  const [token, setToken] = useAtom(tokenAtom);
  const [userList, setUserList] = useState('');
  const [thisMonthMember, setThisMonthMember] = useState('');
  const [visitorLogCount, setVisitorLogCount] = useState('');
  const [currentDateVisitCount, setCurrentDateVisitCount] = useState('');
  const [allSettle, setAllSettle] = useState('');
  const [thisMonthSettle, setThisMonthSettle] = useState('');
  const [visitsByMonth, setVisitsByMonth] = useState([]);
  const [visitsByQuarter, setVisitsByQuarter] = useState([]);
  const [visitsByYear, setVisitsByYear] = useState([]);
  const [todayCalendarCount, setTodayCalendarCount] = useState('');
  const [todaySignClass, setTodaySignClass] = useState('');
  const [todaySettle, setTodaySettle] = useState('');
  const [mainChartData, setMainChartData] = useState({
    '월별': [],
    '분기별': [],
    '년도별': []
  });

  useEffect(() => {
    token && myAxios(token, setToken).get("/api/dashBoard")
      .then(res => {
        console.log(res);
        setUserList(res.data.userList);
        setThisMonthMember(res.data.thisMonthMemberCount);
        setVisitorLogCount(res.data.visitorLogCount);
        setCurrentDateVisitCount(res.data.currentDateVisitCount);
        setAllSettle(res.data.allSettle);
        setThisMonthSettle(res.data.thisMonthSettle);
        setVisitsByMonth(res.data.visitsByMonth);
        setVisitsByQuarter(res.data.visitsByQuarter);
        setVisitsByYear(res.data.visitsByYear);
        setTodayCalendarCount(res.data.todayCalendarCount);
        setTodaySignClass(res.data.todaySignClass);
        setTodaySettle(res.data.todaySettle);
        setMainChartData(prev => ({
          ...prev,
          '월별': res.data.monthlyStats || [],
          '분기별': res.data.resultQuater || [],
          '년도별': res.data.resultYear || [],
        }))
      })
      .catch(err => {
        console.log(err);
      })
  }, [token]);

  // 트렌드 차트 데이터 (기간별)
  const trendData = {
    '월별': Object.entries(visitsByMonth).map(([key, value]) => ({
      label: String(key).padStart(2, '0') + '월',
      value: value
    })),
    '분기별': Object.entries(visitsByQuarter).map(([key, value]) => ({
      label: String(key).padStart(2, '0') + '분기',
      value: value
    })),
    '년도별': Object.entries(visitsByYear).map(([key, value]) => ({
      label: String(key) + '년',
      value: value
    }))
  };

  // 현재 차트 데이터 가져오기
  const currentMainData = mainChartData[mainChartPeriod] || [];
  const currentTrendData = trendData[trendChartPeriod] || [];

  // 최대값 계산 - Y축 스케일 조정으로 바를 더 높게 표시
  const rawMaxClass = currentMainData.length > 0 ? Math.max(...currentMainData.map(d => d.class || 0)) : 100;
    const maxStudent = Math.max(...currentMainData.map(d => d.student));
  // 최대값을 작게 설정해서 바가 더 높게 보이도록 조정
  const maxClass = rawMaxClass <= 10 ? rawMaxClass + 2 : Math.ceil(rawMaxClass * 0.7);
  const maxTrend = currentTrendData.length > 0 ? Math.max(...currentTrendData.map(d => d.value || 0)) : 100;

  // 높이 계산 함수 - 더 극단적으로 높게 조정
  const getBarHeight = (value, max) => {
    if (!value) return '15%';
    // 비율을 더 크게 해서 바가 훨씬 높게 보이도록
    const percentage = (value / max) * 80; // 80%까지 사용
    return `${Math.max(percentage, 40) + 5}%`; // 최소 45% 보장
  };

  const getTrendHeight = (value, max) => {
    if (!value || !max) return 120;
    return 120 - (value / max) * 100;
  };

  // 좌표 계산 함수들 - 완전히 새로 계산
  const getBarChartXCoord = (index, total) => {
    // 바 차트 컨테이너의 실제 너비에서 패딩을 제외한 영역
    const chartPadding = 12; // CSS의 padding과 맞춤
    const availableWidth = 100 - (chartPadding * 2); // 퍼센트 기준
    const barGroupWidth = availableWidth / total;
    return chartPadding + (index * barGroupWidth) + (barGroupWidth / 2);
  };

  const getSVGXCoord = (index, total, svgWidth = 440) => {
    // SVG 좌표계에 맞춰 계산
    const padding = 40; // SVG 내부 패딩
    const chartWidth = svgWidth - (padding * 2);
    const stepWidth = chartWidth / (total - 1);
    return padding + (index * stepWidth);
  };

  const getSVGYCoord = (value, max, svgHeight = 160, isPercentage = false) => {
    if (!value || !max) return svgHeight - 20;
    const padding = 20;
    const chartHeight = svgHeight - (padding * 2);
    
    if (isPercentage) {
      return svgHeight - padding - ((value / 100) * chartHeight);
    } else {
      return svgHeight - padding - ((value / max) * chartHeight);
    }
  };

    // 좌표 계산 함수들
  const getXCoord = (index, total, width = 400, margin = 20) => {
    return (index * width / (total - 1)) + margin;
  };

  const getYCoordForValue = (value, max, baseHeight = 120, height = 80) => {
    return baseHeight - ((value / max) * height);
  };

  const getYCoordForRate = (rate, baseHeight = 120, height = 80) => {
    return baseHeight - ((rate / 100) * height);
  };


  return (
    <Layout>
      <div className="page-titleHY">
        <h1>대시보드</h1>
      </div>

      {/* 상단 통계 카드들 */}
      <div className="stats-gridHY">
        <div className="stat-cardHY">
          <div className="stat-iconHY">👥</div>
          <div className="stat-contentHY">
            <div className="stat-labelHY">총 회원 수</div>
            <div className="stat-valueHY">{userList}</div>
            <div className="stat-changeHY positive">+{thisMonthMember}</div>
          </div>
        </div>

        <div className="stat-cardHY">
          <div className="stat-iconHY">👥</div>
          <div className="stat-contentHY">
            <div className="stat-labelHY">총 방문자 수</div>
            <div className="stat-valueHY">{visitorLogCount}</div>
            <div className="stat-changeHY positive">+{currentDateVisitCount}</div>
          </div>
        </div>

        <div className="stat-cardHY">
          <div className="stat-iconHY">💰</div>
          <div className="stat-contentHY">
            <div className="stat-labelHY">총 매출</div>
            <div className="stat-valueHY">{allSettle}</div>
            <div className="stat-changeHY positive">+{thisMonthSettle}</div>
          </div>
        </div>

        <div className="stat-cardHY">
          <div className="stat-iconHY">👁️</div>
          <div className="stat-contentHY">
            <div className="stat-labelHY">OPEN 클래스</div>
            <div className="stat-valueHY">{todayCalendarCount}</div>
          </div>
        </div>

        <div className="stat-cardHY">
          <div className="stat-iconHY">👁️</div>
          <div className="stat-contentHY">
            <div className="stat-labelHY">클래스 신청 건</div>
            <div className="stat-valueHY blue">{todaySignClass}</div>
          </div>
        </div>

        <div className="stat-cardHY">
          <div className="stat-iconHY">📊</div>
          <div className="stat-contentHY">
            <div className="stat-labelHY">정산 요청 건</div>
            <div className="stat-valueHY blue">{todaySettle}</div>
          </div>
        </div>
      </div>

      {/* 메인 차트 - 클래스 수만 표시 */}
      <div className="main-chart-sectionHY">
        <div className="chart-containerHY">
          <div className="chart-headerHY">
            <h2 className="chart-titleHY">클래스 개설 추이</h2>
            <div className="chart-controlsHY">
              <button
                className={`chart-btnHY ${mainChartPeriod === '월별' ? 'active' : ''}`}
                onClick={() => setMainChartPeriod('월별')}
              >
                월별
              </button>
              <button
                className={`chart-btnHY ${mainChartPeriod === '분기별' ? 'active' : ''}`}
                onClick={() => setMainChartPeriod('분기별')}
              >
                분기별
              </button>
              <button
                className={`chart-btnHY ${mainChartPeriod === '년도별' ? 'active' : ''}`}
                onClick={() => setMainChartPeriod('년도별')}
              >
                년도별
              </button>
            </div>
          </div>

          <div className="chart-contentHY">
            <div className="chart-y-axisHY">
              <span>{Math.round(rawMaxClass * 1.0).toLocaleString()}</span>
              <span>{Math.round(rawMaxClass * 0.75).toLocaleString()}</span>
              <span>{Math.round(rawMaxClass * 0.5).toLocaleString()}</span>
              <span>{Math.round(rawMaxClass * 0.25).toLocaleString()}</span>
              <span>0</span>
            </div>

            <div className="chart-areaHY">
              <div className="bar-chartHY">
                {currentMainData.map((data, index) => (
                  <div key={index} className="chart-groupHY">
                    <div className="chart-bars-containerHY">
                      <div className="barsHY">
                        <div className="bar-wrapperHY">
                          <div
                            className="barHY primary-bar"
                            style={{ height: getBarHeight(data.class, maxClass) }}
                            data-value={data.class || 0}
                          >
                            <div className="bar-glowHY"></div>
                          </div>
                          <span className="bar-tooltipHY">클래스: {(data.class || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="chart-labelHY">
                      <span className="label-textHY">{data.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-y-axis-rightHY">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="chart-legendHY">
            <div className="legend-itemHY">
              <span className="legend-colorHY orange-bgHY"></span>
              <span className="legend-textHY">클래스 수</span>
            </div>
          </div>

          {currentMainData.length > 0 && (
            <div className="chart-stats-boxHY">
              <div className="stats-rowHY">
                <span className="stat-dotHY orangeHY"></span>
                <span>클래스: {(currentMainData[currentMainData.length - 1]?.class || 0).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 트렌드 차트 - 동적 데이터 */}
      <div className="trend-sectionHY">
        <div className="trend-containerHY">
          <div className="trend-headerHY">
            <h3 className="trend-titleHY">방문자 수</h3>
            <div className="trend-controlsHY">
              <button
                className={`trend-btnHY ${trendChartPeriod === '월별' ? 'active' : ''}`}
                onClick={() => setTrendChartPeriod('월별')}
              >
                월별
              </button>
              <button
                className={`trend-btnHY ${trendChartPeriod === '분기별' ? 'active' : ''}`}
                onClick={() => setTrendChartPeriod('분기별')}
              >
                분기별
              </button>
              <button
                className={`trend-btnHY ${trendChartPeriod === '년도별' ? 'active' : ''}`}
                onClick={() => setTrendChartPeriod('년도별')}
              >
                년도별
              </button>
            </div>
          </div>

          <div className="trend-chartHY">
            <div className="trend-y-axisHY">
              <span>{Math.round(maxTrend * 1.2).toLocaleString()}</span>
              <span>{Math.round(maxTrend * 0.9).toLocaleString()}</span>
              <span>{Math.round(maxTrend * 0.6).toLocaleString()}</span>
              <span>{Math.round(maxTrend * 0.3).toLocaleString()}</span>
              <span>0</span>
            </div>

            <div className="trend-areaHY">
              {currentTrendData.length > 0 && (
                <svg className="trend-svgHY" viewBox="0 0 400 150">
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* 영역 차트만 */}
                  <path
                    d={`M 0 ${getTrendHeight(currentTrendData[0]?.value || 0, maxTrend)} ${currentTrendData.map((data, index) =>
                      `L ${(index * 400) / (currentTrendData.length - 1)} ${getTrendHeight(data.value || 0, maxTrend)}`
                    ).join(' ')
                      } L 400 150 L 0 150 Z`}
                    fill="url(#blueGradient)"
                  />
                </svg>
              )}
            </div>

            <div className="trend-x-axisHY">
              {currentTrendData.map((data, index) => (
                <span key={index}>{data.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;