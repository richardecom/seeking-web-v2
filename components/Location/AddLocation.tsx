import { Copy, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddLocationForm from "./AddLocationForm"
import FormLayout from "@/components/Shared/FormLayout"
import { useState, useRef  } from "react"

export function AddLocation({onAfterSubmit}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <div className={`w-1/8 md:w-1/4 p-1}` }>
        <Button variant="outline" className="w-full bg-[#b00202] px-4 py-2 font-normal text-white rounded-md  text-xs max-h-9 hover:text-white hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 active:bg-[#b00202] active:scale-90 active:shadow-lg focus:outline-none transition transform duration-200 ease-in-out transition duration-300">
            <Plus className="p-1"/> Add Location
        </Button>
    </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
          <DialogDescription>
            {/* Anyone who has this link will be able to view this. */}
          </DialogDescription>
        </DialogHeader>
        <FormLayout>
        <AddLocationForm onClose={()=> {
          setOpen(false) 
          onAfterSubmit()
          }}/>
        </FormLayout>
      </DialogContent>
    </Dialog>
  )
}
