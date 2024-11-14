/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pagination } from '@/app/types/pagination';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface PaginatorButtonProps {
    pagination: Pagination;
    onPageChange: (page: number) => void;
    currentPage: number;
}

const Paginator = ({ pagination, onPageChange, currentPage }: PaginatorButtonProps) => {
    return (
        <div className='py-1'>
            <div className='block items-center align-center'>
                <div className='flex space-x-1  items-center justify-center mb-2'>
                    <button
                        type="button"
                        className={`flex items-center justify-center rounded-md w-8 h-9 text-xs font-semibold text-white shadow-sm transition duration-300 ${currentPage === 1 || pagination.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b00202] hover:bg-[#800000]'}`}
                        disabled={currentPage === 1 || pagination.total === 0}
                        onClick={() => currentPage > 1 && onPageChange(1)}
                    >
                        <ChevronFirst className='p-1' />
                    </button>

                    <button
                        type="button"
                        className={`flex items-center justify-center rounded-md w-8 h-9 text-xs font-semibold text-white shadow-sm transition duration-300 ${currentPage === 1 || pagination.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b00202] hover:bg-[#800000]'}`}
                        disabled={currentPage === 1 || pagination.total === 0}
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}>
                        <ChevronLeft className='p-1' />
                    </button>

                    <button
                        type="button"
                        className={`flex items-center justify-center rounded-md w-8 h-9 text-xs font-semibold text-white shadow-sm transition duration-300 ${currentPage === pagination.pages || pagination.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b00202] hover:bg-[#800000]'}`}
                        disabled={currentPage === pagination.pages || pagination.total === 0}
                        onClick={() => currentPage < pagination.pages && onPageChange(currentPage + 1)}>
                        <ChevronRight className='p-1' />
                    </button>

                    <button
                        type="button"
                        className={`flex items-center justify-center rounded-md w-8 h-9 text-xs font-semibold text-white shadow-sm transition duration-300 ${currentPage === pagination.pages || pagination.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b00202] hover:bg-[#800000]'}`}
                        disabled={currentPage === pagination.pages || pagination.total === 0}
                        onClick={() => currentPage < pagination.pages && onPageChange(pagination.pages)}>
                        <ChevronLast className='p-1' />
                    </button>
                </div>
                <div className='text-[11px] font-medium text-gray-700'>
                    Page {currentPage} of {pagination.pages} | {pagination.total} Entries 
                </div>
            </div>
        </div>
    )
}

export default Paginator
