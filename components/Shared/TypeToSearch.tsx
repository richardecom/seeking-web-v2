/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import {Search} from 'lucide-react'
import Spinner from './Spinner';
const TypeToSearch = ({onClick, id, name, isSearching, initVal}) => {
    
    const [searchQuery, setSearchQuery] = useState(initVal || '');
    const [lastSearch, setLastSearch] = useState('');
    const applySearch = () => {
        if(lastSearch !== searchQuery){
            onClick(searchQuery);
            setLastSearch(searchQuery)
        }
    };
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { applySearch() }
    };

    return (
        <div className='w-full md:w-1/2 md:flex p-1'>
            <div className=' flex-grow md:mr-1 '>
                <input
                id={id}
                name={name}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={handleKeyPress}
                    type="text"
                    className='w-full text-xs rounded-md border h-9 border-gray-300 p-2 shadow-sm transition duration-200 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600'
                    placeholder="Search..."
                />
            </div>
            <div className=' md:w-auto'>
                <button type='button' onClick={applySearch} className='flex items-center bg-[#b00202] px-4 py-2 text-white rounded-md text-xs w-full h-9 hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 active:bg-[#b00202] active:scale-90 active:shadow-lg focus:outline-none transition transform duration-200 ease-in-out'>
                    {
                        isSearching ? (
                        <><Spinner className='w-4 h-4'/></>
                        ):(
                        <><Search className='p-1'/></>
                        )
                    }
                    Search
                </button>
            </div>
        </div>
    )
}

export default TypeToSearch
