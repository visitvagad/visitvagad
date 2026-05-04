import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-4 mt-8 pb-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full border border-outline-variant/30 text-on-surface/50 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-outline-variant/30 disabled:hover:text-on-surface/50 transition-all"
      >
        Previous
      </button>
      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
        {currentPage} / {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full border border-outline-variant/30 text-on-surface/50 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-outline-variant/30 disabled:hover:text-on-surface/50 transition-all"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
