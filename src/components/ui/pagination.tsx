import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Show first 5 pages + ellipsis + last page
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 6) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ellipsis + last 5 pages
        if (totalPages > 6) {
          pages.push('ellipsis');
        }
        for (let i = Math.max(totalPages - 4, 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors',
          'border border-gray-300 bg-white hover:bg-gray-50',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <div
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-9 h-9"
              aria-hidden="true"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => !isActive && onPageChange(page)}
            disabled={isActive}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors',
              'border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              isActive
                ? 'bg-blue-600 text-white border-blue-600 cursor-default'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
            )}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors',
          'border border-gray-300 bg-white hover:bg-gray-50',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export { Pagination };
