import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';


export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const requiredFields = ['user_id', 'current_password', 'new_password', 'confirm_password'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);

        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }
        const { user_id, current_password, new_password, confirm_password } = reqBody;
        if(new_password === confirm_password){
            const user = await User.findByPk(user_id) as any
            if(user){
                const passwordCorrect = await bcrypt.compare(current_password, user.password);
                if(passwordCorrect){
                    const salt = await bcrypt.genSalt(10);
                    const password = await bcrypt.hash(reqBody.new_password, salt);
                    const payload: any = { password };
                    await User.update(payload, { where: { user_id } });
                    return NextResponse.json({ status: 201, message: "Your password has been changed." });
                }else{
                    return NextResponse.json({ status: 400, message: "Incorrect current password." });
                }
            }else{
                return NextResponse.json({ status: 404, message: "Opps! User not found." });
            }
        }else{
            return NextResponse.json({ status: 400, message: "Please confirm your new password well." });
        }
    } catch (error) {
        return NextResponse.json({ status: 500, message: "Internal Server Error: " + error.message });
    }
}