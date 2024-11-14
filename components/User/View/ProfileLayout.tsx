import React from 'react'

const ProfileLayout = ({ children }: any) => {
  return (
    <div className="md:flex sm:block w-full p-1">
      {children}
    </div>
  )
}

export default ProfileLayout
