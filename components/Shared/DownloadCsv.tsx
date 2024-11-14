/* eslint-disable @typescript-eslint/no-unused-vars */
import { CloudDownload } from 'lucide-react'
import React from 'react'

const DownloadCsv = ({onClick, dataLength, hasChecked}) => {
    return (
        <div className='w-1/8 md:w-1/4 lg:w-1/4 p-1'>
            <button 
            onClick = { onClick }
            disabled = { dataLength <= 0 || hasChecked}
            className={` ${ dataLength <= 0 || hasChecked? 'bg-gray-400 text-gray-500 cursor-not-allowed':'bg-[#b00202] text-white hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300'} flex justify-center items-center  px-4 py-1  rounded-md text-xs w-full min-h-9 lg:pr-5 `}>
                <CloudDownload className='p-1' />
                <span>CSV</span>
            </button>
        </div>
    )
}

export default DownloadCsv
