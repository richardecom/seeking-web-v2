/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { GenerateRandomPassword } from "@/utils/GenerateRandomPassword";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";

import Title from "@/components/Auth/Title";
import TitleDescWrap from "@/components/Auth/TitleDescWrap";
import Description from "@/components/Auth/Description";
import Footer from "@/components/Auth/Footer";
import { ResetPassword } from "@/hooks/Auth";

const ResetPasswordForm = ({ email_address }) => {
  const router = useRouter();

  console.log("email_address from ResetPasswordForm: ", email_address);

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

  const formSchema = z.object({
    password: passwordSchema,
  });

  const [formData, setFormData] = useState({ password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (Object.keys(formData).length) {
      try {
        const result = formSchema.safeParse(formData);

        console.log(result);
        if (result.success) {
          setErrors({});
        } else {
          const newErrors = result.error.errors.reduce((acc, error) => {
            acc[error.path[0]] = error.message;
            return acc;
          }, {});
          setErrors(newErrors);
        }
      } catch (error) {
        console.error("Unexpected validation error:", error);
      }
    }
  }, [formData, setErrors]);

  const resetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors = validation.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {} as { [key: string]: string });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    try {
      const result = await ResetPassword({
        email_address,
        password: formData.password,
      });
      if (result.status === 201) {
        router.push("/");
        toast({
          className: "success_message",
          description: result.message,
        });
      } else {
        toast({
          className: "error_message",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        className: "error_message",
        description: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {/* <LoginLayout> */}
      <Card className="w-full sm:max-w-lg border px-10 pb-7">
        <TitleDescWrap>
          <Title title="Create a New Password" />
          <Description
            className="text-black "
            description="To ensure your account is secure, please create a password that includes the following criteria: "
          />
        </TitleDescWrap>
        {errors.password && (
          <TitleDescWrap>
            <Description
              className="text-green-600"
              description="At least 1 special character (e.g., !@#$%^&*)"
            />
            <Description
              className="text-green-600"
              description="A mix of uppercase and lowercase letters"
            />
            <Description
              className="text-green-600"
              description="At least 8 characters in total"
            />
          </TitleDescWrap>
        )}

        <div>
          <form onSubmit={resetPassword} className="space-y-6 p-1 mt-5">
            <div>
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
                    setFormData({ ...formData, password });
                  }}
                  className="ml-2 bg-gray-900 text-white h-9 rounded-md w-[100px] px-3 py-1 text-xs font-normal hover:bg-gray-700 transition duration-300"
                >
                  Generate
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#b00202] hover:bg-[#800000]"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-300`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
        <Footer title="Login" link={"/"} />
      </Card>
      {/* </LoginLayout> */}
    </>
  );
};
export default ResetPasswordForm;
