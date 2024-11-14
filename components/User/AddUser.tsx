/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserFormErrors } from "@/app/types/error";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CreateUser } from "@/hooks/UserHooks";
import { GenerateRandomPassword } from "@/utils/GenerateRandomPassword";
import { GetOneTimePin } from "@/hooks/OtpHooks";

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

const AddUser = ({ onClose }) => {
  const router = useRouter();
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [isFormValid, setIsFormValid] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(20, { message: "Password must not exceed 20 characters." })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must contain at least one number.",
    })
    // .refine((password) => /[!@#$%^&*]/.test(password), {
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "Password must contain at least one special character.",
    });

  const formSchema = z
    .object({
      email_address: z
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
          message: "Invalid email address.",
        })
        .min(1, { message: "Required*" }),
      name: z
        .string()
        .min(2, { message: "Required*" })
        .max(100, { message: "Name must not exceed 100 characters." }),
      address: z
        .string()
        .min(1, { message: "Required*" })
        .max(100, { message: "Address must not exceed 100 characters." }),
      dob: z.string().min(1, { message: "Required* " }),
      password: passwordSchema,
      confirm_password: z.string().min(8, { message: "Required*" }),
      otp: z.string().min(6, { message: "Required*" }).max(6, { message: "OTP must not exceed 6 characters." }),
    })
    .superRefine((data, ctx) => {
      if (data.confirm_password) {
        if (data.password !== data.confirm_password) {
          ctx.addIssue({
            path: ["confirm_password"],
            message: "Passwords don't match.",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    });


  const [formData, setFormData] = useState({
    email_address: "",
    name: "",
    address: "",
    dob: today,
    password: "",
    confirm_password: "",
    otp: "",
  });

  const { timeLeft, isActive, startTimer } = useTimer(120); // 2 minutes
  const requestOtp = () => {
    console.log(formData.email_address !== '')
    console.log(errors.email_address)
    if(formData.email_address !== '' && errors.email_address === undefined){
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
      const result = await GetOneTimePin({email: formData.email_address, type: 1});
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

  const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await CreateUser(formData);
      if (result.status === 201) {
        toast({
          className: "success_message",
          description: result.message,
        });
        onClose();
      } else if (result.status === 401) {
        router.push("/");
      } else {
        toast({
          className: "error_message",
          description: result.message,
        });
      }
    } catch (error) {
      console.log("ERROR: createUser function: ", error);
      toast({
        className: "error_message",
        description: "Error creating user data",
      });
    }
  };

  useEffect(() => {
    if (Object.keys(formData).length) {
      try {
        const result = formSchema.safeParse(formData);

        console.log(result);
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
  }, [formData, setErrors]);

  return (
    <form className="space-y-2" onSubmit={createUser}>
      <div>
        <label
          htmlFor="email_address"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Email Address</span>
          {errors.email_address && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.email_address}
            </p>
          )}
        </label>
        <div className="flex items-center">
          <input
            id="email_address"
            name="email_address"
            type="email"
            required
            value={formData.email_address}
            onChange={(e) =>
              setFormData({ ...formData, email_address: e.target.value })
            }
            maxLength={100}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
          <button
            type="button"
            onClick={requestOtp}
            disabled={isActive || errors.email_address !== undefined}
            className={`ml-2  text-white h-9 rounded-md w-[150px] px-3 py-1 text-xs font-normal ${isActive || errors.email_address? 'bg-gray-400 cursor-not-allowed':'bg-gray-900 hover:bg-gray-700 transition duration-300'}`}
          >
            {isActive ? `Please wait ${timeLeft}s` : 'Get Code'}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="name"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Full name</span>
          {errors.name && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.name}
            </p>
          )}
        </label>
        <div>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            maxLength={100}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Address</span>
          {errors.address && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.address}
            </p>
          )}
        </label>
        <div>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="address"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            maxLength={100}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center text-sm font-medium leading-4 text-gray-900">
          <span className="pr-3 py-2">Birthdate</span>
          {errors.dob && (
            <p className="text-red-500 text-xs font-normal py-1">
              {errors.dob}
            </p>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              onClick={() => {}}
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.dob && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dob ? (
                format(formData.dob, "PPP")
              ) : (
                <span>Date of Birth</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              id="dob"
              mode="single"
              selected={formData.dob ? new Date(formData.dob) : null}
              onSelect={(e) => {
                if (e) {
                  const dateWithOffset = new Date(e);
                  dateWithOffset.setHours(dateWithOffset.getHours() + 8);
                  const utcDateOnly = dateWithOffset
                    .toISOString()
                    .split("T")[0];
                  setFormData({ ...formData, dob: utcDateOnly });
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full">
        <label
          htmlFor="password"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Password</span>
          {errors.password && (
            <p className="text-red-500 text-xs font-normal py-1">
              {errors.password}
            </p>
          )}
        </label>
        <div className="flex items-center w-full">
          <div className="relative w-full">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              maxLength={100}
              className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
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
              setFormData({ ...formData, password: password });
            }}
            className="ml-2 text-white h-9 rounded-md w-[150px] px-3 py-1 text-xs font-normal bg-gray-900 hover:bg-gray-700 transition duration-300"
          >
            Generate
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">Confirm Password</span>
          {errors.confirm_password && (
            <p className="text-red-500 text-xs font-normal py-1">
              {errors.confirm_password}
            </p>
          )}
        </label>
        <div className="relative">
          <input
            id="confirm_password"
            name="confirm_password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.confirm_password}
            onChange={(e) =>
              setFormData({ ...formData, confirm_password: e.target.value })
            }
            maxLength={100}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-3"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="otp"
          className="flex items-center text-sm font-medium leading-4 text-gray-900"
        >
          <span className="pr-3 py-2">One Time Pin (OTP)</span>
          {errors.otp && (
            <p className="text-red-500 text-xs font-normal  py-1">
              {errors.otp}
            </p>
          )}
        </label>
        <div>
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
              }
          }}
            maxLength={6}
            minLength={6}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center py-3">
        <button
          disabled={!isFormValid}
          type="submit"
          className={`flex justify-center items-center rounded-md  px-4 h-9 text-xs leading-4 text-white shadow-sm  ${
            isFormValid
              ? "bg-[#b00202] hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Create New User
        </button>
      </div>
    </form>
  );
};

export default AddUser;
