import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { DeleteUserAccount } from '@/hooks/UserHooks';
import React, { useState } from 'react'
import Spinner from '../Shared/Spinner';

const DeleteUser = ({deleteData, onSubmit}) => {

    console.log(deleteData)
  const router = useRouter();
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const deleteCat = async (event) =>{
        setIsSubmitting(true)
        event.preventDefault();
        try {
            const result = await DeleteUserAccount(deleteData.user_id)
            if(result.status === 201){
                onSubmit();
                toast({
                    className: 'success_message',
                    description: result.message,
                })
            }
            else if(result.status === 401){
                router.push('/')
            }else{
                toast({
                    className: 'error_message',
                    description: result.message,
                })
            }
        } catch (error) {
            console.log('ERROR: DeleteUser function: ', error)
        } finally{
            setIsSubmitting(false)
        }
    }

  return (
    <>
    <div className="flex justify-center p-4">
        <span className="text-center">Are you sure you want to deactivate {deleteData.name}&apos;s account ?</span>
    </div>
    <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
        <button onClick={() => onSubmit()}
            type="button"
            className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 w-full sm:w-auto">
            No, Keep it.
        </button>
        <button
        onClick={deleteCat}
            type="button"
            disabled = {isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm  text-white shadow-sm hover:bg-red-600 w-full sm:w-auto disabled:cursor-not-allowed disabled:bg-gray-400">
            {
                isSubmitting && (<Spinner className='w-4 h-4'/>)
            } Yes, Deactivate it!
        </button>
    </div>
    </>
  )
}

export default DeleteUser
