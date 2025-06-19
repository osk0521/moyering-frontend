import React, { useState, useEffect } from 'react';
import { url } from "/src/config";
import axios from "axios";
import Layout from './Layout';
import './BadgeAndScore.css';

const BadgeAndScore = () => {
  const [badgeList, setBadgeList] = useState([]);
  const [scoreList, setScoreList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingScore, setEditingScore] = useState(null); // 현재 편집 중인 점수 항목
  const [editValue, setEditValue] = useState(''); // 편집 중인 값

  // 컴포넌트 마운트시 데이터 로드
  useEffect(() => {
    loadBadgeData();
    loadScoreData();
  }, []);

  // 배지 목록 로드
  const loadBadgeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/badge`);
      setBadgeList(response.data || []);
    } catch (error) {
      console.error('배지 목록 로드 실패:', error);
      // 더미 데이터
      setBadgeList([
        {
          badgeId: 1,
          badgeName: '모야새싹',
          badgeDescription: '가입 환호 회원',
          badgeImage: 'badge_moyasessak.png',
          criteriaValue: 0,
          badgeType: 'signup'
        },
        {
          badgeId: 2,
          badgeName: '모야차차',
          badgeDescription: '식사하게 활동 중인 열정 가득 별이리!',
          badgeImage: 'badge_moyachacha.png',
          criteriaValue: 100,
          badgeType: 'points'
        },
        {
          badgeId: 3,
          badgeName: '모야인싸',
          badgeDescription: '활약이 뽑뽑! 활동력이 폭발 좋은 에이스!',
          badgeImage: 'badge_moyainssa.png',
          criteriaValue: 300,
          badgeType: 'points'
        },
        {
          badgeId: 4,
          badgeName: '모야고수',
          badgeDescription: '커뮤니티의 숨은 고수, 지혜로운 리더!',
          badgeImage: 'badge_moyagosu.png',
          criteriaValue: 1000,
          badgeType: 'points'
        },
        {
          badgeId: 5,
          badgeName: '모야러너',
          badgeDescription: '하나 이상의 클래스를 수강한 회원',
          badgeImage: 'badge_moyalearner.png',
          badgeType: 'class'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 점수 기준 목록 로드
  const loadScoreData = async () => {
    try {
      const response = await axios.get(`${url}/api/score-criteria`);
      setScoreList(response.data || []);
    } catch (error) {
      console.error('점수 기준 로드 실패:', error);
      // 더미 데이터
      setScoreList([
        {
          scoreId: 1,
          scoreName: '게시글 작성',
          scoreValue: 10,
          scoreIcons: []
        },
        {
          scoreId: 2,
          scoreName: '댓글 작성',
          scoreValue: 5,
          scoreIcons: []
        },
        {
          scoreId: 3,
          scoreName: '게시글 좋아요 받음',
          scoreValue: 2,
          scoreIcons: []
        },
        {
          scoreId: 4,
          scoreName: '클래스 후기 작성',
          scoreValue: 20,
          scoreIcons: []
        },
        {
          scoreId: 5,
          scoreName: '클래스 수강',
          scoreValue: 50,
          scoreIcons: []
        }
      ]);
    }
  };

  // 배지 삭제
  const deleteBadge = async (badgeId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    
    try {
      const response = await axios.delete(`${url}/api/badge/${badgeId}`);
      
      if (response.status === 204 || response.status === 200) {
        alert('배지가 삭제되었습니다.');
        setBadgeList(prevList => prevList.filter(badge => badge.badgeId !== badgeId));
      }
    } catch (error) {
      console.error('배지 삭제 실패:', error);
      alert('배지 삭제에 실패했습니다.');
    }
  };

  // 점수 기준 수정
  const updateScoreCriteria = async (scoreId, newValue) => {
    try {
      const response = await axios.patch(`${url}/api/score-criteria/${scoreId}`, {
        scoreValue: newValue
      });
      
      if (response.status === 200) {
        alert('점수가 수정되었습니다.');
        setScoreList(prevList =>
          prevList.map(score =>
            score.scoreId === scoreId 
              ? { ...score, scoreValue: newValue }
              : score
          )
        );
      }
    } catch (error) {
      console.error('점수 수정 실패:', error);
      alert('점수 수정에 실패했습니다.');
    }
  };

  // 편집 시작
  const startEdit = (scoreId, currentValue) => {
    setEditingScore(scoreId);
    setEditValue(currentValue?.toString() || '');
  };

  // 편집 취소
  const cancelEdit = () => {
    setEditingScore(null);
    setEditValue('');
  };

  // 편집 저장
  const saveEdit = async (scoreId) => {
    const numericValue = parseInt(editValue);
    if (isNaN(numericValue) || numericValue < 0) {
      alert('올바른 숫자를 입력해주세요.');
      return;
    }
    
    await updateScoreCriteria(scoreId, numericValue);
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
                  {/* 배지 삭제 버튼 */}
                  {badge.canDelete && (
                    <button 
                      className="delete-badge-btn"
                      onClick={() => deleteBadge(badge.badgeId)}
                      title="배지 삭제"
                    >
                      🗑️
                    </button>
                  )}

                  {/* 배지 아이콘 */}
                  <div className="badge-icon-container">
                    <img 
                      src={`/${badge.badgeImage}`} 
                      alt={badge.badgeName}
                      className="badge-image"
                      onError={(e) => {
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
                    {badge.criteriaValue !== null && badge.criteriaValue !== undefined && (
                      <div className="badge-criteria">
                        <span className="criteria-label">누적 점수 :</span>
                        <span className="criteria-value">{badge.criteriaValue} 점</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 점수 섹션 */}
          <div className="score-section">
            <div className="score-icons-row">
       
     
            </div>

            <div className="score-table">
              {scoreList.map((score) => (
                <div key={score.scoreId} className="score-row">
                  <div className="score-info">
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
                      <div className="edit-input-group">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, score.scoreId)}
                          className="score-input"
                          autoFocus
                          min="0"
                        />
                        <div className="edit-buttons">
                          <button 
                            className="save-btn"
                            onClick={() => saveEdit(score.scoreId)}
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="score-display">
                        <span className="score-number">{score.scoreValue}</span>
                        <button 
                          className="edit-score-btn"
                          onClick={() => startEdit(score.scoreId, score.scoreValue)}
                        >
                          저장
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