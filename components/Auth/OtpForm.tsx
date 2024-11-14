/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { VerifyOTP } from "@/hooks/Auth";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import Title from "@/components/Auth/Title";
import Description from "@/components/Auth/Description";
import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm";
import { Card } from "@/components/ui/card";
import TitleDescWrap from "@/components/Auth/TitleDescWrap";
import Footer from "@/components/Auth/Footer";

export const OtpForm = ({ email_address }) => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }

      setOtp(newOtp);
      setError("");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move focus to the previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const verifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    try {
      const result = await VerifyOTP({ email_address, code, type: 3 });
      if (result.success) {
        setIsVerified(true);
        toast({
          className: "success_message",
          description: result.message,
        });
      } else {
        setIsVerified(false);
        toast({
          className: "error_message",
          description: result.message,
        });
      }
    } catch (error) {
      console.log("ERROR: createUser function: ", error);
      setIsVerified(false);
      toast({
        className: "error_message",
        description: "Error creating user data",
      });
    }
  };

  return (
    <>
      <div>
        {isVerified ? (
          <ResetPasswordForm email_address={email_address}/>
        ) : (
          <Card className="w-full sm:max-w-lg border px-10 pb-7">
            <TitleDescWrap>
              <Title title="Request Password Reset" />
              <Description
                className="text-black"
                description="Enter your registered email. OTP will be sent after submission"
              />
            </TitleDescWrap>
            <form
              onSubmit={verifyOTP}
              className="space-y-6 flex flex-col items-center"
            >
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Enter OTP Code
                </label>
                <div className="mt-2 flex space-x-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`h-12 w-12 rounded-md border text-center text-lg shadow-sm transition duration-200 placeholder:text-gray-400 ${
                        error
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-indigo-600"
                      }`}
                      maxLength={1}
                      placeholder="0"
                    />
                  ))}
                </div>
                {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#b00202] hover:bg-[#800000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-300"
                >
                  Verify OTP
                </button>
              </div>
            </form>
            <Footer title="Login" link={"/"} />
          </Card>
        )}
      </div>
    </>
  );
};
