import React from 'react'
import { UserRoundPen} from 'lucide-react'
import Link from 'next/link';
const ProfileIcon = () => {
  return (
    <div className='flex items-center p-1 text-white'>
      <Link href={'/profile'}>
      <div className='h-9 w-9 rounded-full flex items-center justify-center bg-gray-200 hover:bg-white hover:text-[#800000] cursor-pointer transition-colors duration-200 ease-in-out transform hover:scale-105 active:bg-[#e54043] active:scale-90 active:shadow-lg focus:outline-none transition transform duration-200 ease-in-out transition duration-300 '>
            <UserRoundPen className='text-gray-800 p-1 hover:text-[#800000]'/>
        </div>
      </Link>
    </div>
  )
}

export default ProfileIcon
