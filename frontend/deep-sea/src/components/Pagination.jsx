import React from 'react';
import '../styles/pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageNumbers = () => {
    const pages = [];
    
    // small datasets or starting segments
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
      }
      return (
        <button
          key={`page-${page}`}
          type="button"
          className={`pagination-num-btn ${currentPage === page ? 'active-page' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="pagination-master-wrapper d-flex justify-content-center align-items-center mt-4">
      <button 
        type="button"
        className="pagination-arrow-btn" 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>
      
      <div className="pagination-pages-container mx-2">
        {renderPageNumbers()}
      </div>

      <button 
        type="button"
        className="pagination-arrow-btn" 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
}