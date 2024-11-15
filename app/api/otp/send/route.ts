/* eslint-disable @typescript-eslint/no-unused-vars */
import { GenerateOtp } from "@/utils/GenerateOtp";
import { NextRequest, NextResponse } from "next/server";
import Otp from "@/db/models/Otp";
import {
  sendChangeEmail,
  sendRegistrationEmail,
} from "@/utils/SendGridService";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const requiredFields = ["email", "type"];
    const missingFields = requiredFields.filter((field) => !reqBody[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}.`,
      });
    }
    const otp = GenerateOtp();
    const emailType = [
      { key: 1, value: "Registration" },
      { key: 2, value: "Change Email" },
      { key: 3, value: "Forgot Password" },
    ];

    const { email, type: type } = reqBody;
    const msg_type = emailType.find((item) => item.key === parseInt(type, 10));
    if (otp) {
      const expiredTime = new Date(new Date().getTime() + 1 * 60 * 1000);
      // const expiredTime = new Date(dateCreated.getTime() + 30 * 60 * 1000); //30 mins
      const payload = {
        email,
        type,
        otp,
        date_created: expiredTime,
      };
      const response = await Otp.findOne({ where: { email, type } });
      if (response) {
        /**update when existing data found */
        await Otp.update(payload, { where: { email } });
        if (type === 1) {
          await sendRegistrationEmail({ email_address: email, otp_code: otp })
            .then(() => {
              console.error("Registration Otp has been sent!");
            })
            .catch((error) => {
              console.error("Failed to send registration email:", error);
            });
        }
        if (type === 2) {
          sendChangeEmail({ email_address: email, otp_code: otp })
            .then(() => {
              console.error("Change Email Otp has been sent!");
            })
            .catch((error) => {
              console.error("Failed to send change email:", error);
            });
        }
      } else {
        /**create when no data found */

        await Otp.create(payload);
        if (type === 1) {
          sendRegistrationEmail({ email_address: email, otp_code: otp })
            .then(() => {
              console.error("Registration Otp has been sent!");
            })
            .catch((error) => {
              console.error("Failed to send registration email:", error);
            });
        }
        if (type === 2) {
          sendChangeEmail({ email_address: email, otp_code: otp })
            .then(() => {
              console.error("Change Email Otp has been sent!");
            })
            .catch((error) => {
              console.error("Failed to send change email:", error);
            });
        }
      }
      return NextResponse.json({
        status: 201,
        message: ` ${msg_type.value} Otp has been sent!`,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}
