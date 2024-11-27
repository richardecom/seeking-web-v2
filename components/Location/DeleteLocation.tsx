/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArchivedLocation } from '@/hooks/LocationHooks';
import React , { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
import Spinner from '../Shared/Spinner';

const DeleteLocation = ({ locationData, onSubmit }) => {
  console.log("LOCATION DATA", locationData)
    const router = useRouter();
    const { toast } = useToast()

    const [isSubmitting, setIsSubmitting] = useState(false);
    const deleteLocation = async (event) =>{
      setIsSubmitting(true)
        event.preventDefault();
        try {
            const result = await ArchivedLocation({location_id: locationData.location_id})
            if (result.status === 401) {
              router.push("/");
            } else if (result.status === 200) {
              onSubmit();
              toast({
                className: "success_message",
                description: result.message,
              });
            } else {
              console.error("Error updating location data.");
            }
        } catch (error) {
            console.log('ERROR: archivedLocation function: ', error)
            toast({
                className: 'error_message',
                description: 'Error updating location data',
            })
        }finally{
          setIsSubmitting(false)
        }
    }

  return (
    <>
    <div className="flex justify-center p-4">
        <span className="text-center">Are you sure you want to archive {locationData.building} ?</span>
    </div>
    <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
    <button
            type="button"
            className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 w-full sm:w-auto">
            Cancel
        </button>
        <button
          onClick={deleteLocation}
          disabled = {isSubmitting}
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm  text-white shadow-sm hover:bg-red-600 w-full sm:w-auto disabled:cursor-not-allowed disabled:bg-gray-400">
           {
            isSubmitting && (<Spinner className='w-4 h-4'/> )
           } Yes, Archive it!
        </button>
    </div>
    </>
  )
}

export default DeleteLocation
