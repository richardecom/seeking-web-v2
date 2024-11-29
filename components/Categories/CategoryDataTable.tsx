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
import { DownloadCsvFile } from "@/hooks/CategoryHook";
import { Pagination } from "../../app/types/pagination";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { getDateTime } from "@/utils/DateTime";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import ViewItemData from "@/components/Items/ViewItemData";
import FormLayout from "@/components/Shared/FormLayout";
import EditItem from "@/components/Items/EditItem";
import DeleteItem from "@/components/Items/DeleteItem";
import { Category } from "../../app/types/category";
import { DeleteCategory, GetAllCategories } from "@/hooks/CategoryHook";
import { AddCategory } from "./AddCategory";
// import ViewCategory from "@/components/Categories/ViewCategory";
// import EditCategory from "@/components/Categories/EditCategory";
// import DeleteCat from "@/components/Categories/DeleteCategory";

import dynamic from "next/dynamic";
// import DeleteDialog from "./DeleteDialog";
const ViewCategory = dynamic(() => import("@/components/Categories/ViewCategory"));
const EditCategory = dynamic(() => import("@/components/Categories/EditCategory"));
const DeleteCat = dynamic(() => import("@/components/Categories/DeleteCategory"));
const DownloadToCsv = dynamic(() => import("@/components/Shared/DownloadToCsv"));
const DeleteDialog = dynamic(() => import("@/components/Categories/DeleteDialog"));
const EditDialog = dynamic(() => import("@/components/Categories/EditDialog"));
const ViewDialog = dynamic(() => import("@/components/Categories/ViewDialog"));

