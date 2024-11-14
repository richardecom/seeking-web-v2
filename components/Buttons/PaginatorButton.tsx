import React from 'react';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '@/app/types/pagination';

interface PaginatorButtonProps {
    pagination: Pagination;
    onPageChange: (page: number) => void;
    currentPage: number;
}

const PaginatorButton = ({ pagination, onPageChange, currentPage }: PaginatorButtonProps) => {
    return (
        <div className='block items-center align-center'>
            <div className='flex space-x-1  items-center justify-center mb-2'>
                <button
                    type="button"
                    className={`flex items-center justify-center rounded-md w-8 h-9 text-sm font-semibold text-white shadow-sm transition duration-300 ${currentPage === 1 || pagination.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b00202] hover:bg-[#800000]'}`}
                    disabled={currentPage === 1 || pagination.total === 0}
                    onClick={() => currentPage > 1 && onPageChange(1)}
                >
                    <ChevronFirst className='p-1' />
                </button>

                <button
                    type="button"
                    className={`flex items-center justify-center rounded-md w-8 h-9 text-sm font-semibold text-white shadow-sm transition duration-300 ${currentPage === 1 || pagination.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b00202] hover:bg-[#800000]'}`}
                    disabled={currentPage === 1 || pagination.total === 0}
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}>
                    <ChevronLeft className='p-1' />
                </button>

                <button
                    type="button"
                    className={`flex items-center justify-center rounded-md w-8 h-9 text-sm font-semibold text-white shadow-sm transition duration-300 ${currentPage === pagination.pages || pagination.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b00202] hover:bg-[#800000]'}`}
                    disabled={currentPage === pagination.pages || pagination.total === 0}
                    onClick={() => currentPage < pagination.pages && onPageChange(currentPage + 1)}>
                    <ChevronRight className='p-1' />
                </button>

                <button
                    type="button"
                    className={`flex items-center justify-center rounded-md w-8 h-9 text-sm font-semibold text-white shadow-sm transition duration-300 ${currentPage === pagination.pages || pagination.total === 0  ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b00202] hover:bg-[#800000]'}`}
                    disabled={currentPage === pagination.pages || pagination.total === 0}
                    onClick={() => currentPage < pagination.pages && onPageChange(pagination.pages)} >
                    <ChevronLast className='p-1' />
                </button>
            </div>
            <div className='text-[11px] font-medium text-gray-700'>
                Page {currentPage} of {pagination.pages} | Total Entries: {pagination.total}
            </div>
        </div>
    );
};

export default PaginatorButton;
