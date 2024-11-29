"use client";
import DeleteButton from "@/components/Shared/DeleteButton";
import EditButton from "@/components/Shared/EditButton";
import { NoDataFound } from "@/components/Shared/NoDataFound";
import Paginator from "@/components/Shared/Paginator";
import ViewButton from "@/components/Shared/ViewButton";
import TableSkeleton from "@/components/Skeleton/TableSkeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { DownloadCsvFile, GetAllLocationRecords } from "@/hooks/LocationHooks";
import { TruncateText } from "@/utils/TruncateText";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "../../app/types/pagination";
import LeftActionPanel from "@/components/Shared/LeftActionPanel";
import ActionsToolbar from "@/components/Shared/ActionsToolbar";
import { AddLocation } from "./AddLocation";
import TypeToSearch from "@/components/Shared/TypeToSearch";
import SelectToSearch from "@/components/Shared/SelectToSearch";
import RightActionPanel from "@/components/Shared/RightActionPanel";
import { getDateTime } from "@/utils/DateTime";
import { useToast } from "@/hooks/use-toast";

import dynamic from "next/dynamic";
const DownloadToCsv = dynamic(() => import("@/components/Shared/DownloadToCsv"));
const ViewDialog = dynamic(() => import("@/components/Location/ViewDialog"));
const Delete = dynamic(() => import("@/components/Location/Delete"));
const EditDialog = dynamic(() => import("@/components/Location/EditDialog"));

