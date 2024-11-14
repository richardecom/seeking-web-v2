import Otp from "@/db/models/Otp";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal } from "sequelize";

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const requiredFields = ['user_id', 'new_email', 'otp'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);

        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }
        const { user_id, new_email, otp } = reqBody;

        const user = await User.findByPk(user_id, {
            attributes: {
                include: [
                    [literal(`CASE WHEN status = 1 THEN 'active' ELSE 'inactive' END`), 'status'],
                    [literal(`CASE 
                        WHEN users.user_role = 1 THEN 'Super Admin' 
                        WHEN users.user_role = 2 THEN 'Admin' 
                        ELSE 'Mobile User' END`), 'user_role'],
                    [literal(`CASE 
                        WHEN users.user_role = 1 THEN 'super_admin' 
                        WHEN users.user_role = 2 THEN 'admin' 
                        ELSE 'mobile_user' END`), 'role_code'],
                    [fn('COALESCE', col('image'), ''), 'image'],
                    [literal(`DATE_FORMAT(users.date_created, '%Y-%m-%d')`), 'date_created'],
                ]
            },
        }) as any;
        if(user){
            const isEmailExist = await User.findOne({where: {email_address: new_email}});
            if(!isEmailExist){
                const verify:any = await Otp.findOne({ where: { email: new_email, otp } });
                    if (verify) {
                        if (new Date() <= verify.date_created) {
                            user.email_address = new_email;
                            user.save();
                            return NextResponse.json({ 
                                status: 201, 
                                message: "Your email has been changed." ,
                                data: user 
                            });
                            
                        } else {
                            return NextResponse.json({ status: 400, message: "Your OTP has expired. Please request a new one." });
                        }
                    }else{
                        return NextResponse.json({ status: 400, message: "Invalid OTP. Please check the code and try again." });
                    }
            }else{
                return NextResponse.json({ status: 400, message: "It seems provided email has been already use." });
            }
        }else{
                return NextResponse.json({ status: 404, message: "User not found." });
        }
    } catch (error) {
        return NextResponse.json({ status: 500, message: "Internal Server Error: " + error.message });
    }
}