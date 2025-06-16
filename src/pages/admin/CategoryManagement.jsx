import React, { useState } from 'react';
import Layout from "./Layout";
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const [categories, setCategories] = useState([
    { id: '001', category: '음식 > 요리', isSave: false, isHidden: false, order: 1 },
    { id: '002', category: '스포츠 > 레저', isSave: true, isHidden: false, order: 2 },
    { id: '003', category: '음식 > 요리', isSave: false, isHidden: false, order: 3 },
    { id: '004', category: '스포츠 > 레저', isSave: true, isHidden: false, order: 4 },
    { id: '005', category: '음식 > 요리', isSave: false, isHidden: false, order: 5 },
    { id: '006', category: '스포츠 > 레저', isSave: true, isHidden: false, order: 6 },
    { id: '007', category: '음식 > 요리', isSave: false, isHidden: true, order: 7 },
    { id: '008', category: '스포츠 > 레저', isSave: true, isHidden: true, order: 8 },
    { id: '009', category: '음식 > 요리', isSave: false, isHidden: false, order: 9 },
    { id: '010', category: '스포츠 > 실내', isSave: true, isHidden: false, order: 10 },
    { id: '011', category: '음식 > 요리', isSave: false, isHidden: false, order: 11 },
    { id: '012', category: '스포츠 > 레저', isSave: true, isHidden: false, order: 12 },
    { id: '013', category: '음식 > 요리', isSave: false, isHidden: true, order: 13 },
    { id: '014', category: '스포츠 > 레저', isSave: true, isHidden: true, order: 14 },
    { id: '015', category: '음식 > 요리', isSave: false, isHidden: false, order: 15 },
  ]);

  const filteredCategories = categories
    .filter(category =>
      (category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.id.includes(searchTerm)) &&
      (showHidden || !category.isHidden)
    )
    .sort((a, b) => a.order - b.order);

  const handleSelectAll = () => {
    const visibleIds = filteredCategories.map(cat => cat.id);
    if (selectedItems.length === visibleIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(visibleIds);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newCategories = [...categories];
    const draggedIndex = newCategories.findIndex(cat => cat.id === draggedItem.id);
    const targetIndex = newCategories.findIndex(cat => cat.id === targetItem.id);

    const draggedOrder = draggedItem.order;
    const targetOrder = targetItem.order;

    if (draggedOrder < targetOrder) {
      newCategories.forEach(cat => {
        if (cat.order > draggedOrder && cat.order <= targetOrder) {
          cat.order--;
        }
      });
    } else {
      newCategories.forEach(cat => {
        if (cat.order < draggedOrder && cat.order >= targetOrder) {
          cat.order++;
        }
      });
    }
    newCategories[draggedIndex].order = targetOrder;

    setCategories(newCategories);
    setDraggedItem(null);
  };

  const toggleCategoryVisibility = (id) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, isHidden: !cat.isHidden } : cat
      )
    );
  };

  const toggleSelectedVisibility = (hide) => {
    setCategories(prev =>
      prev.map(cat =>
        selectedItems.includes(cat.id) ? { ...cat, isHidden: hide } : cat
      )
    );
    setSelectedItems([]);
  };

  const deleteSelected = () => {
    if (window.confirm('선택된 카테고리를 삭제하시겠습니까?')) {
      setCategories(prev => prev.filter(cat => !selectedItems.includes(cat.id)));
      setSelectedItems([]);
    }
  };

  return (
    <Layout>
      <div className="page-titleHY">카테고리 관리</div>

      <div className="search-sectionHY">
        {/* 검색창  */}
        <div className="search-boxHY">
          <input
            type="text"
            placeholder="카테고리명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-inputHY"
          />
          <button className="search-btnHY">🔍</button>
        </div>

        <div className="result-infoHY">
          <span className="result-countHY">총 개수</span>
          <span className="count-numberHY">{filteredCategories.length}</span>
        </div>
      </div>

      <div className="control-sectionHY">
        <div className="left-controlsHY">
          <button className="control-btn select-allHY" onClick={handleSelectAll}>
            {selectedItems.length === filteredCategories.length ? '전체해제' : '전체선택'}
          </button>
          <label className="show-hidden-toggleHY">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
            />
            숨긴 항목 보기
          </label>
        </div>

        <div className="right-controlsHY">
          <button
            className="control-btn hide-btnHY"
            onClick={() => toggleSelectedVisibility(true)}
            disabled={selectedItems.length === 0}
          >
            숨기기
          </button>
          <button
            className="control-btn show-btnHY"
            onClick={() => toggleSelectedVisibility(false)}
            disabled={selectedItems.length === 0}
          >
            보이기
          </button>
          <button
            className="control-btn delete-btnHY"
            onClick={deleteSelected}
            disabled={selectedItems.length === 0}
          >
            삭제
          </button>
        </div>
      </div>

      <div className="table-containerHY">
        <table className="tableHY">
          <thead>
            <tr>
              <th className="checkbox-columnHY"></th>      {/* 체크박스열  */}
              <th className="drag-columnHY">배치 순서</th>
              <th className="id-columnHY">카테고리 ID</th>
              <th className="category-columnHY">카테고리명</th>
              <th className="action-columnHY">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr
                key={category.id}
                className={`${
                  selectedItems.includes(category.id) ? 'selected' : ''
                } ${category.isHidden ? 'hidden-item' : ''} draggable-row`}
                draggable
                onDragStart={(e) => handleDragStart(e, category)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category)}
              >
                <td className="checkbox-cellHY">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(category.id)}
                    onChange={() => handleSelectItem(category.id)}
                  />
                </td>
                <td className="drag-cellHY">
                  <span className="drag-handleHY">⋮⋮</span>
                  <span className="order-numberHY">{category.order}</span>
                </td>
                <td className="id-cellHY">{category.id}</td>
                <td className="category-cellHY">{category.category}</td>
                <td className="action-cellHY">
                  <button
                    className={`toggle-btn ${category.isHidden ? 'show' : 'hide'}`}
                    onClick={() => toggleCategoryVisibility(category.id)}
                  >
                    {category.isHidden ? '보이기' : '숨기기'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default CategoryManagement;