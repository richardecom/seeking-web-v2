"use client";

import ActionsToolbar from "@/components/Shared/ActionsToolbar";
import DeleteButton from "@/components/Shared/DeleteButton";
// import DownloadToCsv from "@/components/Shared/DownloadToCsv";
import EditButton from "@/components/Shared/EditButton";
import LeftActionPanel from "@/components/Shared/LeftActionPanel";
import { NoDataFound } from "@/components/Shared/NoDataFound";
import Paginator from "@/components/Shared/Paginator";
import RightActionPanel from "@/components/Shared/RightActionPanel";
import ViewButton from "@/components/Shared/ViewButton";
import TableSkeleton from "@/components/Skeleton/TableSkeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { TruncateText } from "@/utils/TruncateText";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TypeToSearch from "@/components/Shared/TypeToSearch";
import SelectToSearch from "@/components/Shared/SelectToSearch";
import { DownloadCsvFile, GetAllItemRecords } from "@/hooks/ItemHook";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { getDateTime } from "@/utils/DateTime";
import { AddItem } from "./AddItem";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
// import ViewItemData from "@/components/Items/ViewItemData";
import FormLayout from "@/components/Shared/FormLayout";
// import EditItem from "@/components/Items/EditItem";
// import DeleteItem from "@/components/Items/DeleteItem";
import { Pagination } from "@/app/types/pagination";

import dynamic from "next/dynamic";
// import DeleteDialog from "./DeleteDialog";
const ViewItemData = dynamic(() => import("@/components/Items/ViewItemData"));
const EditItem = dynamic(() => import("@/components/Items/EditItem"));
// const DeleteItem = dynamic(() => import("@/components/Items/DeleteItem"));
const DownloadToCsv = dynamic(() => import("@/components/Shared/DownloadToCsv"));

const DeleteDialog = dynamic(() => import("@/components/Items/DeleteDialog"));
const ViewDialog = dynamic(() => import("@/components/Items/ViewDialog"));
const EditDialog = dynamic(() => import("@/components/Items/EditDialog"));

