import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import FormLayout from '../Shared/FormLayout'
import EditItem from './EditItem'

const EditDialog = ({isOpen, onClose, item}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <FormLayout>
        <EditItem itemData={item} onSubmit={onClose} />
      </FormLayout>
    </DialogContent>
  </Dialog>
  )
}

export default EditDialog
