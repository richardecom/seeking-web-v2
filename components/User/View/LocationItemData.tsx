import React, { useCallback, useEffect, useState } from "react";
import Search from "./Search";
import Paginator from "@/components/Shared/Paginator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import EditButton from "@/components/Shared/EditButton";
import DeleteButton from "@/components/Shared/DeleteButton";
import { NoDataFound } from "@/components/Shared/NoDataFound";
import { useRouter } from "next/navigation";
import { Pagination } from "@/app/types/pagination";
import { GetRecordsByLocationID } from "@/hooks/ItemHook";
import { TruncateText } from "@/utils/TruncateText";
import { GetUserByID } from "@/hooks/UserHooks";
import { GetRecordsByUserID } from "@/hooks/LocationHooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteItem from "@/components/Items/DeleteItem";
import FormLayout from "@/components/Shared/FormLayout";
import EditItem from "@/components/Items/EditItem";
import ViewItemData from "@/components/Items/ViewItemData";

const LocationItemData = ({ user_id }) => {
  const router = useRouter();
  const [page, setDefaultPage] = useState(1);
  const [limit] = useState(2);
  const [item_limit] = useState(3);
  const [item_searchKey, setItemSearchKey] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState("");
  const [user, setUser] = useState<any>({});
  const [location_list, setLocationList] = useState<any>([]);
  const [locationId, setLocationId] = useState(1);
  const [itemCurrentPage, setItemCurrentPage] = useState(1);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [item, setItem] = useState({});
  const [paginationMap, setPaginationMap] = useState<{
    [key: number]: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }>({});
  const [itemsMap, setItemsMap] = useState<{ [key: number]: any[] }>({});
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    before: null,
    next: null,
  });
  const handleClose = (item, page) => {
    setDeleteDialog(false);
    setEditDialog(false);
    fetchLocationItems(item.location_id, page);
  };
  const fetchUserData = useCallback(async () => {
    try {
      const data = (await GetUserByID(user_id)) as any;
      console.log("user data: ", data);
      if (data) {
        setUser(data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [user_id]);

  const fetchUserLocation = useCallback(async () => {
    try {
      const payload = { page, limit, searchKey, status };
      const result = await GetRecordsByUserID(user_id, payload);
      console.log("RESULT: ", result)
      if (result.status === 200) {
        setLocationList(result.data.list);
        setPagination(result.data.pagination);
        const list = result.data.list;
        if (list.length > 0) {
          list.forEach((location) => {
            setPaginationMap((prev) => {
              //Initialize paginationMap for the location_id if it doesn't exist
              if (!prev[location.location_id]) {
                return {
                  ...prev,
                  [location.location_id]: {
                    currentPage: 1,
                    totalPages: 0,
                    totalItems: 0,
                  },
                };
              }
              return prev;
            });

            fetchLocationItems(location.location_id);
          });
        }
      } else if (result.status === 401) {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  }, [user_id, page, limit, searchKey, status, router]);

  const changeItemPage = (direction, locationId) => {
    setPaginationMap((prev) => {
      const pagination = { ...prev[locationId] };

      switch (direction) {
        case 1: // First Page
          pagination.currentPage = 1;
          break;
        case 2: // Previous Page
          if (pagination.currentPage > 1) pagination.currentPage--;
          break;
        case 3: // Next Page
          if (pagination.currentPage < pagination.totalPages)
            pagination.currentPage++;
          break;
        case 4: // Last Page
          pagination.currentPage = pagination.totalPages;
          break;
        default:
          break;
      }
      fetchLocationItems(locationId, pagination.currentPage);
      return {
        ...prev,
        [locationId]: pagination,
      };
    });
  };

  const fetchLocationItems = async (location_id: number, currentPage = 1) => {
    const params = {
      page: currentPage,
      limit: item_limit,
      searchKey: item_searchKey,
      status: "",
    };

    try {
      const response = await GetRecordsByLocationID(location_id, params);
      if (response.status === 200) {
        setItemsMap((prev) => ({
          ...prev,
          [location_id]: response.data.list,
        }));
        setPaginationMap((prev) => ({
          ...prev,
          [location_id]: {
            currentPage: params.page,
            totalPages: response.data.pagination.pages,
            totalItems: response.data.pagination.total,
          },
        }));
      } else if (response.status === 401) {
        router.push("/");
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserData();
    fetchUserLocation();
  }, [fetchUserData, fetchUserLocation]);
  useEffect(() => {
    fetchLocationItems(locationId, 1);
  }, [item_searchKey, locationId]);

  return (
    <>
      <div className="w-full md:flex md:justify-between px-2 py-3 ">
        <div className="mb-3 md:w-[30%]">
          <span>Location list</span>
        </div>

        <div className="md:w-[70%] xl:flex xl:justify-end">
          <Search
            className="xl:p-1"
            id="search_location"
            name="search_location"
            onClick={(query) => {
              setSearchKey(query);
              setDefaultPage(1);
            }}
          />

          <div className="flex justify-center w-full md:flex md:justify-end xl:w-auto">
            <Paginator
              pagination={pagination}
              onPageChange={setDefaultPage}
              currentPage={page}
            />
          </div>
        </div>
      </div>

      <div className="px-3 ">
        <Accordion type="single" collapsible className="w-full">
          {location_list && location_list.length > 0 ? (
            location_list.map((location, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  <div className="flex items-center w-full">
                    <Image
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-md"
                      src={
                        location?.location_image_url
                          ? location?.location_image_url
                          : "/images/no_image_available.jpg"
                      }
                      alt={`location_img_${index}`}
                    />
                    <div>
                      <span
                        className={`ml-4 inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset  ${
                          location.status === "Active"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "ring-red-600/10 text-red-700 bg-red-50"
                        }`}
                      >
                        {location.status}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-left">
                      <span className="ml-4 font-semibold text-left">
                        {location.building}
                      </span>
                      <p className="ml-4 text-sm text-left">{location.room}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full md:flex md:justify-between px-2 py-3">
                    <div className="mb-3 md:w-[30%]">
                      <span>Item list</span>
                    </div>

                    <div className="md:w-[70%] xl:flex xl:justify-end">
                      <Search
                        className="pr-1"
                        id="search_item"
                        name="search_item"
                        onClick={(query) => {
                          setItemSearchKey(query);
                          setLocationId(location.location_id);
                        }}
                      />

                      <div className="flex justify-center w-full md:flex md:justify-end xl:w-auto">
                        <div className="block items-center align-center">
                          <div className="flex space-x-1  items-center justify-center mb-2">
                            <button
                              type="button"
                              className={`flex items-center justify-center rounded-md w-8 h-9 text-xs font-semibold text-white shadow-sm transition duration-300 ${
                                paginationMap[location.location_id]
                                  .currentPage === 1
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[#b00202] hover:bg-[#800000]"
                              }`}
                              disabled={
                                paginationMap[location.location_id]
                                  .currentPage === 1
                              }
                              onClick={() =>
                                changeItemPage(1, location.location_id)
                              }
                            >
                              <ChevronFirst className="p-1" />
                            </button>

                            <button
                              type="button"
                              className={`flex items-center justify-center rounded-md w-8 h-9 text-xs font-semibold text-white shadow-sm transition duration-300 ${
                                paginationMap[location.location_id]
                                  .currentPage == 1 || pagination.total === 0
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[#b00202] hover:bg-[#800000]"
                              }`}
                              disabled={
                                paginationMap[location.location_id]
                                  .currentPage == 1
                              }
                              onClick={() =>
                                changeItemPage(2, location.location_id)
                              }
                            >
                              <ChevronLeft className="p-1" />
                            </button>

                            <button
                              type="button"
                              className={`flex items-center justify-center rounded-md w-8 h-9 text-xs font-semibold text-white shadow-sm transition duration-300 ${
                                paginationMap[location.location_id]
                                  .totalPages ==
                                  paginationMap[location.location_id]
                                    .currentPage ||
                                paginationMap[location.location_id]
                                  .totalPages == 0
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[#b00202] hover:bg-[#800000]"
                              }`}
                              disabled={
                                paginationMap[location.location_id]
                                  .totalPages ==
                                  paginationMap[location.location_id]
                                    .currentPage ||
                                paginationMap[location.location_id]
                                  .totalPages == 0
                              }
                              onClick={() =>
                                changeItemPage(3, location.location_id)
                              }
                            >
                              <ChevronRight className="p-1" />
                            </button>

                            <button
                              type="button"
                              className={`flex items-center justify-center rounded-md w-8 h-9 text-xs font-semibold text-white shadow-sm transition duration-300 ${
                                paginationMap[location.location_id]
                                  .totalPages ==
                                  paginationMap[location.location_id]
                                    .currentPage ||
                                paginationMap[location.location_id]
                                  .totalPages == 0
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[#b00202] hover:bg-[#800000]"
                              }`}
                              disabled={
                                paginationMap[location.location_id]
                                  .totalPages ==
                                  paginationMap[location.location_id]
                                    .currentPage ||
                                paginationMap[location.location_id]
                                  .totalPages == 0
                              }
                              onClick={() =>
                                changeItemPage(4, location.location_id)
                              }
                            >
                              <ChevronLast className="p-1" />
                            </button>
                          </div>
                          <div className="text-[11px] font-medium text-gray-700">
                            Page{" "}
                            {paginationMap[location.location_id].currentPage} of{" "}
                            {paginationMap[location.location_id].totalPages} -
                            Total of{" "}
                            {paginationMap[location.location_id].totalItems}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {itemsMap[location.location_id] &&
                  itemsMap[location.location_id].length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {itemsMap[location.location_id].map((item, index) => (
                        <Card key={index} className="py-3 px-3 m-1 ">
                          <div>
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                setViewDialog(true);
                                setItem(item);
                                setItemCurrentPage(
                                  paginationMap[location.location_id]
                                    .currentPage
                                );
                              }}
                            >
                              <Image
                                width={100}
                                height={100}
                                className="w-[100px] h-[100px] rounded-md hover:scale-105 transition-transform duration-200"
                                src="/images/no_image_available.jpg"
                                alt=""
                              />
                              <div className="description-area mt-3">
                                <div>
                                  <span
                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                      item.status === "Active"
                                        ? "bg-green-50 text-green-700 ring-green-600/20"
                                        : "ring-red-600/10 text-red-700 bg-red-50"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <div className="my-2 px-1">
                                  <span>{item.item_name}</span>
                                </div>
                                <div className="px-1">
                                  <p className="text-xs text-gray-700">
                                    {TruncateText(item.description, 70)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="button-area flex mt-2 px-1">
                              <EditButton
                                onClick={() => {
                                  setEditDialog(true);
                                  setItem(item);
                                  setItemCurrentPage(
                                    paginationMap[location.location_id]
                                      .currentPage
                                  );
                                }}
                                disabled={false}
                                hidden={false}
                              />
                              <DeleteButton
                                onClick={() => {
                                  setDeleteDialog(true);
                                  setItem(item);
                                  setItemCurrentPage(
                                    paginationMap[location.location_id]
                                      .currentPage
                                  );
                                }}
                                disabled={item.status !== "Active"}
                                hidden={false}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full flex justify-center">
                      <NoDataFound />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <NoDataFound />
          )}
        </Accordion>
      </div>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="md:max-w-[500px] sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="h-auto form-body mb-1 w-full scrollbar px-1">
              <DeleteItem
                itemData={item}
                onSubmit={() => {
                  handleClose(item, itemCurrentPage);
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FormLayout>
            <EditItem
              itemData={item}
              onSubmit={() => {
                handleClose(item, itemCurrentPage);
              }}
            />
          </FormLayout>
        </DialogContent>
      </Dialog>

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
            <div className="form-body w-full h-full overflow-y-auto scrollbar px-2 py-2 border rounded-sm">
              <ViewItemData itemData={item} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationItemData;
