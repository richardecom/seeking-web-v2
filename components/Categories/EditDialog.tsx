import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import FormLayout from '../Shared/FormLayout'
import EditCategory from './EditCategory'

const EditDialog = ({isOpen, onClose, category}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <EditCategory editCatData={category} onSubmit={onClose} />
          </FormLayout>
        </DialogContent>
      </Dialog>
  )
}

export default EditDialog
