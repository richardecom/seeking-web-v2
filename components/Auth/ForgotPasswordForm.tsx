/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { OtpForm } from "./OtpForm";
import { GetOneTimePin } from "@/hooks/Auth";
import { Card } from "../ui/card";
import TitleDescWrap from "./TitleDescWrap";
import Description from "./Description";
import Title from "./Title";
import Footer from "./Footer";

export const ForgotPasswordForm = () => {
  const formSchema = z.object({
    email_address: z
      .string()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: "Invalid email address.",
      })
      .min(1, { message: "Required*" }),
  });

  const [formData, setFormData] = useState({ email_address: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const validation = formSchema.safeParse({ ...formData, [name]: value });
    if (!validation.success) {
      const newErrors = validation.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {} as { [key: string]: string });
      setErrors(newErrors);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const requestForgotPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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
      const result = await GetOneTimePin({
        email: formData.email_address,
        type: 3,
      });
      if (result.status === 201) {
        toast({
          className: "success_message",
          description: result.message,
        });

        setIsOtpSent(true);
      } else {
        toast({
          className: "error_message",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
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
      <div>
        {!isOtpSent ? (
          <Card className="w-full sm:max-w-lg border px-10 pb-7">
            <TitleDescWrap>
              <Title title="Request Password Reset" />
              <Description
                className="text-black"
                description="Enter your registered email. OTP will be sent after submission"
              />
            </TitleDescWrap>
            <form onSubmit={requestForgotPassword} className="space-y-6 p-1">
              <div>
                <label
                  htmlFor="email_address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email_address"
                    name="email_address"
                    type="email"
                    required
                    autoComplete="email_address"
                    value={formData.email_address}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border text-sm p-2 shadow-sm transition duration-200 placeholder:text-gray-400 ${
                      errors.email_address
                        ? "border-red-500 focus:border-red-600 focus:outline-none focus:ring- focus:ring-red-600"
                        : "border-gray-300 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    } `}
                  />
                  {errors.email_address && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.email_address}
                    </p>
                  )}
                </div>
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
                  {isSubmitting ? "Requesting for OTP" : "Submit"}
                </button>
              </div>
            </form>
            <Footer title="Login" link={"/"} />
          </Card>
        ) : (
          <OtpForm email_address={formData.email_address} />
        )}
      </div>
    </>
  );
};
