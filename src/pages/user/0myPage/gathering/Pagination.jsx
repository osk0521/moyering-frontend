import "./Pagination.css";

export default function Pagination({ pageInfo, onPageChange, loading }) {
  if (!pageInfo || pageInfo.allPage <= 1) return null;

  const pageNums = [];
  for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
    pageNums.push(i);
  }

  return (
    <div className="Pagination_container">
      {pageInfo.curPage > 1 && (
        <button
          className="Pagination_button"
          onClick={() => onPageChange(pageInfo.curPage - 1)}
          disabled={loading}
        >
          〈
        </button>
      )}

      {pageNums.map((num) => (
        <button
          key={num}
          className={`Pagination_button ${
            pageInfo.curPage === num ? "Pagination_button--active" : ""
          }`}
          onClick={() => onPageChange(num)}
          disabled={loading}
        >
          {num}
        </button>
      ))}

      {pageInfo.curPage < pageInfo.allPage && (
        <button
          className="Pagination_button"
          onClick={() => onPageChange(pageInfo.curPage + 1)}
          disabled={loading}
        >
          〉
        </button>
      )}
    </div>
  );
}
