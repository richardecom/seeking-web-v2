import React from 'react'
import { Button } from '../ui/button'
import { Archive } from 'lucide-react'

const DeleteButton = ({onClick, disabled, hidden}) => {
  return (
    <>
      <Button 
        onClick={onClick}
        disabled={disabled}
        className={`${hidden ? 'hidden':'flex'} ${disabled ? 'bg-gray-400':'bg-red-500'} m-1 justify-center rounded-md w-8 h-8 px-1 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300'}`}>
        <Archive className='p-1' />
        </Button>
    </>
  )
}

export default DeleteButton
