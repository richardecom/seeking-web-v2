import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import FormLayout from '../Shared/FormLayout'
import EditUser from './EditUser'

const EditDialog = ({isOpen, onClose, user}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <EditUser editUserData={user} onSubmit={onClose} />
          </FormLayout>
        </DialogContent>
      </Dialog>
  )
}

export default EditDialog
