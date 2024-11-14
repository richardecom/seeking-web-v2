/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";
import ActionsToolbar from "@/components/Shared/ActionsToolbar";
import AddButton from "@/components/Shared/AddButton";
import LeftActionPanel from "@/components/Shared/LeftActionPanel";
import { ContentTitle } from "@/components/Shared/ContentTitle";
import SelectToSearch from "@/components/Shared/SelectToSearch";
import React, { useEffect, useRef, useState } from "react";
import TypeToSearch from "@/components/Shared/TypeToSearch";
import RightActionPanel from "@/components/Shared/RightActionPanel";
import { CSVLink } from "react-csv";
import DownloadCsv from "@/components/Shared/DownloadCsv";
import Paginator from "@/components/Shared/Paginator";
import TableLayout from "@/components/Shared/TableLayout";
import ProgressLayout from "@/components/Shared/ProgressLayout";
import { Progress } from "@/components/ui/progress";
import CategoryData from "@/components/Categories/CategoryData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormLayout from "@/components/Shared/FormLayout";
import { getDateTime } from "@/utils/DateTime";
import { Category } from "../types/category";
import { useRouter } from "next/navigation";
import { Pagination } from "../types/pagination";
import { toast } from "@/hooks/use-toast";
import { UsersRound } from "lucide-react";
import UserData from "@/components/User/UserData";
import { DownloadCsvFile, GetAllUsers } from "@/hooks/UserHooks";
import AddUser from "@/components/User/AddUser";
import { useUser } from "@/context/UserContext";

const UsersPage = () => {

  const { currentUser } = useUser();
 
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
    "user_id", "name", "email_address", "address", "image", 
    "dob", "user_type", "user_role", "status", "date_created"
  ];
  const exportHeaders = keys.map(key => ({ label: key, key }));

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
 

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<Category[]>([]);
  const [exportData, setExportData] = useState<Category[]>([]);
  const [page, setDefaultPage] = useState(1);
  const [limit] = useState(20);
  const [progress, setProgress] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState("");
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("0");
  const [firstReload, setFirstReload] = useState(true);
  const [dialog, setDialog] = useState(false);
  const router = useRouter();
  const csvLinkRef = useRef(null);
  const [excludeIds, setExcludeIds] = useState([]);
  const fileName = `USER_DATA_${getDateTime()}.csv`;
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    before: null,
    next: null,
  });

  useEffect(() => {
    if(currentUser?.role_code !== 'super_admin'){
      setUserRole("0")
    }
  }, [currentUser]);

  
  const handleClose = () => {
    // setDialogOpen(false);
    // setDeleteDialog(false);
    // onClose();
  };

  const downloadCsvFile = async () => {
    if(userData.length > 0 || excludeIds.length !== pagination.total){
        try {
            toast({
              className: "success_message",
              description: "Downloading, Please Wait.",
            });
            const params = { page: 1, limit:1000, searchKey, status, userRole, userType, excludeIds };
            console.log("PARAMS: ", params)
            const result = await DownloadCsvFile(params) as any;
            if(result.status === 200){
                if(result.data.list.length > 0){
                    const exportData = result.data.list
                    setExportData(exportData)
                    setTimeout(() => {
                        csvLinkRef.current.link.click();
                    }, 1000);
                }else{
                    toast({
                        className: 'bg-red-800 text-white border-0',
                        description: result.message,
                    })
                }
            }
          } catch (error) {
            console.log("Error downloading csv file.");
          }
    }else{

    }
  };

  const getAllUserRecords = async () => {
    if (firstReload) {
      setIsLoading(true);
    }
    setProgress(50);
    try {
      const params = { page, limit, searchKey, status, userRole, userType };
      const result = (await GetAllUsers(params)) as any;
      console.log("REUSLT: ", result);
      if (result.status === 200) {
        setUserData(result.data.list);
        setPagination(result.data.pagination);
      } else if (result.status === 401) {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setProgress(100);
      setFirstReload(false);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  };
  useEffect(() => {
    getAllUserRecords();
  }, [page, limit, searchKey, status, userRole, userType]);
  return (
    <DefaultLayout>
      <ContentTitle title="User List" icon={<UsersRound />} />
      <ActionsToolbar>
        <LeftActionPanel>
          <AddButton onClick={() => setDialog(true)} buttonName="Add User" hidden={currentUser?.role_code !== 'super_admin'} />
          <SelectToSearch
            hidden={currentUser?.role_code !== 'super_admin'}
            arrObj={selectRoleValue}
            isDisabled={(userType === "1" || userType === "0")}
            name="user_role"
            id="user_role"
            value={userRole}
            onSelect={(event) => {
                console.log(event)
              const value = event.target.value;
              setUserRole(value);
              setDefaultPage(1);
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
              setDefaultPage(1);
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
              setDefaultPage(1);
            }}
          />
          <TypeToSearch
          id='search_users'
          name='search_users'
            onClick={(query) => {
              setSearchKey(query);
              setDefaultPage(1);
            }}
          />
        </LeftActionPanel>
        <RightActionPanel>
          <CSVLink
            ref={csvLinkRef}
            data={exportData}
            headers={exportHeaders}
            filename={fileName}
            className="hidden"
            target="_blank"
          ></CSVLink>
          <DownloadCsv
            onClick={downloadCsvFile}
            dataLength={userData.length}
            hasChecked={excludeIds.length === pagination.total}
          />
          <Paginator
            pagination={pagination}
            onPageChange={setDefaultPage}
            currentPage={page}
          />
        </RightActionPanel>
      </ActionsToolbar>
      <TableLayout>
        {isLoading ? (
          <>
            <ProgressLayout>
              <Progress value={progress} className="h-1 w-[30%] max-w-md " />
            </ProgressLayout>
          </>
        ) : (
          <UserData
            UserData={userData}
            headers={headers}
            onClose={() => getAllUserRecords()}
            onExcludesChange={setExcludeIds}
          />
        )}
      </TableLayout>

      {/* Add User Dialog /> */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <AddUser 
                onClose={() => {
                setDialog(false);
                getAllUserRecords();
              }}/>
          </FormLayout>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
};

export default UsersPage;