const LocationDataTable = () => {
  const headers = [
    "Building",
    "Room",
    "Storage Location",
    "Description",
    "Owner",
    "Status",
    "Action",
  ];

  const keys = [
    "location_id",
    "location_uid",
    "building",
    "room",
    "storage_location",
    "location_description",
    "location_image",
    "location_image_url",
    "user_id",
    "status",
    "date_created",
    "user_name",
    "user_type",
  ];
  const exportHeaders = keys.map((key) => ({ label: key, key }));
  const { toast } = useToast();
  const selectValue = [
    { key: 1, value: "Active" },
    { key: 0, value: "Archived" },
  ];
  const fileName = `LOCATION_DATA_${getDateTime()}.csv`;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const [locations, setLocations] = useState<any>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [excludeIds, setExcludeIds] = useState([]);
  const [exportData, setExportData] = useState<Location[]>([]);
  const csvLinkRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selected, setSelected] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    before: null,
    next: null,
  });

  const handleClose = () => {
    setDialogOpen(false);
    setDeleteDialog(false);
    setViewDialog(false);
  };
  const handleSubmit = () => {
    fetchLocationData();
    setDialogOpen(false);
    setDeleteDialog(false);
    setViewDialog(false);
  };
  
  const fetchLocationData = useCallback(async () => {
    try {
      const params = { page, limit, searchKey, status };
      const result = await GetAllLocationRecords(params);

      if (result.status === 401) {
        router.push("/");
      } else if (result.status === 200) {
        handleSelection(result.data.list);
        setPagination(result.data.pagination);
      } else {
        console.error("Error getting list of locations.");
      }
    } catch (err) {
      console.error("An error occurred while fetching locations:", err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [page, limit, searchKey, status, router, excludeIds]);


  //Polling
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsLoading(false);
      fetchLocationData();
    }, 3000); // 5000ms = 5 seconds
    return () => clearInterval(intervalId);
  }, [fetchLocationData]);

  const downloadCsvFile = async () => {
    if (locations.length > 0 || excludeIds.length !== pagination.total) {
      try {
        setIsDownloading(true);
        const params = { page: 1, limit: 1000, searchKey, status, excludeIds };
        const result = (await DownloadCsvFile(params)) as any;
        console.log("Result:", result);
        if (result.status === 401) {
          router.push("/");
        } else if (result.status === 200) {
          if (result.data.list.length > 0) {
            toast({
              className: "success_message",
              description: "Downloading, Please Wait.",
            });
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
            description: "Download failed. Something went wrong.",
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

  const bulkUncheck = (value) => {
    setAllSelected(value);
    setLocations((prevLocation) =>
      prevLocation.map((location) => ({ ...location, selected: value }))
    );
    if (value) {
      setExcludeIds((prevExcludes) =>
        prevExcludes.filter(
          (excludedId) =>
            !locations.some((location) => location.location_id === excludedId)
        )
      );
    } else {
      locations.forEach((location) => {
        setExcludeIds((prevExcludes) => {
          if (!prevExcludes.includes(location.location_id)) {
            return [...prevExcludes, location.location_id];
          }
          return prevExcludes;
        });
      });
    }
  };

  function handleSelection(list) {
    if (list.length > 0) {
      const updatedLocations = list.map((location) => {
        return excludeIds.includes(location.location_id)
          ? { ...location, selected: false }
          : location;
      });
      setLocations(updatedLocations);
    } else {
      setLocations(list);
    }
  }

  const changeSelected = (location_id, value) => {
    setLocations((prevLocation) =>
      prevLocation.map((location) =>
        location.location_id === location_id
          ? { ...location, selected: value }
          : location
      )
    );
    if (value) {
      setExcludeIds((prevExcludes) =>
        prevExcludes.filter((id) => id !== location_id)
      );
    } else {
      setExcludeIds((prevExcludes) => [...prevExcludes, location_id]);
    }
  };

  const ActionButtonClicked = (location, action) => {
    // setLocations(location);
    setSelected(location)
    if (action === "edit") {
      setDialogOpen(true);
    } else if (action === "delete") {
      setDeleteDialog(true);
    } else if (action === "view") {
      setViewDialog(true);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, [fetchLocationData]);
  useEffect(() => {
    const allChecked = locations.every((location) => location.selected);
    setAllSelected(allChecked);
  }, [locations]);

  return (
    <div>
      <ActionsToolbar>
        <LeftActionPanel>
          <AddLocation onAfterSubmit={()=> fetchLocationData()}/>
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
            dataLength={locations.length}
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
                <tr className="rounded-md">
                  {locations.length > 0 && (
                    <th className=" px-4 py-2 border-b text-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          onCheckedChange={(checked) => bulkUncheck(checked)}
                          checked={allSelected}
                        />
                      </div>
                    </th>
                  )}
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
                {locations.length > 0 ? (
                  <>
                    {locations.map((location, index) => {
                      return (
                        <tr key={index} className="hover:bg-gray-100 border-b">
                          <td className="px-4 py-2  text-sm w-[5%]">
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
                          <td className="px-4 py-2 text-sm w-[5%]">
                            {TruncateText(location.number, 10)}
                          </td>
                          <td className="px-4 py-2 text-sm w-[11%]">
                            {location.building}
                          </td>
                          <td className="px-4 py-2 text-sm w-[11%]">
                            {location.room}
                          </td>
                          <td className="px-4 py-2 text-sm w-[11%]">
                            {TruncateText(location.storage_location, 20)}
                          </td>
                          <td className="px-4 py-2text-sm w-[11%]">
                            {TruncateText(location.location_description, 20)}
                          </td>
                          <td className="px-4 py-2 text-sm w-[11%]">
                            {location.user.name}
                          </td>
                          <td className="px-4 py-2 text-sm w-[11%]">
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
                          <td className="px-4 py-2 text-sm flex">
                            <ViewButton
                              onClick={() =>
                                ActionButtonClicked(location, "view")
                              }
                              disabled={false}
                              hidden={false}
                            />
                            <EditButton
                              onClick={() =>
                                ActionButtonClicked(location, "edit")
                              }
                              disabled={false}
                              hidden={location.status !== "Active"}
                            />
                            <DeleteButton
                              onClick={() =>
                                ActionButtonClicked(location, "delete")
                              }
                              disabled={location.status !== "Active"}
                              hidden={location.status !== "Active"}
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
      <ViewDialog isOpen={viewDialog} onClose={handleClose} location={selected}/>
      <EditDialog isOpen={dialogOpen} onClose={handleClose} location={selected} onSubmit = {handleSubmit}/>
      <Delete isOpen={deleteDialog} onClose={handleClose} location={selected}  onSubmit = {handleSubmit}/>
    </div>
  );
};

export default LocationDataTable;
