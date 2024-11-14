import { GetTokenData } from "@/app/helper/tokenHelper";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const requiredFields = ['user_id'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required field: ${missingFields.join(', ')}.`,
            });
        }
        const user_id = reqBody.user_id
        const payload = {
            status: 0,
        }
        await User.update(payload, {where: { user_id }});
        return NextResponse.json({
            status: 201,
            message: "User has been deactivated successfully."
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}