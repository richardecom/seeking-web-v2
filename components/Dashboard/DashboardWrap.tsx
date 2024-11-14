import React from 'react'

const DashboardWrap = ({children}:any) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 my-3">
      {children}
    </div>
  )
}

export default DashboardWrap
