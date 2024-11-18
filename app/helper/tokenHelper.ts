import { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";
export const GetTokenData = async (request: NextRequest) => {

    const token = request.cookies.get("jwt")?.value || null;
        let session = null;
        try {
            session = token ? await decrypt(token) : null;
            return session;
        } catch (error) {
            return false;
        }
}