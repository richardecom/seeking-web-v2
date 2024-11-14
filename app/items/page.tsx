/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";
import { ContentTitle } from "@/components/Shared/ContentTitle";
import ActionsToolbar from "@/components/Shared/ActionsToolbar";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import FormLayout from "@/components/Shared/FormLayout";
import { Pagination } from "../types/pagination";
import {Box } from "lucide-react";
import TableLayout from "@/components/Shared/TableLayout";
import ProgressLayout from "@/components/Shared/ProgressLayout";
import { Progress } from "@/components/ui/progress";
import ItemData from "@/components/Items/ItemData";
import { useRouter } from "next/navigation";
import { DownloadCsvFile, GetAllItemRecords } from "@/hooks/ItemHook";
import AddItem from "@/components/Items/AddItem";
import { CSVLink } from "react-csv";
import { toast } from "@/hooks/use-toast";
import { getDateTime } from "@/utils/DateTime";
import LeftActionPanel from "@/components/Shared/LeftActionPanel";
import AddButton from "@/components/Shared/AddButton";
import SelectToSearch from "@/components/Shared/SelectToSearch";
import TypeToSearch from "@/components/Shared/TypeToSearch";
import RightActionPanel from "@/components/Shared/RightActionPanel";
import DownloadCsv from "@/components/Shared/DownloadCsv";
import Paginator from "@/components/Shared/Paginator";
import { DialogDescription } from "@radix-ui/react-dialog";
const ItemPage = () => {
  const keys = [
    "item_id", "item_uid", "item_name", "image_url", "description", 
    "quantity", "rating", "expiry_date", "perishable", "always_stock", 
    "uncountable", "favorite", "location_id", "user_id", "category_id", 
    "status", "date_created", "is_selling", "user_name", "user_type", 
    "building"
  ];
  const exportHeaders = keys.map(key => ({ label: key, key }));
  const selectValue = [
    { key: 1, value: "Active" },
    { key: 0, value: "Archived" },
  ];

  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState(false);
  const [page, setDefaultPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [itemData, setItemData] = useState<Location[]>([]);
  const [limit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const router = useRouter();
  const [firstReload, setFirstReload] = useState(true);
  const [exportData, setExportData] = useState<Location[]>([]);
  const csvLinkRef = useRef(null);
  const fileName = `ITEM_DATA${getDateTime()}.csv`;
  const [excludeIds, setExcludeIds] = useState([]);

  const getItemData = async () => {
    if (firstReload) {
      setIsLoading(true);
    }
    setProgress(50);
    try {
      const params = { page, limit, searchKey, status };
      const result = (await GetAllItemRecords(params)) as any;
      if (result.status === 200) {
        setItemData(result.data.list);
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
  
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    before: null,
    next: null,
  });

  const headers = [
    "Item Name",
    "Description",
    "Quantity",
    "Rating",
    "Owner",
    "Status",
    "Action",
  ];

  const downloadCsvFile = async () => {
    if(itemData.length > 0 || excludeIds.length !== pagination.total){
        try {
            toast({
                className: 'success_message',
                description: "Downloading, Please Wait.",
            })
            const params = { page: 1, limit: 1000, searchKey, status, excludeIds };
            const result = await DownloadCsvFile(params) as any;
            if (result.status === 200) {
                if (result.data.list.length > 0) {
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
                description: 'Download Failed. Something went wrong.',
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

  useEffect(() => {
    getItemData();
  }, [page, limit, searchKey, status]);

  return (
    <DefaultLayout>
      <ContentTitle title="Item List" icon={<Box />} />
      <ActionsToolbar>
        <LeftActionPanel>
          <AddButton onClick={() => setDialog(true)} buttonName="Add Item" hidden={false}/>
          <SelectToSearch
            name='search_item'
            id='search_item'
            hidden={false}
            value={status}
            arrObj={selectValue}
            isDisabled={false}
            onSelect={(event) => {
              setStatus(event.target.value) 
              setDefaultPage(1)
            }}
          />
          <TypeToSearch 
          id='search_item'
          name='search_item'
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
            dataLength={itemData.length}
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
          <ItemData
            headers={headers}
            ItemData={itemData}
            onClose={() => getItemData()}
            onExcludesChange={setExcludeIds}
          />
        )}
      </TableLayout>

      {/* Add Item Dialog /> */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <AddItem
              onClose={() => {
                setDialog(false);
                getItemData();
              }}
            />
          </FormLayout>
        </DialogContent>
      </Dialog>

    </DefaultLayout>
  );
};

export default ItemPage;
