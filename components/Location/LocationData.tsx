/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { TruncateText } from "@/utils/TruncateText";
import { Archive, CircleHelp, Eye, Pencil } from "lucide-react";
import { NoDataFound } from "@/components/Shared/NoDataFound";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import EditLocation from "./EditLocation";
import DeleteLocation from "./DeleteLocation";
import FormLayout from "../Shared/FormLayout";
import ViewLocationData from "./ViewLocationData";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Checkbox } from "../ui/checkbox";
import DeleteButton from "../Shared/DeleteButton";
import EditButton from "../Shared/EditButton";
import ViewButton from "../Shared/ViewButton";

export const LocationData = ({
  locationData,
  headers,
  onClose,
  onExcludesChange,
}) => {
  const [location_list, setLocationList] = useState([]);
  const [location, setLocation] = useState({});
  const [excludes, setExcludes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
    setDeleteDialog(false);
    onClose();
  };

  const bulkUncheck = (value) => {
    // Set all categories to selected or not based on main checkbox
    setAllSelected(value);
    setLocationList((prevLocation) =>
      prevLocation.map((location) => ({ ...location, selected: value }))
    );
    if (value) {
      setExcludes((prevExcludes) =>
        prevExcludes.filter(
          (excludedId) =>
            !location_list.some(
              (location) => location.location_id === excludedId
            )
        )
      );
    } else {
      location_list.forEach((location) => {
        setExcludes((prevExcludes) => {
          if (!prevExcludes.includes(location.location_id)) {
            return [...prevExcludes, location.location_id];
          }
          return prevExcludes;
        });
      });
    }
  };

  const changeSelected = (location_id, value) => {
    setLocationList((prevLocation) =>
      prevLocation.map((location) =>
        location.location_id === location_id
          ? { ...location, selected: value }
          : location
      )
    );
    if (value) {
      setExcludes((prevExcludes) =>
        prevExcludes.filter((id) => id !== location_id)
      );
    } else {
      setExcludes((prevExcludes) => [...prevExcludes, location_id]);
    }
  };

  const ActionButtonClicked = (location, action) => {
    setLocation(location);
    if (action === "edit") {
      setDialogOpen(true);
    } else if (action === "delete") {
      setDeleteDialog(true);
    } else if (action === "view") {
      setViewDialog(true);
    }
  };
  useEffect(() => {
    onExcludesChange(excludes);
    console.log("excludes", excludes);
  }, [excludes, onExcludesChange]);

  useEffect(() => {
    if (excludes.length > 0) {
      const updatedLocations = locationData.map((location) => {
        return excludes.includes(location.location_id)
          ? { ...location, selected: false }
          : location;
      });
      setLocationList(updatedLocations);
    } else {
      setLocationList(locationData);
    }
  }, [locationData]);

  useEffect(() => {
    const allChecked = location_list.every((location) => location.selected);
    setAllSelected(allChecked);
  }, [location_list]);

  return (
    <div className="overflow-y-auto max-h-[450px] mb-8">
      {location_list.length === 0 ? (
        <NoDataFound />
      ) : (
        <table className="min-w-full border border-gray-300 rounded bg-white">
          <thead className="sticky top-0 bg-gray-200">
            <tr className="rounded-md">
              <th className=" px-4 py-2 border-b text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    onCheckedChange={(checked) => bulkUncheck(checked)}
                    checked={allSelected}
                  />
                </div>
              </th>
              <th className="px-4 py-2 border-b text-sm w-[5%]">#</th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 border-b text-sm w-[11%] ${
                    header === "Action" ? "text-center" : "text-left"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {location_list.map((location, index) => {
              return (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b  text-sm w-[5%]">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        onCheckedChange={(checked) =>
                          changeSelected(location.location_id, checked)
                        }
                        id={location.location_id}
                        checked={location.selected}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b text-sm w-[5%]">
                    {TruncateText(location.number, 10)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm w-[11%]">
                    {location.building}
                  </td>
                  <td className="px-4 py-2 border-b text-sm w-[11%]">
                    {location.room}
                  </td>
                  <td className="px-4 py-2 border-b text-sm w-[11%]">
                    {TruncateText(location.storage_location, 20)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm w-[11%]">
                    {TruncateText(location.location_description, 20)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm w-[11%]">
                    {location.user.name}
                  </td>
                  <td className="px-4 py-2 border-b text-sm w-[11%]">
                    <span
                      className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset  ${
                        location.status === "Active"
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : "ring-red-600/10 text-red-700 bg-red-50"
                      }`}
                    >
                      {location.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-sm flex justify-center">
                    <ViewButton
                      onClick={() => ActionButtonClicked(location, "view")}
                      disabled={false}
                      hidden={false}
                    />
                    <EditButton
                      onClick={() => ActionButtonClicked(location, "edit")}
                      disabled={false}
                      hidden={false}
                    />
                    <DeleteButton
                      onClick={() => ActionButtonClicked(location, "delete")}
                      disabled={location.status !== "Active"}
                      hidden={location.status !== "Active"}
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
              <span className="rounded-full border w-[35px] h-[35px] flex justify-center items-center bg-blue-200 ring-1 ring-inset ring-blue-600/10">
                <CircleHelp className="text-center text-blue-500" />
              </span>
              <span className=" text-gray-800 p-2">View </span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-1 h-[470px] ">
            <div className='form-body w-full h-full overflow-y-auto scrollbar px-2 py-2 border rounded-sm'>
            <ViewLocationData locationData={location} />
            </div>
          </div>

          
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <EditLocation locationData={location} onSubmit={handleClose} />
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
            <div className="h-auto form-body mb-1 w-full scrollbar px-1">
              <DeleteLocation locationData={location} onSubmit={handleClose} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
