import React, { useCallback, useState } from 'react'
import { LogOut} from 'lucide-react'
import { logout } from '@/hooks/Auth';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'
import Spinner from '../Shared/Spinner';

const LogoutIcon = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const logOut = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await logout();
      if(result.status === 200){
        toast({
          className: 'success_message',
          description: result.message,
        })
        router.push('/');
      }
    } catch (error) {
      console.log('ERROR: logOut function: ', error)
      toast({
        className: 'error_message',
        description: 'Error logOut User.',
      })
    } finally{
      setIsLoading(false)
    }
  }, [router]) ;
  return (

    <div onClick={logOut} className='flex items-center gap-3 2xsm:gap-7 p-2 text-white cursor-pointer hover:text-[#800000]'>
    <div className='h-9 w-9 rounded-full flex items-center justify-center bg-gray-200 hover:bg-white cursor-pointer transition-colors duration-200 ease-in-out transform hover:scale-105 active:bg-[#e54043] active:scale-90 active:shadow-lg focus:outline-none transition transform duration-200 ease-in-out transition duration-300'>
          {
            isLoading ? (<Spinner className='w-4 h-4 ml-2'/>):(
              <LogOut className='text-gray-800 p-1 hover:text-[#800000]'/>
            )
          }
      </div>
  </div>
  )
}

export default LogoutIcon
