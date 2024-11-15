/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ItemFormErrors } from "@/app/types/error";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import ReactStars from "react-stars";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GetAllMobileUser, GetAllUserLocations } from "@/hooks/UserHooks";
import { CreateItem } from "@/hooks/ItemHook";

const AddItem = ({ onClose }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [searchKey, setSearchKey] = useState("");
  const [locationSearchKey, setlocationSearchKey] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [filteredLocation, setLocationSuggestions] = useState([]);
  const [user_id, setUserId] = useState(null);
  const [location_id, setLocationId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const [categoryData, setCategoryData] = useState([]);

  const maxLength = 255;
  const [date, setDate] = React.useState<Date>();

  const [formData, setFormData] = useState({
    user_id: 0,
    user_name: "",
    location_id: 0,
    location_key: "",
    category_id: 0,
    item_name: "",
    description: "",
    quantity: 0,
    rating: 0,
    expiry_date: null,
    perishable: true,
    always_stock: true,
    uncountable: true,
    favorite: true,
  });

  const formSchema = z.object({
    user_id: z.number().int().min(1, { message: "Required*" }),
    location_id: z.number().int().min(1, { message: "Required*" }),
    category_id: z.number().int().min(1, { message: "Required*" }),
    item_name: z.string().min(1, { message: "Required*" }),
    description: z
      .string()
      .min(1, { message: "Required*" })
      .max(255, { message: "Description must not exceed 255 characters." }),
    quantity: z
      .number({ message: "Invalid Quantity" })
      .int({ message: "Invalid Quantity" })
      .min(0, { message: "Required*" })
      .nonnegative(),
    rating: z.number().min(0.5, { message: "Required*" }),
  });

  const searchUser = (e) => {
    const key = e.target.value;
    setSearchKey(key);
    setUserId("");
    setFormData((prev) => ({ ...prev, user_name: key }));
    setFormData((prev) => ({ ...prev, user_id: 0 }));
    setFormData((prev) => ({ ...prev, location_key: "" }));
    setFormData((prev) => ({ ...prev, location_id: 0 }));
    setLocationSuggestions([]);
    setShowLocation(false);
  };
  const selectMUser = (value) => {
    const user_id = value.user_id;
    const user_name = value.name;
    setShowSuggestions(false);
    setSearchKey(user_name);
    setUserId(user_id);
    setFormData((prev) => ({
      ...prev,
      user_id: user_id,
      user_name: user_name,
    }));
    try {
      formSchema.pick({ user_id: true }).parse({ user_id });
      setErrors((prev) => ({ ...prev, user_id: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, user_id: error.errors[0].message }));
      }
    }
  };

  const searchLocation = (e) => {
    const key = e.target.value;
    setlocationSearchKey(key);
    setLocationId("");
    setFormData((prev) => ({ ...prev, location_key: key }));
    setFormData((prev) => ({ ...prev, location_id: 0 }));
  };

  const selectMLocation = (value) => {
    const location_id = value.location_id;
    const location_key = value.building;
    setShowLocation(false);
    setlocationSearchKey(location_key);
    setLocationId(location_id);
    setFormData((prev) => ({
      ...prev,
      location_id,
      location_key,
    }));
    try {
      formSchema.pick({ location_id: true }).parse({ location_id });
      setErrors((prev) => ({ ...prev, location_id: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          location_id: error.errors[0].message,
        }));
      }
    }
  };

  useEffect(() => {
    const fetchMobileUsers = async () => {
      if (searchKey) {
        try {
          const data = await GetAllMobileUser({
            page: 1,
            limit: 100,
            searchKey,
          });
          setFilteredSuggestions(data.list);
          setShowSuggestions(user_id === "" ? data.list.length > 0 : false);
        } catch (error) {
          console.error("Error fetching user suggestions:", error);
        }
      } else {
        setShowSuggestions(false);
      }
    };
    const debounceFetch = setTimeout(fetchMobileUsers, 300);
    return () => clearTimeout(debounceFetch);
  }, [user_id, searchKey]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (searchKey) {
        try {
          const params = {
            page: 1,
            limit: 100,
            searchKey: locationSearchKey,
            user_id: formData.user_id,
          };
          const data = await GetAllUserLocations(params);
          console.log("data.list", data.list);
          setLocationSuggestions(data.list);
          setShowLocation(location_id === "" ? data.list.length > 0 : false);
        } catch (error) {
          console.error("Error fetching user suggestions:", error);
        }
      } else {
        setShowLocation(false);
      }
    };
    const debounceFetch = setTimeout(fetchUserLocation, 300);
    return () => clearTimeout(debounceFetch);
  }, [location_id, locationSearchKey]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = [
        { id: 1, value: "Food" },
        { id: 2, value: "Gadgets" },
        { id: 3, value: "Clothes" },
        { id: 4, value: "Tools" },
        { id: 5, value: "Utensils" },
        { id: 6, value: "Hygiene" },
      ];
      setCategoryData(categories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length) {
      const validateField = (name, value) => {
        try {
          const pickField = { [name]: true } as Record<
            keyof typeof formSchema.shape,
            true
          >;
          formSchema.pick(pickField).parse({ [name]: value });
          setErrors((prev) => ({ ...prev, [name]: undefined }));
        } catch (error) {
          if (error instanceof z.ZodError) {
            setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
          }
        }
      };
      Object.keys(formData).forEach((key) => validateField(key, formData[key]));
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const checkboxChange = (event) => {
    const id = event.target.id;
    setFormData((prev) => ({
      ...prev,
      [id]: event.target.dataset.state !== "checked",
    }));
  };

  const createItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("SUbmit:", formData);

    try {
      const result = await CreateItem(formData);
      if (result.status === 201) {
        toast({
          className: "success_message",
          description: result.message,
        });
        onClose();
      } else if (result.status === 401) {
        router.push("/");
      }
    } catch (error) {
      console.log("ERROR: createItem function: ", error);
      toast({
        className: "error_message",
        description: "Error creating item data",
      });
    }
  };
  return (
    <form className="space-y-2" onSubmit={createItem}>
      
      <div className="relative w-full pb-2">
        <div className="w-full">
          <label
            htmlFor="user_name"
            className="flex items-center text-sm font-medium leading-4 text-gray-900"
          >
            <span className="pr-3 py-2">Select User</span>
            {errors.user_id && (
              <p className="text-red-500 text-xs font-normal py-1">
                {errors.user_id}
              </p>
            )}
          </label>
          <div className="relative">
            <input
              id="user_name"
              name="user_name"
              type="text"
              required
              value={formData.user_name}
              onChange={searchUser}
              className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              placeholder="Search Mobile User"
            />
            {showSuggestions && (
              <ul className="absolute z-10 w-full border border-gray-300 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => selectMUser(suggestion)}
                    className="cursor-pointer p-2 text-sm hover:bg-blue-100"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full pb-2">
        <div className="w-full">
          <label
            htmlFor="location_key"
            className="flex items-center text-sm font-medium leading-4 text-gray-900"
          >
            <span className="pr-3 py-2">Select Location</span>
            {errors.location_id && (
              <p className="text-red-500 text-xs font-normal py-1">
                {errors.location_id}
              </p>
            )}
          </label>
          <div className="relative">
            <input
              id="location_key"
              name="location_key"
              type="text"
              required
              disabled={
                formData.user_id < 0 ||
                formData.user_id === null ||
                formData.user_id === 0
              }
              value={formData.location_key}
              onChange={searchLocation}
              className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              placeholder={` ${
                formData.user_id < 0 ||
                formData.user_id === null ||
                formData.user_id === 0
                  ? ""
                  : "Search User Locations"
              }`}
            />
            {showLocation && (
              <ul className="absolute z-10 w-full border border-gray-300 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto">
                {" "}
                {/* Set max height and overflow */}
                {filteredLocation.map((location, index) => (
                  <li
                    key={index}
                    onClick={() => selectMLocation(location)}
                    className="cursor-pointer p-2 text-sm hover:bg-blue-100"
                  >
                    {location.building}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className=" pb-2">
        <label
          htmlFor="category_id"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Category</span>
          {errors.category_id && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.category_id}
            </p>
          )}
        </label>

        <div>
          <select
            id="category_id"
            name="category_id"
            required
            value={formData.category_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                category_id: parseInt(e.target.value),
              })
            }
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          >
            <option value={0}></option>
            {categoryData.map((category, index) => (
              <option key={index} value={category.id}>
                {category.value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="item_name"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Item Name</span>
          {errors.item_name && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.item_name}
            </p>
          )}
        </label>
        <div>
          <input
            id="item_name"
            name="item_name"
            type="text"
            required
            value={formData.item_name}
            onChange={handleChange}
            maxLength={100}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
        <div className="mt-1 flex justify-end text-xs text-gray-600">
          <span>{`${formData.item_name.length} / ${100} characters`}</span>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Description</span>
          {errors.description && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.description}
            </p>
          )}
        </label>
        <div>
          <textarea
            id="description"
            name="description"
            required
            autoComplete="off"
            rows={4}
            maxLength={maxLength}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
        <div className="mt-1 flex justify-end text-xs text-gray-600">
          <span>{`${formData.description.length} / ${maxLength} characters`}</span>
        </div>
      </div>

      <div className="pb-2">
        <label
          htmlFor="quantity"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Quantity</span>
          {errors.quantity && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.quantity}
            </p>
          )}
        </label>
        <div>
          <input
            id="quantity"
            name="quantity"
            type="number"
            required
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="">
        <span className="flex items-center text-sm font-medium leading-4 text-gray-900">
          <span className="pr-3 py-2">Rating</span>
          {errors.rating && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.rating}
            </p>
          )}
        </span>
        <ReactStars
          value={formData.rating}
          count={5}
          size={28}
          color2={"#7ec800"}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, rating: value }))
          }
        />
      </div>

      <div className="items-top flex space-x-2 py-4">
        <Checkbox
          id="perishable"
          name="perishable"
          checked={formData.perishable}
          onClick={checkboxChange}
        />
        <div className="grid gap-1.5 leading-none pr-3">
          <label
            htmlFor="perishable"
            className="text-sm mt-[2px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Perisable
          </label>
        </div>

        <Checkbox
          id="always_stock"
          name="always_stock"
          checked={formData.always_stock}
          onClick={checkboxChange}
        />
        <div className="grid gap-1.5 leading-none pr-3">
          <label
            htmlFor="always_stock"
            className="text-sm mt-[2px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Always Stock
          </label>
        </div>

        <Checkbox
          id="uncountable"
          name="uncountable"
          checked={formData.uncountable}
          onClick={checkboxChange}
        />
        <div className="grid gap-1.5 leading-none pr-3">
          <label
            htmlFor="uncountable"
            className="text-sm mt-[2px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Uncountable
          </label>
        </div>

        <Checkbox
          id="favorite"
          name="favorite"
          checked={formData.favorite}
          onClick={checkboxChange}
        />
        <div className="grid gap-1.5 leading-none pr-3">
          <label
            htmlFor="favorite"
            className="text-sm mt-[2px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Favorite
          </label>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center text-sm font-medium leading-4 text-gray-900">
          <span className="pr-3 py-2">Expiry Date</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              onClick={() => {}}
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.expiry_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.expiry_date ? (
                format(formData.expiry_date, "PPP")
              ) : (
                <span>Select Expiry Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
            id="exp_date"
              mode="single"
              selected={formData.expiry_date}
              onSelect={(e) => {
                if(e){
                  const dateWithOffset = new Date(e);
                  dateWithOffset.setHours(dateWithOffset.getHours() + 8);
                  const utcDateOnly = dateWithOffset.toISOString().split('T')[0];
                  setFormData({ ...formData, expiry_date: utcDateOnly });
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col sm:flex-row justify-center py-3">
        <button
          type="submit"
          className="flex justify-center items-center rounded-md bg-[#b00202] px-4 h-9 text-xs leading-4 text-white shadow-sm hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300"
        >
          Create New Item
        </button>
      </div>
    </form>
  );
};

export default AddItem;
