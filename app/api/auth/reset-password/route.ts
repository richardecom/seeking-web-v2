import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
export async function PATCH(request: NextRequest) {

    try {
        const reqBody = await request.json();
        const requiredFields = ['email_address', 'password'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required field: ${missingFields.join(', ')}.`,
            });
        }
        const {email_address, password} = reqBody;
        const user = await User.findOne({where: { email_address }});
        if(user){
            const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10));
            const payload = {
                password: hashed
            }
            const update = await User.update(payload, {where: { email_address }});
            if(update[0] === 1){
                return NextResponse.json({
                    status: 201,
                    message: "Password successfully changed!"
                });
            }else{
                return NextResponse.json({
                    status: 400,
                    message: "An error occurred while updating the password."
                });
            }
        }else{
            return NextResponse.json({
                status: 404,
                message: "Oops! It looks like the user you’re trying to modify wasn’t found."
            });
        }
        
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}