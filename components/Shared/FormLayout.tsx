/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

const FormLayout = ({children}:any) => {
  return (
    <div className="grid gap-4 pt-2 h-[470px] ">
        <div className='form-body mb-5 w-full h-full overflow-y-auto scrollbar px-3'>
            {children}
        </div>
    </div>
  )
}

export default FormLayout
