"use client";

import { useUser } from "@/context/UserContext";
import { getDateTime } from "@/utils/DateTime";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "../../app/types/pagination";
import { Category } from "../../app/types/category";
import ActionsToolbar from "@/components/Shared/ActionsToolbar";
import LeftActionPanel from "@/components/Shared/LeftActionPanel";
import SelectToSearch from "@/components/Shared/SelectToSearch";
import TypeToSearch from "@/components/Shared/TypeToSearch";
import RightActionPanel from "@/components/Shared/RightActionPanel";
import Paginator from "@/components/Shared/Paginator";
import TableSkeleton from "@/components/Skeleton/TableSkeleton";
import { toast } from "@/hooks/use-toast";
import { DownloadCsvFile, GetAllUsers } from "@/hooks/UserHooks";
import { Checkbox } from "@/components/ui/checkbox";
import { TruncateText } from "@/utils/TruncateText";
import ViewButton from "@/components/Shared/ViewButton";
import EditButton from "@/components/Shared/EditButton";
import DeleteButton from "@/components/Shared/DeleteButton";
import { NoDataFound } from "@/components/Shared/NoDataFound";
import { AddSystemUser } from "./AddSystemUser";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useFilters } from "@/context/FilterContext";

const DownloadToCsv = dynamic(() => import("@/components/Shared/DownloadToCsv"));
const DeleteDialog = dynamic(() => import("@/components/User/DeleteDialog"));
const EditDialog = dynamic(() => import("@/components/User/EditDialog"));
const ViewSystemUserDialog = dynamic(() => import("@/components/User/View/ViewSystemUserDialog"));