export const CategoryDataTable = () => {
  const headers = [
    "Category Name",
    "Description",
    "Type",
    "Created Date",
    "Status",
    "Action",
  ];
  const exportHeaders = [
    { label: "category_id", key: "category_id" },
    { label: "user_id", key: "user_id" },
    { label: "category_name", key: "category_name" },
    { label: "category_description", key: "category_description" },
    { label: "category_type", key: "category_type" },
    { label: "status", key: "status" },
    { label: "date_created", key: "date_created" },
  ];
  const selectValue = [
    { key: 1, value: "Active" },
    { key: 0, value: "Archived" },
  ];
  const fileName = `CATEGORY_DATA${getDateTime()}.csv`;
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    before: null,
    next: null,
  });

  const [categories, setCategories] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [excludeIds, setExcludeIds] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [exportData, setExportData] = useState<Category[]>([]);
  const csvLinkRef = useRef(null);
  const [catType, setCatType] = useState([]);
  const [category, setCategory] = useState({});
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const router = useRouter();


  const ActionButtonClicked = useCallback((category, action) => {
    setCategory(category);
    if (action === "edit") {
      setEditDialog(true);
    } else if (action === "delete") {
      setDeleteDialog(true);
    } else if (action === "view") {
      setViewDialog(true);
    }
  },[]);

  const bulkUncheck = (value) => {
    setAllSelected(value);
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({ ...category, selected: value }))
    );
    if (value) {
      setExcludeIds((prevExcludes) =>
        prevExcludes.filter(
          (excludedId) =>
            !categories.some((category) => category.category_id === excludedId)
        )
      );
    } else {
      categories.forEach((category) => {
        setExcludeIds((prevExcludes) => {
          if (!prevExcludes.includes(category.category_id)) {
            return [...prevExcludes, category.category_id];
          }
          return prevExcludes;
        });
      });
    }
  };

  const changeSelected = (cat_id, value) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.category_id === cat_id
          ? { ...category, selected: value }
          : category
      )
    );
    if (value) {
      setExcludeIds((prevExcludes) =>
        prevExcludes.filter((id) => id !== cat_id)
      );
    } else {
      setExcludeIds((prevExcludes) => [...prevExcludes, cat_id]);
    }
  };

  const downloadCsvFile =  async () => {
    console.log("categories.length > 0 ", categories.length)
    console.log("categories.length > 0 ", categories.length > 0)
    if (categories.length > 0) {
      try {
        setIsDownloading(true)
        const params = { page: 1, limit: 1000, searchKey, status, excludeIds };
        const result = (await DownloadCsvFile(params)) as any;
        if (result.status === 401) { router.push('/') } //Unauthorize Request
        if (result.status === 200) {
          toast({
            className: "success_message",
            description: "Downloading, Please Wait.",
          });

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
            description: "Download failed. Something went wrong.",
          });
        }
      } catch (error) {
        console.log("Error downloading csv file.");
      }finally{
        setIsDownloading(false)
      }
    } else {
      toast({
        className: "error_message",
        description: "Please select data do be download.",
      });
    }
  }

  const fetchCategory = useCallback(async () => {
    // setIsLoading(true);
    try {
      const params = { page, limit, searchKey, status };
      const result = (await GetAllCategories(params)) as any;
      console.log('RESULT>', result)

      if (result.status === 401) {
        router.push("/");
      } else if (result.status === 200) {
        handleSelection(result.data.list);
        setPagination(result.data.pagination);
      } else {
        console.error("Error getting list of categories.");
      }
    } catch (err) {
      console.error("An error occurred while fetching categories:", err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [page, limit, searchKey, status, router, excludeIds]);

  function handleSelection(list) {
    if (list.length > 0) {
      const updatedCategories = list.map((category) => {
        return excludeIds.includes(category.category_id)
          ? { ...category, selected: false }
          : category;
      });
      setCategories(updatedCategories);
    } else {
      setCategories(list);
    }
  }

  // const handleSelection = useCallback((list) => {
  //   if (list.length > 0) {
  //     setCategories((prevCategories) =>
  //       list.map((category) =>
  //         excludeIds.includes(category.category_id)
  //           ? { ...category, selected: false }
  //           : category
  //       )
  //     );
  //   } else {
  //     setCategories(list);
  //   }
  // }, [excludeIds]);

  const handleSearch = (query) => {
    console.log("TEST", query)
    if (query) setIsSearching(true);
    setSearchKey(query);
    setPage(1);
  };

  const handleSubmit = () => {
    fetchCategory()
    setEditDialog(false);
    setDeleteDialog(false);
    setViewDialog(false);
  };

  const handleClose = () => {
    setEditDialog(false);
    setDeleteDialog(false);
    setViewDialog(false);
  };

  const getCategoryValue = (categoryId) => {
    const category = catType.find((cat) => cat.id === categoryId);
    return category ? category.value : "Unknown Type";
  };

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      const categories = [
        { id: 1, value: "Food" },
        { id: 2, value: "Gadgets" },
        { id: 3, value: "Clothes" },
        { id: 4, value: "Tools" },
        { id: 5, value: "Utensils" },
        { id: 6, value: "Hygiene" },
      ];
      setCatType(categories);
    };
    fetchCategoryTypes();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsLoading(false);
      fetchCategory();
    }, 3000); // 5000ms = 5 seconds
    return () => clearInterval(intervalId);
  }, [fetchCategory]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  useEffect(() => {
    const allChecked = categories.every((cat) => cat.selected);
    setAllSelected(allChecked);
  }, [categories]);

  return (
    <div>
      <ActionsToolbar>
        <LeftActionPanel>
          <AddCategory afterSubmit={()=> fetchCategory()}/>
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
            id="search_category"
            name="search_category"
            initVal={''}
            isSearching={isSearching}
            onClick={handleSearch}
          />
        </LeftActionPanel>
        <RightActionPanel>
          <DownloadToCsv
            isLoading={isDownloading}
            onClick={downloadCsvFile}
            dataLength={categories.length}
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
                      className={`px-4 py-2 border-b text-sm w-[15%] text-gray-800 ${
                        header === "Action" ? "text-center" : "text-left"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                
                {categories.length > 0 ? (
                  <>
                    {categories.map((category, index) => {
                      return (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-4 py-2 border-b  text-sm w-[5%]">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                onCheckedChange={(checked) =>
                                  changeSelected(category.category_id, checked)
                                }
                                id={category.category_id}
                                checked={category.selected}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 border-b  text-sm w-[5%]">
                            {TruncateText(category.number.toString(), 10)}
                          </td>
                          <td className={`px-4 py-2 border-b text-sm w-[15%]`}>
                            {TruncateText(category.category_name, 20)}
                          </td>
                          <td className={`px-4 py-2 border-b text-sm w-[15%]`}>
                            {TruncateText(category.category_description, 20)}
                          </td>
                          <td className={`px-4 py-2 border-b text-sm w-[15%]`}>
                            {getCategoryValue(category.category_type)}
                          </td>
                          <td className={`px-4 py-2 border-b text-sm w-[15%]`}>
                            {category.date_created}
                          </td>
                          <td className={`px-4 py-2 border-b text-sm w-[15%]`}>
                            <span
                              className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset  
                            ${
                              category.status === "Active"
                                ? "bg-green-50 text-green-700 ring-green-600/20"
                                : "ring-red-600/10 text-red-700 bg-red-50"
                            }`}
                            >
                              {category.status}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-2 border-b text-sm flex  items-center`}
                          >
                            <ViewButton
                              onClick={() =>
                                ActionButtonClicked(category, "view")
                              }
                              disabled={false}
                              hidden={false}
                            />
                            <EditButton
                              onClick={() =>
                                ActionButtonClicked(category, "edit")
                              }
                              disabled={false}
                              hidden={category.status !== "Active"}
                            />
                            <DeleteButton
                              onClick={() =>
                                ActionButtonClicked(category, "delete")
                              }
                              disabled={category.status !== "Active"}
                              hidden={category.status !== "Active"}
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

      
      

      <ViewDialog isOpen={viewDialog} onClose={handleClose} category={category}/>
      <EditDialog isOpen={editDialog} onClose={handleClose} category={category} onSubmit={handleSubmit}/>
      <DeleteDialog isOpen={deleteDialog} onClose={handleClose} category={category} onSubmit={handleSubmit}/>
    </div>
  );
};
