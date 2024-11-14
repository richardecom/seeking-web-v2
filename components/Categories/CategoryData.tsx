/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { NoDataFound } from "../Shared/NoDataFound";
import { Button } from "../ui/button";
import { Archive, CircleHelp, Eye, Pencil } from "lucide-react";
import { TruncateText } from "@/utils/TruncateText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import FormLayout from "../Shared/FormLayout";
import { Checkbox } from "../ui/checkbox";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";
import ViewCategory from "./ViewCategory";
import ViewButton from "../Shared/ViewButton";
import EditButton from "../Shared/EditButton";
import DeleteButton from "../Shared/DeleteButton";

const CategoryData = ({ CategoryData, headers, onClose, onExcludesChange }) => {
  const [catType, setCatType] = useState([]);
  const [categories, setCategories] = useState(CategoryData);
  const [excludes, setExcludes] = useState([]);
  const [category, setCategory] = useState([]);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const ActionButtonClicked = (category, action) => {
    setCategory(category);
    if (action === "edit") {
      setEditDialog(true);
    } else if (action === "delete") {
      setDeleteDialog(true);
    } else if (action === "view") {
      setViewDialog(true);
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
      setExcludes((prevExcludes) => prevExcludes.filter((id) => id !== cat_id));
    } else {
      setExcludes((prevExcludes) => [...prevExcludes, cat_id]);
    }
  };

  const bulkUncheck = (value) => {
    // Set all categories to selected or not based on main checkbox
    setAllSelected(value);
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({ ...category, selected: value }))
    );
    if (value) {
      setExcludes((prevExcludes) =>
        prevExcludes.filter(
          (excludedId) =>
            !categories.some((category) => category.category_id === excludedId)
        )
      );
    } else {
      categories.forEach((category) => {
        setExcludes((prevExcludes) => {
          if (!prevExcludes.includes(category.category_id)) {
            return [...prevExcludes, category.category_id];
          }
          return prevExcludes;
        });
      });
    }
  };

  const handleClose = () => {
    setEditDialog(false);
    setDeleteDialog(false);
    onClose();
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
    onExcludesChange(excludes);
    console.log("excludes", excludes);
  }, [excludes, onExcludesChange]);

  useEffect(() => {
    if (excludes.length > 0) {
      const updatedCategories = CategoryData.map((category) => {
        return excludes.includes(category.category_id)
          ? { ...category, selected: false }
          : category;
      });
      setCategories(updatedCategories);
    } else {
      setCategories(CategoryData);
    }
  }, [CategoryData]);

  useEffect(() => {
    const allChecked = categories.every((cat) => cat.selected);
    setAllSelected(allChecked);
  }, [categories]);

  return (
    <div className="overflow-y-auto max-h-[450px] mb-8">
      {categories.length === 0 ? (
        <NoDataFound />
      ) : (
        <table className="min-w-full border-gray-300 rounded bg-white">
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
                    className={`px-4 py-2 border-b text-sm flex justify-center items-center`}
                  >
                    <ViewButton
                      onClick={() => ActionButtonClicked(category, "view")}
                      disabled={false}
                      hidden={false}
                    />
                    <EditButton
                      onClick={() => ActionButtonClicked(category, "edit")}
                      disabled={false}
                      hidden={false}
                    />
                    <DeleteButton
                      onClick={() => ActionButtonClicked(category, "delete")}
                      disabled={category.status !== "Active"}
                      hidden={category.status !== "Active"}
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
              <span className="rounded-full border w-[25px] h-[25px] flex justify-center items-center bg-blue-200 ring-1 ring-inset ring-blue-600/10">
                <CircleHelp className="text-center text-blue-500" />
              </span>
              <span className=" text-gray-800 p-1 ml-2 text-md">View</span>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-1 h-auto max-h-[470px] ">
            <div className="form-body w-full h-full overflow-y-auto scrollbar px-2 py-2 border rounded-sm">
              <ViewCategory CategoryData={category} />
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
            <EditCategory editCatData={category} onSubmit={handleClose} />
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
              <DeleteCategory deleteData={category} onSubmit={handleClose} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryData;
