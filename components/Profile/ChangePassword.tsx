"use client";

import React, { useEffect, useState, useCallback } from "react";
import CardLayout from "./CardLayout";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import SubmitButton from "../Shared/SubmitButton";
import { GenerateRandomPassword } from "@/utils/GenerateRandomPassword";
import { passwordSchema } from "@/utils/InputValidator";
import { UpdateProfile } from "@/hooks/ProfileHooks";
import { useRouter } from "next/navigation";

interface FormData {
  user_id: number | null;
  new_password: string;
  current_password: string;
  confirm_password: string;
}

const ChangePassword = () => {
  const router = useRouter();
  const { currentUser } = useUser();
  const initialData = {
    user_id: currentUser?.user_id,
    current_password: "",
    new_password: "",
    confirm_password: ""
  }
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const toggleCurrentPassword = () => {
    setShowCurrentPass(!showCurrentPass);
  };

  const formSchema = z
    .object({
      current_password: z
        .string()
        .min(1, { message: "Current password is required*" }),
      new_password: passwordSchema,
      confirm_password: z
        .string()
        .min(8, { message: "Confirm password is required*" }),
    })
    .superRefine((data, ctx) => {
      if (data.confirm_password) {
        if (data.new_password !== data.confirm_password) {
          ctx.addIssue({
            path: ["confirm_password"],
            message: "Passwords don't match.",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    });

  // Validate form data using Zod schema
  useEffect(() => {
    if (Object.keys(formData).length) {
      try {
        const result = formSchema.safeParse(formData);
        if (result.success) {
          setErrors({});
          setIsFormValid(true);
        } else {
          const newErrors = result.error.errors.reduce((acc, error) => {
            acc[error.path[0]] = error.message;
            return acc;
          }, {});
          setErrors(newErrors);
          setIsFormValid(false);
        }
      } catch (error) {
        console.error("Unexpected validation error:", error);
      }
    }
  }, [formData]);

  const updatePassword = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const result = await UpdateProfile(formData, 'password');
        if (result.status === 201) {
          toast({
            className: "success_message",
            description: result.message,
          });
          setFormData(initialData)
          setTouchedFields({
            current_password: false,
            new_password: false,
            confirm_password: false,
          })
        } else if (result.status === 401) {
          router.push("/");
        }else{
          toast({
            className: "error_message",
            description: result.message,
          });
        }
      } catch (error) {
        console.log("Error updating password:", error);
        toast({
          className: "error_message",
          description: "An error occurred while updating your password.",
        });
      }
    },
    [formData]
  );
  const handleFocus = (field: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };
  return (
    <CardLayout cardTitle={"Change Password"}>
      <form onSubmit={updatePassword}>
        <div className="form-input mb-3">
          <div className="relative">
            <input
              id="current_password"
              name="current_password"
              type={showCurrentPass ? "text" : "password"}
              value={formData.current_password}
              onChange={(e) =>{
                setFormData({ ...formData, current_password: e.target.value });
                handleFocus("current_password");
              }}
              maxLength={100}
              placeholder="Current Password"
              className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="button"
              onClick={toggleCurrentPassword}
              className="absolute inset-y-0 right-0 flex items-center px-3"
            >
              {showCurrentPass ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          { touchedFields.current_password && errors.current_password && (
              <p className="text-red-500 text-xs font-normal py-1">
                {errors.current_password}
              </p>
            )}
        </div>
        <div className="form-input mb-3">
          <div className="flex items-center w-full">
            <div className="relative w-full">
              <input
                id="new_password"
                name="new_password"
                type={showPassword ? "text" : "password"}
                value={formData.new_password}
                onChange={(e) =>
                  {
                    setFormData({ ...formData, new_password: e.target.value })
                    handleFocus("new_password");
                  }
                }
                placeholder="New Password"
                maxLength={100}
                className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                const password = GenerateRandomPassword();
                setFormData({ ...formData, new_password: password });
                handleFocus("new_password");
              }}
              className="ml-2 bg-gray-900 text-white h-9 rounded-md w-[150px] px-3 py-1 text-xs font-normal hover:bg-gray-700 transition duration-300"
            >
              Generate
            </button>
          </div>
          {touchedFields.new_password && errors.new_password && (
              <p className="text-red-500 text-xs font-normal py-1">
                {errors.new_password}
              </p>
            )}
        </div>

        <div className="form-input mb-3">
          <div className="relative">
            <input
              id="confirm_password"
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirm_password}
              onChange={(e) =>
              {
                setFormData({ ...formData, confirm_password: e.target.value })
                handleFocus("confirm_password");
              }
              }
              maxLength={100}
              placeholder="Confirm Password"
              className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute inset-y-0 right-0 flex items-center px-3"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {touchedFields.confirm_password && errors.confirm_password && (
              <p className="text-red-500 text-xs font-normal py-1">
                {errors.confirm_password}
              </p>
            )}
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton buttonName="Save Changes" isFormValid={isFormValid} />
        </div>
      </form>
    </CardLayout>
  );
};

export default ChangePassword;
