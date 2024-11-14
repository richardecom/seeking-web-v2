/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArchivedItem } from '@/hooks/ItemHook';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React from 'react'

const DeleteItem = ({itemData, onSubmit}) => {
  console.log(itemData)
  const router = useRouter();
    const { toast } = useToast()
    const deleteItem = async (event) =>{
        event.preventDefault();
        try {
            const result = await ArchivedItem(itemData.item_id)
            if(result.status === 200){
                onSubmit();
                toast({
                    className: 'success_message',
                    description: result.message,
                })
            }
            else if(result.status === 401){
                router.push('/')
            }
        } catch (error) {
            console.log('ERROR: archivedLocation function: ', error)
        }
    }

  return (
    <>
    <div className="flex justify-center p-4">
        <span className="text-center">Are you sure you want to archive {itemData.item_name} ?</span>
    </div>
    <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
    <button
            type="button"
            className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 w-full sm:w-auto">
            Cancel
        </button>
        <button
        onClick={deleteItem}
            type="button"
            className="inline-flex justify-center rounded-md bg-red-500 px-4 py-2 text-sm  text-white shadow-sm hover:bg-red-600 w-full sm:w-auto">
            Yes, Archive it!
        </button>
    </div>
    </>
  )
}

export default DeleteItem
