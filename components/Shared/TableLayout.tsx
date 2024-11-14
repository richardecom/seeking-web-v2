/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

const TableLayout = ({children}:any) => {
  return (
    <div className="max-h-screen overflow-hidden mt-3">
      {children}
    </div>
  )
}

export default TableLayout
