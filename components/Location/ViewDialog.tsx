import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { CircleHelp } from 'lucide-react'
import ViewLocationData from './ViewLocationData'

const ViewDialog = ({isOpen, onClose, location}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <DialogDescription></DialogDescription>
              <span className="rounded-full border w-[35px] h-[35px] flex justify-center items-center bg-blue-200 ring-1 ring-inset ring-blue-600/10">
                <CircleHelp className="text-center text-blue-500" />
              </span>
              <span className=" text-gray-800 p-2">View </span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-1 h-[470px] ">
            <div className="form-body w-full h-full overflow-y-auto scrollbar px-2 py-2 border rounded-sm">
              <ViewLocationData locationData={location} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}

export default ViewDialog
