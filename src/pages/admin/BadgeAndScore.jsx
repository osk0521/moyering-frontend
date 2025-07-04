import React, { useState, useEffect } from 'react';
import { getBadgeImageUrl } from '../../utils/badgeImageUtil';
import Layout from './Layout';
import './BadgeAndScore.css';
import { myAxios } from '../../config';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';

const BadgeAndScore = () => {
  const token = useAtomValue(tokenAtom);
  const [badgeList, setBadgeList] = useState([]);
  const [scoreList, setScoreList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 컴포넌트 마운트시 데이터 로드
  useEffect(() => {
    if (token) {
      loadBadgeAndScoreData();
    }
  }, [token]);

  // 백엔드 API 연동: 배지와 점수 데이터 한 번에 로드
  const loadBadgeAndScoreData = () => {
    setLoading(true);
    
    myAxios(token)
      .get('/api/badge')
      .then(res => {
        console.log('백엔드 응답:', res.data);
        
        if (res.data) {
          // 배지 데이터 매핑
          const mappedBadges = res.data.badges?.map(badge => ({
            badgeId: badge.badgeId,
            badgeName: badge.badgeName,
            badgeDescription: badge.badgeContent,
            badgeImage: getBadgeImageUrl(badge.badgeImg),
            criteriaValue: badge.cumulScore,
            badgeType: 'points',
            canDelete: false,
            originalBadgeImg: badge.badgeImg
          })) || [];

          // 점수 데이터 매핑
          const mappedScores = res.data.badgeScores?.map(score => ({
            scoreId: score.activeScoreId,
            scoreName: score.title,
            scoreValue: score.score,
            scoreIcons: []
          })) || [];

          setBadgeList(mappedBadges);
          setScoreList(mappedScores);
          
          console.log('매핑된 배지:', mappedBadges);
          console.log('매핑된 점수:', mappedScores);
        }
      })
      .catch(error => {
        console.error('데이터 로드 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
      
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 백엔드 API 연동: 점수 수정
  const updateScoreCriteria = (scoreId, newValue) => {
    console.log(`점수 수정 요청: scoreId=${scoreId}, newValue=${newValue}`);
    
    myAxios(token)
      .put(`/api/badge/${scoreId}`, {
        activeScoreId : scoreId,
        score: newValue
      })
      .then(res => {
        console.log('점수 수정 응답:', res.data);
        alert('점수가 수정되었습니다.');
        
        // 로컬 상태 업데이트
        setScoreList(prevList =>
          prevList.map(score =>
            score.scoreId === scoreId 
              ? { ...score, scoreValue: newValue }
              : score
          )
        );
        
        console.log(`점수 수정 완료: ${scoreId} → ${newValue}`);
      })
      .catch(error => {
        console.error('점수 수정 실패:', error);
        
        if (error.response) {
          console.error('서버 응답:', error.response.data);
          alert(`점수 수정에 실패했습니다. (${error.response.status})`);
        } else if (error.request) {
          alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
        } else {
          alert('점수 수정 중 오류가 발생했습니다.');
        }
      });
  };

  // 편집 시작
  const startEdit = (scoreId, currentValue) => {
    console.log(`편집 시작: scoreId=${scoreId}, currentValue=${currentValue}`);
    setEditingScore(scoreId);
    setEditValue(currentValue?.toString() || '');
  };

  // 편집 취소
  const cancelEdit = () => {
    console.log('편집 취소');
    setEditingScore(null);
    setEditValue('');
  };

  // 편집 저장
  const saveEdit = (scoreId) => {
    console.log(`편집 저장 시도: scoreId=${scoreId}, editValue=${editValue}`);
    
    const numericValue = parseInt(editValue);
    
    // 유효성 검사
    if (isNaN(numericValue)) {
      alert('숫자를 입력해주세요.');
      return;
    }
    
    if (numericValue < 0) {
      alert('0 이상의 숫자를 입력해주세요.');
      return;
    }
    
    if (numericValue > 10000) {
      alert('점수는 10000 이하로 입력해주세요.');
      return;
    }
    
    updateScoreCriteria(scoreId, numericValue);
    setEditingScore(null);
    setEditValue('');
  };

  // Enter 키 처리
  const handleKeyPress = (e, scoreId) => {
    if (e.key === 'Enter') {
      saveEdit(scoreId);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <Layout>
      <div className="page-titleHY">
        <h1>배지 관리</h1>
      </div>

      {loading ? (
        <div className="loading-message">로딩 중...</div>
      ) : (
        <>
          {/* 배지 섹션 */}
          <div className="badge-section">
            <div className="badge-cards">
              {badgeList.map((badge) => (
                <div key={badge.badgeId} className="badge-card">
                  {/* 배지 삭제 버튼 (현재 비활성화) */}
                  {badge.canDelete && (
                    <button 
                      className="delete-badge-btn"
                      onClick={() => console.log('배지 삭제 기능 비활성화')}
                      title="배지 삭제"
                    >
                      삭제
                    </button>
                  )}

                  {/* 배지 아이콘 */}
                  <div className="badge-icon-container">
                    <img 
                      src={badge.badgeImage}
                      alt={badge.badgeName}
                      className="badge-image"
                      onError={(e) => {
                        console.log(`이미지 로드 실패: ${badge.badgeName}`);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="badge-fallback" style={{display: 'none'}}>
                      <span className="fallback-text">{badge.badgeName.charAt(0)}</span>
                    </div>
                  </div>

                  {/* 배지 정보 */}
                  <div className="badge-info">
                    <h3 className="badge-name">{badge.badgeName}</h3>
                    <p className="badge-description">{badge.badgeDescription}</p>
                    
                    {/* 누적 점수 */}
                    <div className="badge-criteria">
                      <span className="criteria-label">누적 점수 :</span>
                      <span className="criteria-value">{badge.criteriaValue} 점</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 점수 섹션 */}
          <div className="score-section">
            <div className="score-table">
              {scoreList.map((score) => (
                <div key={score.scoreId} className="score-row">
                  <div className="score-info">
                    {/* 아이콘 표시 (현재는 사용 안함) */}
                    <div className="score-icons">
                      {score.scoreIcons.map((icon, index) => (
                        <span 
                          key={index} 
                          className={`score-icon ${icon === 'H' ? 'blue' : 'green'}`}
                        >
                          {icon}
                        </span>
                      ))}
                    </div>
                    <span className="score-name">{score.scoreName}</span>
                  </div>
                  
                  <div className="score-value-section">
                    {editingScore === score.scoreId ? (
                      // 편집 모드
                      <div className="edit-input-group">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, score.scoreId)}
                          className="score-input"
                          autoFocus
                          min="0"
                          max="10000"
                          placeholder="점수 입력"
                        />
                        <div className="edit-buttons">
                          <button 
                            className="save-btn"
                            onClick={() => saveEdit(score.scoreId)}
                          >
                            저장
                          </button>
                          <button 
                            className="cancel-btn"
                            onClick={cancelEdit}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 표시 모드
                      <div className="score-display">
                        <span className="score-number">{score.scoreValue}</span>
                        <button 
                          className="edit-score-btn"
                          onClick={() => startEdit(score.scoreId, score.scoreValue)}
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default BadgeAndScore;