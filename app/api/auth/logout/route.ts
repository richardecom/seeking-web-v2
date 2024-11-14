/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const res = NextResponse.json({
            status: 200,
            message: "Logout successful.",
        });
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.RUN_ENV === 'development',
            path: '/',
            expires: new Date(0), 
        };
        res.cookies.set('jwt', '', cookieOptions);
        return res;
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}