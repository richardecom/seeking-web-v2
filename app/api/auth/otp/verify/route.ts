/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import Otp from "@/db/models/Otp";

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json();
        const requiredFields = ['code', 'email_address', 'type'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }
        const { code, email_address, type } = reqBody;
        const verify:any =  await Otp.findOne({ where: { email: email_address, type, otp: code } });
        if (verify) {
            if (new Date() <= verify.date_created) {
                const expirationDate = new Date(2000, 0, 1);
                await Otp.update({date_created: expirationDate}, {where: {otp_id: verify.otp_id}})
                return NextResponse.json({ success: true, status: 201, message: "OTP Verification successfull." });
            } else {
                return NextResponse.json({ success: false, status: 400, message: "Your OTP has expired. Please request a new one." });
            }
        }else{
            return NextResponse.json({ success: false, status: 400, message: "Invalid OTP. Please check the code and try again." });
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}