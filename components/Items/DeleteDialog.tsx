import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import DeleteItem from './DeleteItem'

const DeleteDialog = ({isOpen, onClose, item}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-[500px] sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="h-auto form-body mb-1 w-full scrollbar px-1">
              <DeleteItem itemData={item} onSubmit={onClose} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}

export default DeleteDialog