export const ItemDataTable = () => {
  const headers = [
    "Item Name",
    "Description",
    "Quantity",
    "Rating",
    "Owner",
    "Status",
    "Action",
  ];

  const router = useRouter();
  const [selected, setSelected] = useState(false);
  const csvLinkRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [excludeIds, setExcludeIds] = useState([]);
  const [exportData, setExportData] = useState<Location[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const fileName = `ITEM_DATA${getDateTime()}.csv`;
  const [allSelected, setAllSelected] = useState(false);
  const [item, setItem] = useState({});
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    before: null,
    next: null,
  });

  const fetchItemData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit, searchKey, status };
      const result = await GetAllItemRecords(params);
      console.log("RESILT", result);

      if (result.status === 401) {
        router.push("/");
      } else if (result.status === 200) {
        handleSelection(result.data.list);
        setPagination(result.data.pagination);
      } else {
        console.error("Error getting list of items.");
      }
    } catch (err) {
      console.error("An error occurred while fetching items:", err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [page, limit, searchKey, status, router]);

  function handleSelection(list) {
    if (list.length > 0) {
      const updatedItems = list.map((item) => {
        return excludeIds.includes(item.item_id)
          ? { ...item, selected: false }
          : item;
      });
      setItems(updatedItems);
    } else {
      setItems(list);
    }
  }

  const keys = [
    "item_id",
    "item_uid",
    "item_name",
    "image_url",
    "description",
    "quantity",
    "rating",
    "expiry_date",
    "perishable",
    "always_stock",
    "uncountable",
    "favorite",
    "location_id",
    "user_id",
    "category_id",
    "status",
    "date_created",
    "is_selling",
    "user_name",
    "user_type",
    "building",
  ];
  const exportHeaders = keys.map((key) => ({ label: key, key }));
  const selectValue = [
    { key: 1, value: "Active" },
    { key: 0, value: "Archived" },
  ];
  // const ActionButtonClicked = (location, action) => {
  //   setSelected(location);
  //   if (action === "edit") {
  //     setDialogOpen(true);
  //   } else if (action === "delete") {
  //     setDeleteDialog(true);
  //   } else if (action === "view") {
  //     setViewDialog(true);
  //   }
  // };

  const ActionButtonClicked = (row_data, action) => {
    setItem(row_data);
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
    setViewDialog(false)
  };

  const handleSubmit = () => {
    fetchItemData()
    setDialogOpen(false);
    setDeleteDialog(false);
    setViewDialog(false)
  };


  const downloadCsvFile = async () => {
    if (items.length > 0 || excludeIds.length !== pagination.total) {
      setIsDownloading(true);
      try {
        const params = { page: 1, limit: 1000, searchKey, status, excludeIds };
        const result = (await DownloadCsvFile(params)) as any;
        if (result.status === 200) {
          if (result.data.list.length > 0) {
            const exportData = result.data.list;
            setExportData(exportData);
            setTimeout(() => {
              csvLinkRef.current.link.click();
            }, 1000);
          } else {
            toast({
              className: "error_message",
              description: result.message,
            });
          }
        } else {
          toast({
            className: "error_message",
            description: "Download Failed. Something went wrong.",
          });
        }
      } catch (error) {
        console.log("Error downloading csv file.");
      } finally {
        setIsDownloading(false);
      }
    } else {
      toast({
        className: "error_message",
        description: "Please select data do be download.",
      });
    }
  };

  const changeSelected = (item_id, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.item_id === item_id ? { ...item, selected: value } : item
      )
    );
    if (value) {
      setExcludeIds((prevExcludes) =>
        prevExcludes.filter((id) => id !== item_id)
      );
    } else {
      setExcludeIds((prevExcludes) => [...prevExcludes, item_id]);
    }
  };

  const bulkUncheck = (value) => {
    // Set all categories to selected or not based on main checkbox
    setAllSelected(value);
    setItems((prevItems) =>
      prevItems.map((items) => ({ ...items, selected: value }))
    );
    if (value) {
      setExcludeIds((prevExcludes) =>
        prevExcludes.filter(
          (excludedId) => !items.some((item) => item.item_id === excludedId)
        )
      );
    } else {
      items.forEach((item) => {
        setExcludeIds((prevExcludes) => {
          if (!prevExcludes.includes(item.item_id)) {
            return [...prevExcludes, item.item_id];
          }
          return prevExcludes;
        });
      });
    }
  };
  useEffect(() => {
    fetchItemData();
  }, [fetchItemData]);

  useEffect(() => {
    const allChecked = items.every((cat) => cat.selected);
    setAllSelected(allChecked);
  }, [items]);

  return (
    <div>
      <ActionsToolbar>
        <LeftActionPanel>
          <AddItem afterSubmit = {()=> fetchItemData()}/>
          <SelectToSearch
            hidden={false}
            name="search_loc"
            id="search_loc"
            value={status}
            arrObj={selectValue}
            isDisabled={false}
            onSelect={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          />
          <TypeToSearch
            id="search_location"
            name="search_location"
            initVal={''}
            isSearching={isSearching}
            onClick={(query) => {
              if (query) {
                setIsSearching(true);
              }
              setSearchKey(query);
              setPage(1);
            }}
          />
        </LeftActionPanel>
        <RightActionPanel>
          <DownloadToCsv
            isLoading={isDownloading}
            onClick={downloadCsvFile}
            dataLength={items.length}
            hasChecked={excludeIds.length === pagination.total}
            fileName={fileName}
            headers={exportHeaders}
            dataVal={exportData}
            linkRef={csvLinkRef}
          />
          <Paginator
            pagination={pagination}
            onPageChange={setPage}
            currentPage={page}
          />
        </RightActionPanel>
      </ActionsToolbar>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="overflow-y-auto max-h-[450px] mb-8">
            <table className="min-w-full border border-gray-300 rounded bg-white">
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className=" px-4 py-2 border-b text-sm">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        onCheckedChange={(checked) => bulkUncheck(checked)}
                        checked={allSelected}
                      />
                    </div>
                  </th>
                  <th className=" px-4 py-2 border-b text-sm w-[5%]">#</th>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className={` px-4 py-2 border-b text-sm w-[14%] ${
                        header === "Action" ? "text-center" : "text-left"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {items.length > 0 ? (
                  <>
                    {items.map((item, index) => {
                      return (
                        <tr key={index} className="hover:bg-gray-100 border-b">
                          <td className="px-4 py-2 text-sm w-[5%]">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                onCheckedChange={(checked) =>
                                  changeSelected(item.item_id, checked)
                                }
                                id={item.item_id}
                                checked={item.selected}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm w-[5%]">
                            {TruncateText(item.number, 10)}
                          </td>
                          <td className={`px-4 py-2 text-sm truncate w-[14%] `}>
                            {TruncateText(item.item_name, 20)}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[14%]`}>
                            {TruncateText(item.description, 20)}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[14%]`}>
                            {item.quantity}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[14%]`}>
                            {item.rating}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[14%]`}>
                            {item.user.name}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[14%]`}>
                            <span
                              className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset  
                        ${
                          item.status === "Active"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "ring-red-600/10 text-red-700 bg-red-50"
                        }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-2 text-sm flex items-center`}
                          >
                            <ViewButton
                              onClick={() => ActionButtonClicked(item, "view")}
                              disabled={false}
                              hidden={false}
                            />
                            <EditButton
                              onClick={() => ActionButtonClicked(item, "edit")}
                              disabled={false}
                              hidden={item.status !== "Active"}
                            />
                            <DeleteButton
                              onClick={() =>
                                ActionButtonClicked(item, "delete")
                              }
                              disabled={item.status !== "Active"}
                              hidden={item.status !== "Active"}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <tr>
                    <td colSpan={headers.length + 2}>
                      <NoDataFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* <Dialog open={viewDialog} onOpenChange={setViewDialog}>
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
            <div className="form-body w-full h-full overflow-y-auto scrollbar px-2 py-2 border rounded-sm">
              <ViewItemData itemData={item} />
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <EditItem itemData={item} onSubmit={handleClose} />
          </FormLayout>
        </DialogContent>
      </Dialog> */}

      {/* <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="md:max-w-[500px] sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="h-auto form-body mb-1 w-full scrollbar px-1">
              <DeleteItem itemData={item} onSubmit={handleClose} />
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      <ViewDialog isOpen={viewDialog} onClose={handleClose} item={item} />
      <EditDialog isOpen={dialogOpen} onClose={handleClose} item={item}  onSubmit={handleSubmit}/>
      <DeleteDialog isOpen={deleteDialog} onClose={handleClose} item={item} onSubmit={handleSubmit}/>
    </div>
  );
};
