/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useRef, useState } from "react";
import { ContentTitle } from "@/components/Shared/ContentTitle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LocationData } from "@/components/Location/LocationData";
import { DownloadCsvFile, GetAllLocationRecords } from "@/hooks/LocationHooks";
import { Location } from "@/app/types/location";
import { Pagination } from "@/app/types/pagination";
import { MapPin } from "lucide-react";
import { getDateTime } from "@/utils/DateTime";
import { Progress } from "@/components/ui/progress";
import { DialogTrigger } from "@/components/ui/dialog";
import AddLocation from "@/components/Location/AddLocation";
import ActionsToolbar from "@/components/Shared/ActionsToolbar";
import FormLayout from "@/components/Shared/FormLayout";
import TableLayout from "@/components/Shared/TableLayout";
import ProgressLayout from "@/components/Shared/ProgressLayout";
import { useRouter } from "next/navigation";
import { CSVLink } from "react-csv";
import { useToast } from "@/hooks/use-toast";
import LeftActionPanel from "@/components/Shared/LeftActionPanel";
import AddButton from "@/components/Shared/AddButton";
import SelectToSearch from "@/components/Shared/SelectToSearch";
import TypeToSearch from "@/components/Shared/TypeToSearch";
import RightActionPanel from "@/components/Shared/RightActionPanel";
import DownloadCsv from "@/components/Shared/DownloadCsv";
import Paginator from "@/components/Shared/Paginator";

const LocationPage = () => {
  const headers = ["Building", "Room", "Storage Location", "Description", "Owner", "Status", "Action"];
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
  const exportHeaders = keys.map(key => ({ label: key, key }));
  
  const selectValue = [
    { key: 1, value: "Active" },
    { key: 0, value: "Archived" },
  ];
  const fileName = `LOCATION_DATA_${getDateTime()}.csv`;

  const { toast } = useToast();
  const router = useRouter();
  const [locationData, setLocationData] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [page, setDefaultPage] = useState(1);
  const [limit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState(false);
  const [onFirstReload, setFirstReload] = useState(true);
  const [exportData, setExportData] = useState<Location[]>([]);
  const csvLinkRef = useRef(null);
  const [excludeIds, setExcludeIds] = useState([]);

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    before: null,
    next: null,
  });

  const fetchLocationData = async () => {
    if (onFirstReload) {
      setIsLoading(true);
    }
    setProgress(20);
    try {
      const params = { page, limit, searchKey, status };
      const result = (await GetAllLocationRecords(params)) as any;
      if(result.status === 401){
        router.push("/");
      }else if (result.status === 200) {
        setLocationData(result.data.list);
        setPagination(result.data.pagination);
      }else{ console.error('Error getting list of locations.') }
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
    fetchLocationData();
  }, [page, limit, searchKey, status]);

  const handleClose = () => {
    fetchLocationData();
    setDialog(false);
  };
  const downloadCsvFile = async () => {
    if(locationData.length > 0 || excludeIds.length !== pagination.total){
        try {
            
            const params = { page: 1, limit: 1000, searchKey, status, excludeIds };
            const result = await DownloadCsvFile(params) as any;
            if(result.status === 401){
              router.push('/')
            } 
            else if (result.status === 200) {
                if (result.data.list.length > 0) {
                    toast({
                      className: 'success_message',
                      description: "Downloading, Please Wait.",
                    })
                    const exportData = result.data.list
                    setExportData(exportData)
                    setTimeout(() => {
                        csvLinkRef.current.link.click();
                    }, 1000);
                } else {
                    toast({
                        className: 'error_message',
                        description: result.message,
                    })
                }
            }else{
                toast({
                    className: 'error_message',
                    description: 'Download failed. Something went wrong.',
                })
            }
        } catch (error) {
            console.log('Error downloading csv file.')
        }
    }else{
        toast({
            className: 'error_message',
            description: "Please select data do be download.",
        })
    }
  };

  return (
    <div>
      <DefaultLayout>
        <ContentTitle title="Location List" icon={<MapPin />} />
        <ActionsToolbar>
          <LeftActionPanel>
            <AddButton
            hidden={false}
              onClick={() => setDialog(true)}
              buttonName="Add Location"
            />
            <SelectToSearch
            hidden={false}
              name='search_loc'
              id='search_loc' 
              value={status}
              arrObj={selectValue}
              isDisabled={false}
              onSelect={(event) => {
                setStatus(event.target.value)
                setDefaultPage(1)
              }}
            />
            <TypeToSearch 
            id='search_location'
            name='search_location'
            onClick={(query) => {
              
              setSearchKey(query)
              setDefaultPage(1)
            }} />
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
              dataLength={locationData.length}
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
            <LocationData
              headers={headers}
              locationData={locationData}
              onClose={handleClose}
              onExcludesChange={setExcludeIds}
            />
          )}
        </TableLayout>

        {/* Add Location Dialog /> */}
        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Location</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <FormLayout>
              <AddLocation onClose={() => {
                  setDialog(false);
                  fetchLocationData();
                }}/>
            </FormLayout>
          </DialogContent>
        </Dialog>
      </DefaultLayout>
    </div>
  );
};

export default LocationPage;
