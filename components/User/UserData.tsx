/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { NoDataFound } from '../Shared/NoDataFound';
import { Checkbox } from '../ui/checkbox';
import { TruncateText } from '@/utils/TruncateText';
import { Button } from '../ui/button';
import { Archive, CircleHelp, Eye, Pencil } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import FormLayout from '../Shared/FormLayout';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';
import EditButton from '../Shared/EditButton';
import ViewButton from '../Shared/ViewButton';
import DeleteButton from '../Shared/DeleteButton';
import { useRouter } from 'next/navigation';

const UserData = ({UserData, headers , onClose, onExcludesChange}) => {

  console.log('UserData: ', UserData)
  const router = useRouter();
  const { currentUser } = useUser();
  const [user_list, setUserList] = useState(UserData);
  const [allSelected, setAllSelected] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [excludes, setExcludes] = useState([]);
  const [user, setUser] = useState([]);
  console.log('currentUser: ', currentUser)

  const bulkUncheck = (value) => { // Set all categories to selected or not based on main checkbox
    setAllSelected(value);
    setUserList((prevUser) =>
      prevUser.map((user) => (
        { ...user, selected: value }
      ))
    );
    if (value) {
      setExcludes((prevExcludes) =>
        prevExcludes.filter(excludedId =>
          !user_list.some(user => user.user_id === excludedId)
        )
      );
    } else {
      user_list.forEach((user) => {
        setExcludes((prevExcludes) => {
          if (!prevExcludes.includes(user.user_id)) {
            return [...prevExcludes, user.user_id];
          }
          return prevExcludes;
        });
      });
    }
  }
  const changeSelected = (user_id, value) => {
    setUserList((prevCategories) =>
      prevCategories.map((user) =>
        user.user_id === user_id
          ? { ...user, selected: value }
          : user
      )
    );
    if (value) {
      setExcludes((prevExcludes) => prevExcludes.filter((id) => id !== user_id));
    } else {
      setExcludes((prevExcludes) => [...prevExcludes, user_id]);
    }
  }

  const ActionButtonClicked = (user, action) => {
    console.log(action + 'is clicked!')
    setUser(user);
    if (action === 'edit') {
      setEditDialog(true);
    }
    else if (action === 'delete') {
      setDeleteDialog(true)
    }
    else if (action === 'view') {
      setViewDialog(true)
    }
  };

  const handleClose = () => {
    setEditDialog(false);
    setDeleteDialog(false);
    onClose();
  };

  const viewUser = (user:any) => {
    router.push(`/users/${user.user_id}`);
  }

  useEffect(() => {
    onExcludesChange(excludes);
  }, [excludes, onExcludesChange]);

  useEffect(() => {
    if (excludes.length > 0) {
      const updatedCategories = UserData.map((category) => {
        return excludes.includes(category.category_id)
          ? { ...category, selected: false }
          : category;
      });
      setUserList(updatedCategories);
    } else {
      setUserList(UserData);
    }
  }, [UserData]);

  useEffect(() => {
    const allChecked = user_list.every(cat => cat.selected);
    setAllSelected(allChecked);
  }, [user_list]);

  return (
    <div className="overflow-y-auto max-h-[450px] mb-8">
      {user_list.length === 0 ? (<NoDataFound />) :
        (
          <table className="min-w-full border-gray-300 rounded bg-white">
            <thead className="sticky top-0 bg-gray-200">
              <tr className='rounded-md'>
                <th className=" px-4 py-2 border-b text-sm w-[5%]">
                  <div className="flex items-center space-x-2">
                    <Checkbox onCheckedChange={(checked) => bulkUncheck(checked)} checked={allSelected} />
                  </div>
                </th>
                <th className=" px-4 py-2 border-b text-sm w-[5%]">#</th>
                {headers.map((header, index) => (
                  <th key={index}
                    className={`px-4 py-2 border-b text-sm w-[12%] text-gray-800 ${header === 'Action' ? 'text-center' : 'text-left'}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {user_list.map((user, index) => {
                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b  text-sm w-[5%]">
                      <div className="flex items-center space-x-2">
                        <Checkbox onCheckedChange={(checked) => changeSelected(user.user_id, checked)} id={user.user_id} checked={user.selected} />
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b  text-sm w-[5%]">
                      {TruncateText((user.number).toString(), 10)}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[12%]`}>
                      {TruncateText(user.email_address, 20)}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[12%]`}>
                      {TruncateText(user.name, 20)}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[12%]`}>
                      {TruncateText(user.address, 20)}
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[12%]`}>
                      <span
                        className={` items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset
                            ${user.role_code !== "mobile_user" ? 'hidden': 'inline-flex'} 
                            ${user.user_type === 'Premium' ? 'bg-yellow-100 text-yellow-700 ring-yellow-600/20' : 'ring-green-600/50 text-green-700 bg-green-100'}`}
                      >{user.user_type}
                      </span>
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[12%]`}>
                      <span
                          className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset bg-gray-100 text-gray-800 ring-gray-700/30`}
                        >{user.user_role}</span>
                    </td>
                    <td className={`px-4 py-2 border-b text-sm w-[12%]`}>
                      <span
                        className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset  
                            ${user.status === 'Active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'ring-red-600/10 text-red-700 bg-red-50'}`}
                      >{user.status}</span>
                    </td>
                    <td className={`px-4 py-2 border-b text-sm flex justify-center items-center`}>
                  
                      <ViewButton
                        onClick={()=> {viewUser(user)}}
                        disabled={false}
                        hidden={false}
                      />
                      <EditButton 
                        onClick={() => ActionButtonClicked(user, 'edit')}
                        disabled={currentUser?.role_code !== "super_admin"}
                        hidden={user.role_code === 'mobile_user'}
                        />
                      <DeleteButton
                        onClick={() => ActionButtonClicked(user, 'delete')}
                        disabled={currentUser?.role_code !== "super_admin"}
                        hidden={currentUser?.role_code !== "super_admin"}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

      
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <EditUser editUserData={user} onSubmit={handleClose} />
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
              {/* <DeleteUser deleteData={category} onSubmit={handleClose} /> */}
              <DeleteUser deleteData={user} onSubmit={handleClose}/>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserData
