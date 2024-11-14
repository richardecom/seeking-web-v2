/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { decrypt } from "@/lib/session";
export const GetTokenData = async (request: NextRequest) => {

    const token = request.cookies.get("jwt")?.value || null;
        let session = null;
        try {
            session = token ? await decrypt(token) : null;
            return session;
        } catch (error) {
            return false;
            // console.error("Session decryption failed", error);
        }

    // try {
    //     const token = request.cookies.get("jwt")?.value || null;
    //     let session = null;
    //     try {
    //         session = token ? await decrypt(token) : null;
    //     } catch (error) {
    //         console.error("Session decryption failed", error);
    //     }

    //     const token = request.cookies.get("jwt")?.value || null;
    //     const {auth_data}:any = jwt.verify(token, process.env.NEXT_JWT_SECRET!)
    //     return auth_data
    // } catch (error:any) {
    //     return false;
    // }
}