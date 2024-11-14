/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GenerateOtp } from "@/utils/GenerateOtp";
import { NextRequest, NextResponse } from "next/server";
import Otp from "@/db/models/Otp";
import { sendChangeEmail, sendForgotPassword, sendRegistrationEmail } from "@/utils/SendGridService";
import User from "@/db/models/User";

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json();
        const requiredFields = ['email', 'type'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }
        const otp = GenerateOtp();
        const { email, type: type } = reqBody;

        const user:any = await User.findOne({where: { email_address: email }})

            if(user){
                if(user.status === 1){ /**if account active */

                    if(otp){
                        const expiredTime = new Date(new Date().getTime() + 1 * 60 * 1000);
                        const payload = {email,  type,  otp, date_created: expiredTime }
                        const response = await Otp.findOne({ where: { email, type } });
                        if(response){ /**update when existing data found */
                            await Otp.update(payload, {where: { email }});
                        }else{ /**create when no data found */
                            await Otp.create(payload);
                        }
                        
                        sendForgotPassword({ user, otp_code: otp }).then(() => {
                            console.error('Forgot Password Otp has been sent!');
                        }).catch((error) => {
                            console.error('Failed to send registration email:', error);
                        });
    
                        return NextResponse.json({
                            status: 201,
                            message: `One time pin has been sent to your email.`,
                        });
                    }else{
                        return NextResponse.json({
                            status: 400,
                            message: `Error generating OTP, Please try again later.`,
                        });
                    }
                }else{
                    return NextResponse.json({
                        status: 400,
                        message: `Oops! It seems your account was inactive, Please contact administrator for assistance.`,
                    });
                }
            }else{
                return NextResponse.json({
                    status: 400,
                    message: `Oops! We couldn't find an account with that email address.`,
                });
            }
        
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}