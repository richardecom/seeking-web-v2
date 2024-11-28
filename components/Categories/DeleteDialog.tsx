import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import DeleteCat from "./DeleteCategory";

const DeleteDialog = ({isOpen, onClose, category, onSubmit}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[500px] sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="h-auto form-body mb-1 w-full scrollbar px-1">
            <DeleteCat deleteData={category} onSubmit={onSubmit} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
