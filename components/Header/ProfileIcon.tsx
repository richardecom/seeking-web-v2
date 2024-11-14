import React from 'react'
import { UserRoundPen} from 'lucide-react'
import { useRouter } from 'next/navigation';
const ProfileIcon = () => {
  const router = useRouter();
  return (
    <div className='flex items-center p-1 text-white'>
        <div onClick={() => router.push('/profile')} className='h-9 w-9 rounded-full flex items-center justify-center bg-gray-200 hover:bg-white hover:text-[#800000] cursor-pointer transition-colors duration-200 ease-in-out transform hover:scale-105'>
            <UserRoundPen className='text-gray-800 p-1 hover:text-[#800000]'/>
        </div>
    </div>
  )
}

export default ProfileIcon
