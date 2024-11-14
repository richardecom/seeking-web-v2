/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

export const ContentTitle = ({title, icon}) => {
  return (
    <div className="mb-4 flex justify-between">
      <div className='flex items-center'>
        {icon}
        <h4 className="text-title-sm2 font-bold text-black dark:text-white mx-2 text-sm">
          {title}
        </h4>
      </div>
    </div>
  )
}
