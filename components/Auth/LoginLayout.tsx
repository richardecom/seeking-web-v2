/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

const LoginLayout = ({children}:any) => {
  return (
    <div>
      <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12">
        {children}
      </div>
    </div>
  )
}

export default LoginLayout
