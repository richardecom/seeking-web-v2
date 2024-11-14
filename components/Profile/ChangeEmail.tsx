"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { GetOneTimePin } from "@/hooks/OtpHooks";
import { useRouter } from "next/navigation";

interface FormData {
  user_id: number;
  current_email: string;
  new_email: string;
  otp: string;
}
const useTimer = (initialTime) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const startTimer = () => {
    setIsActive(true);
    setTimeLeft(initialTime);
  };

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  return { timeLeft, isActive, startTimer };
};

const ChangeEmail = () => {
  const router = useRouter();
  const { currentUser, updateBasic } = useUser();
  const [formData, setFormData] = useState<FormData>({
    user_id: currentUser?.user_id,
    current_email: "",
    new_email: "",
    otp: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    new_email: false,
    otp: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const formSchema = z.object({
    new_email: z
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
          message: "Invalid email address.",
        })
        .min(1, { message: "New email address is required*" }),
    otp: z.string().min(6, { message: "OTP is required.*" }).max(6, { message: "OTP must not exceed 6 characters." }),
  });

  // Sync form data with currentUser (if available)
  useEffect(() => {
    if (currentUser) {
      setFormData({
        user_id: currentUser?.user_id,
        current_email: currentUser?.email_address || "",
        new_email: "",
        otp: "",
      });
    }
  }, [currentUser]);

  const handleFocus = (field: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

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

  const { timeLeft, isActive, startTimer } = useTimer(120); // 2 minutes
  const requestOtp = () => {
    if(formData.new_email !== '' && errors.new_email === undefined){
      if (!isActive) {
        startTimer();
        getOtp();
      } else {
        console.log("Button is currently inactive. Please wait.");
      }
    }else{
      toast({
        className: "error_message",
        description: "Please enter your email first.",
      });
    }
  }

  const getOtp = async () => {
    try {
      const result = await GetOneTimePin({email: formData.new_email, type: 2});
      if (result.status === 201) {
        toast({
          className: "success_message",
          description: result.message,
        });
      } else if (result.status === 401) {
        router.push("/");
      } else {
        toast({
          className: "error_message",
          description: result.message,
        });
      }
    } catch (error) {
      console.log("ERROR: getOtp function: ", error);
      toast({
        className: "error_message",
        description: "Error generating otp code",
      });
    }
  };

  // Handle form submission
  const updateEmail = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        console.log('FORMDATA: ', formData)
        updateBasic(formData, 'email')
      } catch (error) {
        console.log("Error updating user data:", error);
        toast({
          className: "error_message",
          description: "An error occurred while updating your email.",
        });
      }
    },
    [formData]
  );

  return (
    <CardLayout cardTitle={"Change Email Address"}>
      <form onSubmit={updateEmail}>

        <div className="form-input mb-3">
        <input
            id="current_email"
            name="current_email"
            type="email"
            required
            value={formData.current_email}
            onChange={(e) =>
              setFormData({ ...formData, current_email: e.target.value })
            }
            disabled={true}
            maxLength={100}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
        <div className="form-input mb-3">
          
        <div className="flex items-center">
          <input
            id="new_email"
            name="new_email"
            type="email"
            required
            value={formData.new_email}
            onChange={(e) => {
              setFormData({ ...formData, new_email: e.target.value });
              handleFocus("new_email");
            }}
           placeholder="Enter your new email"
            maxLength={100}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
          <button
            type="button"
            onClick={requestOtp}
            disabled={isActive || errors.new_email !== undefined}
            className={`ml-2  text-white h-9 rounded-md w-[150px] px-3 py-1 text-xs font-normal ${isActive || errors.new_email? 'bg-gray-400 cursor-not-allowed':'bg-gray-900 hover:bg-gray-700 transition duration-300'}`}
          >
            {isActive ? `Please wait ${timeLeft}s` : 'Get Code'}
          </button>
        </div>

          {touchedFields.new_email && errors.new_email && <p className="text-red-500 text-xs font-normal py-1">{errors.new_email}</p>}
        </div>
        <div className="form-input mb-3">
        <input
            id="otp"
            name="otp"
            type="text"
            autoComplete="otp"
            required
            value={formData.otp}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numbers and update state
              if (/^\d*$/.test(value) && value.length <= 6) {
                  setFormData({ ...formData, otp: value });
                  handleFocus("otp");
              }
          }}
            maxLength={6}
            minLength={6}
            placeholder="Enter One Time Pin (OTP)"
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
          {touchedFields.otp && errors.otp && <p className="text-red-500 text-xs font-normal py-1">{errors.otp}</p>}
        </div>

        <div className="flex justify-end">
          <SubmitButton buttonName="Save Changes" isFormValid={isFormValid} />
        </div>
      </form>
    </CardLayout>
  );
};

export default ChangeEmail;
