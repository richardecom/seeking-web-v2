import React from 'react'

const AddButton = ({buttonName, onClick, hidden}) => {
  return (
    <div className={`w-1/8 md:w-1/4 p-1 ${hidden ? 'hidden':''}` }>
      <button onClick={onClick} className='bg-[#b00202]  px-4 py-2 text-white rounded-md text-xs w-full min-h-9 hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300'>
        {buttonName}
      </button>
    </div>
  )
}

export default AddButton
