/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { NoDataFound } from '../Shared/NoDataFound'
import { TruncateText } from '@/utils/TruncateText'
import { Button } from '../ui/button'
import { Archive, CircleHelp, Eye, Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import FormLayout from '../Shared/FormLayout'
import EditItem from './EditItem'
import DeleteItem from './DeleteItem'
import ViewItemData from './ViewItemData'
import { Checkbox } from '../ui/checkbox'
import ViewButton from '../Shared/ViewButton'
import EditButton from '../Shared/EditButton'
import DeleteButton from '../Shared/DeleteButton'


const ItemData = ({ ItemData, headers, onClose, onExcludesChange }) => {
  const [itemData, setItemData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [excludes, setExcludes] = useState([]);
  const [items, setItems] = useState([]);

  const ActionButtonClicked = (row_data, action) => {
    console.log("ROW_DATA: ", row_data)
    setItemData(row_data);
    if (action === 'edit') {
      setDialogOpen(true);
    } else if (action === 'delete') {
      setDeleteDialog(true)
    } else if (action === 'view') {
      setViewDialog(true)
    }
  };
  const handleClose = () => {
    setDialogOpen(false);
    setDeleteDialog(false);
    onClose();
  };

  const changeSelected = (item_id, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.item_id === item_id
          ? { ...item, selected: value }
          : item
      )
    );
    if (value) {
      setExcludes((prevExcludes) => prevExcludes.filter((id) => id !== item_id));
    } else {
      setExcludes((prevExcludes) => [...prevExcludes, item_id]);
    }
  }

  const bulkUncheck = (value) => { // Set all categories to selected or not based on main checkbox
    setAllSelected(value);
    setItems((prevItems) =>
      prevItems.map((items) => (
        { ...items, selected: value }
      ))
    );
    if (value) {
      setExcludes((prevExcludes) =>
        prevExcludes.filter(excludedId =>
          !items.some(item => item.item_id === excludedId)
        )
      );
    } else {
      items.forEach((item) => {
        setExcludes((prevExcludes) => {
          if (!prevExcludes.includes(item.item_id)) {
            return [...prevExcludes, item.item_id];
          }
          return prevExcludes;
        });
      });
    }
  }

  useEffect(() => {
    onExcludesChange(excludes);
    console.log('excludes', excludes)
  }, [excludes, onExcludesChange]);

  useEffect(() => {
    if (excludes.length > 0) {
      const updatedItems = ItemData.map((item) => {
        return excludes.includes(item.item_id)
          ? { ...item, selected: false }
          : item;
      });
      setItems(updatedItems);
    } else {
      setItems(ItemData);
    }
  }, [ItemData]);

  useEffect(() => {
    const allChecked = items.every(cat => cat.selected);
    setAllSelected(allChecked);
  }, [items]);

  return (
    <div className="overflow-y-auto max-h-[450px] mb-8">
      {ItemData.length === 0 ? (<NoDataFound />) :
        (
          <table className="min-w-full border border-gray-300 rounded bg-white">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className=" px-4 py-2 border-b text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox onCheckedChange={(checked) => bulkUncheck(checked)} checked={allSelected} />
                  </div>
                </th>
                <th className=" px-4 py-2 border-b text-sm w-[5%]">#</th>
                {headers.map((header, index) => (
                  <th key={index}
                    className={` px-4 py-2 border-b text-sm w-[14%] ${header === 'Action' ? 'text-center' : 'text-left'}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b  text-sm w-[5%]">
                      <div className="flex items-center space-x-2">
                        <Checkbox onCheckedChange={(checked) => changeSelected(item.item_id, checked)} id={item.item_id} checked={item.selected} />
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b  text-sm w-[5%]">
                      {TruncateText((index + 1).toString(), 10)}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[14%]`}>
                      {TruncateText(item.item_name, 20)}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[14%]`}>
                      {TruncateText(item.description, 20)}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[14%]`}>
                      {item.quantity}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[14%]`}>
                      {item.rating}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[14%]`}>
                      {item.user.name}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[14%]`}>
                      <span
                        className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset  
                        ${item.status === 'Active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'ring-red-600/10 text-red-700 bg-red-50'}`}
                      >{item.status}</span>
                    </td>
                    <td className={`px-4 py-2 border-b text-sm flex justify-center items-center`}>

                      <ViewButton
                        onClick={()=> ActionButtonClicked(item, 'view')}
                        disabled={false}
                        hidden={false}
                      />
                      <EditButton 
                        onClick={() => ActionButtonClicked(item, 'edit')}
                        disabled={false}
                        hidden={false}
                        />
                      <DeleteButton
                        onClick={() => ActionButtonClicked(item, 'delete')}
                        disabled={item.status !== 'Active'}
                        hidden={item.status !== 'Active'}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
            <DialogDescription></DialogDescription>
              <span className="rounded-full border w-[25px] h-[25px] flex justify-center items-center bg-blue-200 ring-1 ring-inset ring-blue-600/10">
                <CircleHelp className="text-center text-blue-500" />
              </span>
              <span className=" text-gray-800 p-1 ml-2 text-md">View</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-1 h-[470px] ">
            <div className='form-body w-full h-full overflow-y-auto scrollbar px-2 py-2 border rounded-sm'>
              <ViewItemData itemData={itemData} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <EditItem itemData={itemData} onSubmit={handleClose} />
          </FormLayout>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="md:max-w-[500px] sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className='h-auto form-body mb-1 w-full scrollbar px-1'>
              <DeleteItem itemData={itemData} onSubmit={handleClose} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default ItemData
