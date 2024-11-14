/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

const SearchSelect = ({name, id, arrObj, onSelect, isDisabled, value, hidden}) => {
    return (
        <div className={`p-1 md:w-1/4 ${ hidden ? 'hidden':''}`}>
            <select 
            value={value}
            onChange={onSelect} 
            disabled={isDisabled}
            name={name} id={id} 
            className='w-full cursor-pointer text-xs rounded-md border h-9 border-gray-300 p-2 shadow-sm transition duration-200 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600'>
                <option value="">All</option>
                {arrObj.map((obj) => (
                    <option key={obj.key} value={obj.key}>
                        {obj.value}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SearchSelect
