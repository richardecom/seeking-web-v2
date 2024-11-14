/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

const ActionsToolbar = ({ children }: any) => {
  return (
    <div className='flex flex-col w-full text-center md:flex-row'>
      <div className='sticky top-0 z-10 block md:flex md:w-[100%]'>
        <div className='md:block w-full'>
          <div className='block lg:flex'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActionsToolbar
