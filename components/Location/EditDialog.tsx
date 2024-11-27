import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import FormLayout from '../Shared/FormLayout'
import EditLocation from './EditLocation'

const EditDialog = ({isOpen, onClose, location}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <EditLocation locationData={location} onSubmit={onClose} />
          </FormLayout>
        </DialogContent>
      </Dialog>
  )
}

export default EditDialog
