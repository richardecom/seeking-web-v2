"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "../ui/card";
import CardLayout from "./CardLayout";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import SubmitButton from "../Shared/SubmitButton";
import { useRouter } from "next/navigation";
import { UpdateProfile } from "@/hooks/ProfileHooks";
import { DatePicker } from "../ui/date-picker";
import { BirthDatePicker } from "../ui/birth-date-picker";

interface FormData {
  user_id: number | null;
  name: string;
  address: string;
  image: File | null;
  dob: string | null;
}

const ChangeBasicInfo = () => {
  const router = useRouter();
  const { currentUser, updateBasic, login: contextLogin } = useUser();
  console.log('currentUser: ', currentUser)
  const initialData = {
    user_id: currentUser?.user_id,
    name: "",
    address: "",
    image: null,
    dob: "",
  }
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: "Name is required*" }).max(100, { message: "Name must not exceed 100 characters." }),
    address: z.string().min(1, { message: "Address is required*" }).max(100, { message: "Address must not exceed 100 characters." }),
    dob: z.string().min(1, { message: "Date of birth is required*" }),
  });

  // Sync form data with currentUser (if available)
  useEffect(() => {
    if (currentUser) {
      setFormData({
        user_id: currentUser.user_id || null, 
        name: currentUser.name || "",
        address: currentUser.address || "",
        image: null,
        dob: currentUser.dob,
      });
    }
  }, [currentUser]);

  // Validate form data using Zod schema
  useEffect(() => {
    const result = formSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      setIsFormValid(true);
    } else {
      const validationErrors = result.error.errors.reduce((acc: { [key: string]: string }, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(validationErrors);
      setIsFormValid(false);
    }
  }, [formData]);

  // Handle input change for text fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input change (image upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (validTypes.includes(file.type)) {
        setFormData((prevState) => ({
          ...prevState,
          image: file,
        }));
      } else {
        toast({
          className: "error_message",
          description: "Please select a valid image file (PNG, JPG, or JPEG).",
        });
      }
    }
  };

  // Handle form submission
  const updateBasicInfo = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {

      setIsLoading(true)
      event.preventDefault();

          const fd = new FormData();
          fd.append('user_id', formData.user_id.toString())
          fd.append('name', formData.name)
          fd.append('address', formData.address)
          fd.append('dob', formData.dob)
            if(formData.image){
              fd.append('imageFile', formData.image)
            }
      try {
        // updateBasic(fd, 'basic')
        const result = await UpdateProfile(fd, 'basic');
        if(result.status === 401){
          router.push('/')
        }else if(result.status === 201){
          contextLogin(result.data)
          toast({
            className: "success_message",
            description: result.message,
          });
        }else{
          toast({
            className: "error_message",
            description: "Error updating your basic information",
          });
        }
      } catch (error) {
        console.log("Error updating user data:", error);
        toast({
          className: "error_message",
          description: "An error occurred while updating your data.",
        });
      } finally{
        setIsLoading(false)
      }
    },
    [formData]
  );

  return (
    <CardLayout cardTitle={"Change Basic Information"}>
      <form onSubmit={updateBasicInfo}>
        <div className="form-input mb-3">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
          {errors.name && <p className="text-red-500 text-xs font-normal py-1">{errors.name}</p>}
        </div>

        <div className="form-input mb-3">
          <input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your current address"
            autoComplete="address"
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
          {errors.address && <p className="text-red-500 text-xs font-normal py-1">{errors.address}</p>}
        </div>

        <div className="form-input mb-3">
          <BirthDatePicker onSelect={
            (selectedDate) => {
              if (selectedDate) {
                const updatedDate = new Date(selectedDate);
                updatedDate.setHours(updatedDate.getHours() + 8);
                const utcDateOnly = updatedDate.toISOString().split("T")[0];
                setFormData({ ...formData, dob: utcDateOnly });
              }
              }
          } defaultDate = {formData?.dob ? new Date(formData?.dob) : new Date()}/>
        </div>

        <div className="form-input mb-3">
          <Input
            type="file"
            id="selectPhoto"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>

        <div className="flex justify-end">
          <SubmitButton buttonName="Save Changes" isFormValid={isFormValid} isLoading={isLoading}/>
        </div>
      </form>
    </CardLayout>
  );
};

export default ChangeBasicInfo;
