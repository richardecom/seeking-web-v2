import React from 'react'
import { Bell} from 'lucide-react'
const NotificationIcon = () => {
  return (
    // <div className='flex items-center gap-3 2xsm:gap-7 p-2 text-white cursor-pointer hover:text-purple-400'>
    //   <Bell />
    // </div>
    <div className='flex items-center gap-3 2xsm:gap-7 p-2 text-white cursor-pointer hover:text-purple-400'>
    <div className='h-9 w-9 rounded-full flex items-center justify-center bg-gray-200 hover:bg-indigo-200 cursor-pointer transition-colors duration-200 ease-in-out transform hover:scale-105'>
          <Bell className='text-gray-600 p-1 hover:text-indigo-800'/>
      </div>
  </div>
  )
}

export default NotificationIcon
