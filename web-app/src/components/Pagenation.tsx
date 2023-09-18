import React from 'react';

interface PageNationPropsType {
  total: number;
  limit: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isArrow?: boolean;
}

const PageNation = ({ total, limit, page, setPage, isArrow = true }: PageNationPropsType) => {
  const numPages = Math.ceil(total / limit);
  return (
    <div className="notice-paginator">
      {isArrow && (
        <button onClick={() => setPage((page = 1))} disabled={page === 1}>
          <span className="pi pi-angle-double-left"></span>
        </button>
      )}

      {isArrow && (
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          <span className="pi pi-angle-left"></span>
        </button>
      )}
      <div className="paginator-number">
        {Array(numPages)
          .fill('')
          .map((_, i) => (
            <div className={page - 1 === i ? 'active' : ''} key={i + 1} onClick={() => setPage(i + 1)}>
              {i + 1}
            </div>
          ))}
      </div>

      {isArrow && (
        <button onClick={() => setPage(page + 1)} disabled={page === numPages}>
          <span className="pi pi-angle-right"></span>
        </button>
      )}

      {isArrow && (
        <button onClick={() => setPage((page = numPages))} disabled={page === numPages}>
          <span className="pi pi-angle-double-right"></span>
        </button>
      )}
    </div>
  );
};

export default PageNation;
