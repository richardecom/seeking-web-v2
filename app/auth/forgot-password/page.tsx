/* eslint-disable @typescript-eslint/no-unused-vars */
"use_client";
import React from "react";
import Title from "@/components/Auth/Title";
import Description from "@/components/Auth/Description";
import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm";
// import LoginLayout from "@/components/Auth/LoginLayout";
import { Card } from "@/components/ui/card";
import TitleDescWrap from "@/components/Auth/TitleDescWrap";
import Footer from "@/components/Auth/Footer";
import LoginLayout from "@/components/Auth/LoginLayout";


const ForgotPasswordPage = () => {

  return (
      <LoginLayout>
        <ForgotPasswordForm />
      </LoginLayout>
  );
};

export default ForgotPasswordPage;
