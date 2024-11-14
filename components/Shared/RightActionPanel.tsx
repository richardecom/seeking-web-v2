/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

const RightActionPanel = ({children}:any) => {
  return (
    <div className='md:flex justify-between lg:w-[30%]'>
      {children}
    </div>
  )
}

export default RightActionPanel
