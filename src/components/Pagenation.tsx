import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  if (totalPages <= 1) return null;

  const startPage = Math.max(page - 2, 1);
  const endPage = Math.min(startPage + 4, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className='flex justify-center items-center gap-2 mt-6'>
      {/* 이전 */}
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className='flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 disabled:opacity-40'
      >
        <FiChevronLeft size={18} />
      </button>

      {/* 페이지 번호 */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-md text-sm font-medium transition
          ${page === p ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
        >
          {p}
        </button>
      ))}

      {/* 다음 */}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className='flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 disabled:opacity-40'
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
