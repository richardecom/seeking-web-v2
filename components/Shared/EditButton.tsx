/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Button } from '../ui/button'
import { Pencil } from 'lucide-react'

const EditButton = ({onClick, disabled, hidden}) => {
  return (
    <>
    <Button 
        onClick={onClick}
        disabled={disabled}
        className={`${hidden ? 'hidden':'flex'} ${disabled ? 'bg-gray-400':'bg-indigo-500'} m-1 justify-center rounded-md w-8 h-8 px-1 py-1 text-sm text-white shadow-sm  hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300'}`}>
        <Pencil className='p-1' />
    </Button>
    </>
  )
}

export default EditButton
