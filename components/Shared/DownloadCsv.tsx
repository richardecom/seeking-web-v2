/* eslint-disable @typescript-eslint/no-unused-vars */
import { CloudDownload } from 'lucide-react'
import React from 'react'
import Spinner from './Spinner'

const DownloadCsv = ({onClick, dataLength, hasChecked, isLoading}) => {
    return (
        <div className='w-1/8 md:w-1/4 lg:w-1/4 p-1'>
            <button 
            onClick = { onClick }
            disabled = { dataLength <= 0 || hasChecked}
            className={` ${ dataLength <= 0 || hasChecked? 'bg-gray-400 text-gray-500 cursor-not-allowed':'bg-[#b00202] text-white hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 active:bg-[#b00202] active:scale-90 active:shadow-lg focus:outline-none transition transform duration-200 ease-in-out'} flex justify-center items-center  px-4 py-1  rounded-md text-xs w-full min-h-9 lg:pr-5 `}>
                {
                    isLoading ? (
                        <><Spinner className='w-4 h-4'/></>
                    ):(
                        
                        <><CloudDownload className='p-1' /></>
                    )
                }
                <span>CSV</span>
            </button>
        </div>
    )
}

export default DownloadCsv