const UserDataTable = () => {
  const { currentUser } = useUser();
  const { filters } = useFilters();
  
  console.log("HERWES" , filters)
  const headers = [
    "Email Address",
    "Name",
    "Address",
    "Account Type",
    "Account Role",
    "Status",
    "Action",
  ];
  const keys = [
    "user_id",
    "name",
    "email_address",
    "address",
    "image",
    "dob",
    "user_type",
    "user_role",
    "status",
    "date_created",
  ];
  const exportHeaders = keys.map((key) => ({ label: key, key }));

  const selectValue = [
    { key: 1, value: "Active" },
    { key: 0, value: "Inactive" },
  ];
  const selectRoleValue = [
    { key: 2, value: "Admin" },
    { key: 0, value: "Mobile User" },
  ];
  const selectAccountType = [
    { key: 1, value: "Premium" },
    { key: 0, value: "Free" },
  ];


  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [user_list, setUserList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [exportData, setExportData] = useState<Category[]>([]);
  const [limit] = useState(20);

  const [page, setPage] = useState(filters.page);
  const [searchKey, setSearchKey] = useState(filters.searchKey);
  const [status, setStatus] = useState(filters.status);
  const [userType, setUserType] = useState(filters.userType);
  const [userRole, setUserRole] = useState(filters.userRole);

  // const [page, setPage] = useState(1);
  // const [searchKey, setSearchKey] = useState("");
  // const [status, setStatus] = useState("");
  // const [userType, setUserType] = useState("");
  // const [userRole, setUserRole] = useState("0");
  
  const router = useRouter();
  const csvLinkRef = useRef(null);
  const [excludeIds, setExcludeIds] = useState([]);
  const fileName = `USER_DATA${getDateTime()}.csv`;
  const [allSelected, setAllSelected] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    before: null,
    next: null,
  });


  const handleClose = () => {
    setEditDialog(false);
    setDeleteDialog(false);
    setViewDialog(false);
  };

  const handleSubmit = () => {
    fetchUserData()
    setEditDialog(false);
    setDeleteDialog(false);
    setViewDialog(false);
  }

  const downloadCsvFile = async () => {
    if (user_list.length > 0 || excludeIds.length !== pagination.total) {
      try {
        setIsDownloading(true)
        const params = {
          page: 1,
          limit: 1000,
          searchKey,
          status,
          userRole,
          userType,
          excludeIds,
        };
        const result = (await DownloadCsvFile(params)) as any;
        if (result.status === 200) {
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
              className: "bg-red-800 text-white border-0",
              description: result.message,
            });
          }
        }
      } catch (error) {
        console.log("Error downloading csv file.");
      } finally{
        setIsDownloading(false)
      }
    } else {
    }
  };

  const bulkUncheck = (value) => {
    // Set all categories to selected or not based on main checkbox
    setAllSelected(value);
    setUserList((prevUser) =>
      prevUser.map((user) => ({ ...user, selected: value }))
    );
    if (value) {
      setExcludeIds((prevExcludes) =>
        prevExcludes.filter(
          (excludedId) => !user_list.some((user) => user.user_id === excludedId)
        )
      );
    } else {
      user_list.forEach((user) => {
        setExcludeIds((prevExcludes) => {
          if (!prevExcludes.includes(user.user_id)) {
            return [...prevExcludes, user.user_id];
          }
          return prevExcludes;
        });
      });
    }
  };

  const changeSelected = (user_id, value) => {
    setUserList((prevCategories) =>
      prevCategories.map((user) =>
        user.user_id === user_id ? { ...user, selected: value } : user
      )
    );
    if (value) {
      setExcludeIds((prevExcludes) =>
        prevExcludes.filter((id) => id !== user_id)
      );
    } else {
      setExcludeIds((prevExcludes) => [...prevExcludes, user_id]);
    }
  };

  const ActionButtonClicked = (user, action) => {
    console.log(action + "is clicked!");
    setSelectedUser(user);
    if (action === "edit") {
      setEditDialog(true);
    } else if (action === "delete") {
      setDeleteDialog(true);
    } else if (action === "view") {
      setViewDialog(true);
    }
  };

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit, searchKey, status, userRole, userType };
      const result = (await GetAllUsers(params)) as any;
      if (result.status === 401) {
        router.push("/");
      } else if (result.status === 200) {
        handleSelection(result.data.list);
        setPagination(result.data.pagination);
      } else {
        console.error("Error getting list of users.");
      }
    } catch (err) {
      console.error("An error occurred while fetching users:", err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [page, limit, searchKey, status, router, userRole, userType]);

  function handleSelection(list) {
    if (list.length > 0) {
      const updatedUsers = list.map((user) => {
        return excludeIds.includes(user.user_id)
          ? { ...user, selected: false }
          : user;
      });
      setUserList(updatedUsers);
    } else {
      setUserList(list);
    }
  }

  useEffect(() => {
    if (currentUser?.role_code !== "super_admin") {
      setUserRole("0");
    }
  }, [currentUser]);
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  useEffect(() => {
    const allChecked = user_list.every((user) => user.selected);
    setAllSelected(allChecked);
  }, [user_list]);

  useEffect(() => {
    const filters = { page, searchKey, status, userRole, userType };
    sessionStorage.setItem("userFilters", JSON.stringify(filters));
  }, [page, limit, searchKey, status, userRole, userType]);

  return (
    <div>
      <ActionsToolbar>
        <LeftActionPanel>
          <AddSystemUser onAfterSubmit={handleClose} />
          <SelectToSearch
            hidden={currentUser?.role_code !== "super_admin"}
            arrObj={selectRoleValue}
            isDisabled={userType === "1" || userType === "0"}
            name="user_role"
            id="user_role"
            value={userRole}
            onSelect={(event) => {
              // console.log(event);
              
              const value = event.target.value;
              setUserRole(value);
              setPage(1);
              if (value === 1) {
                setUserType("");
              }
            }}
          />
          <SelectToSearch
            hidden={false}
            name="user_type"
            id="user_type"
            value={userType}
            arrObj={selectAccountType}
            isDisabled={false}
            onSelect={(event) => {
             
              const value = event.target.value;
              if (value !== "") {
                setUserRole("0");
              }
              setUserType(value);
              setPage(1);
            }}
          />
          <SelectToSearch
            hidden={false}
            arrObj={selectValue}
            isDisabled={false}
            name="status"
            id="status"
            value={status}
            onSelect={(event) => {
              
              setStatus(event.target.value);
              setPage(1);
            }}
          />
          <TypeToSearch
            id="search_users"
            name="search_users"
            isSearching={isSearching}
            initVal = {searchKey}
            onClick={(query) => {
              
              if (query && searchKey !== query) {
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
            dataLength={user_list.length}
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
                  {user_list.length > 0 && (
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
                      className={`px-4 py-2 border-b text-sm w-[12%] text-gray-800 ${
                        header === "Action" ? "text-center" : "text-left"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {user_list.length > 0 ? (
                  <>
                    {user_list.map((user, index) => {
                      return (
                        <tr key={index} className="hover:bg-gray-100 border-b max-w-full">
                          <td className="px-4 py-2 text-sm w-[5%]">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                onCheckedChange={(checked) =>
                                  changeSelected(user.user_id, checked)
                                }
                                id={user.user_id}
                                checked={user.selected}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm w-[5%]">
                            {TruncateText(user.number, 10)}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[12%]`}>
                            {TruncateText(user.email_address, 20)}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[12%]`}>
                            {TruncateText(user.name, 20)}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[12%]`}>
                            {TruncateText(user.address, 20)}
                          </td>
                          <td className={`px-4 py-2 text-sm w-[12%]`}>
                            <span
                              className={` items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset
                            ${
                              user.role_code !== "mobile_user"
                                ? "hidden"
                                : "inline-flex"
                            } 
                            ${
                              user.user_type === "Premium"
                                ? "bg-yellow-100 text-yellow-700 ring-yellow-600/20"
                                : "ring-green-600/50 text-green-700 bg-green-100"
                            }`}
                            >
                              {user.user_type}
                            </span>
                          </td>
                          <td className={`px-4 py-2 text-sm w-[12%]`}>
                            <span
                              className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset bg-gray-100 text-gray-800 ring-gray-700/30`}
                            >
                              {user.user_role}
                            </span>
                          </td>
                          <td className={`px-4 py-2 text-sm w-[12%]`}>
                            <span
                              className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset  
                            ${
                              user.status === "Active"
                                ? "bg-green-50 text-green-700 ring-green-600/20"
                                : "ring-red-600/10 text-red-700 bg-red-50"
                            }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className={`px-4 py-2 text-sm flex`} >
                            {/* <ViewButton
                              onClick={() => {
                                viewUser(user);
                              }}
                              disabled={false}
                              hidden={false}
                            /> */}
                            {
                              user.role_code === 'admin' ? (
                                <ViewButton
                                  onClick={() => ActionButtonClicked(user, "view")}
                                  disabled={false}
                                  hidden={false}
                                />
                              ) : (
                                <Link href={`users/${user.user_id}`}>
                                <ViewButton
                                  onClick={() => {}}
                                  disabled={false}
                                  hidden={false}
                                />
                              </Link>
                              )
                            }
                            <EditButton
                              onClick={() => ActionButtonClicked(user, "edit")}
                              disabled={
                                currentUser?.role_code !== "super_admin"
                              }
                              hidden={user.role_code === "mobile_user"}
                            />
                            <DeleteButton
                              onClick={() =>
                                ActionButtonClicked(user, "delete")
                              }
                              disabled={
                                currentUser?.role_code !== "super_admin"
                              }
                              hidden={currentUser?.role_code !== "super_admin" || user.status !== 'Active'}
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

      <EditDialog isOpen={editDialog} onClose={handleClose} user={selectedUser} onSubmit={handleSubmit}/>
      <DeleteDialog isOpen={deleteDialog} onClose={handleClose} user={selectedUser} onSubmit={handleSubmit}/>
      <ViewSystemUserDialog isOpen={viewDialog} onClose={() => setViewDialog(false)} user={selectedUser}/>
    </div>
  );
};

export default UserDataTable;
