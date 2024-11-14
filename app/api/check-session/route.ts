import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import User from "@/db/models/User";
import { col, fn, literal } from "sequelize";

export async function GET(request: NextRequest){

    try {
        console.log('Executing Token Checker on Server Side')
        const token = request.cookies.get("jwt")?.value || null;
        const session = token ? await decrypt(token) : null as any;
       if(session){
            const user = await User.findByPk(session.userID, {
                attributes: {
                    exclude: ['password'],
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
            })
            return NextResponse.json({
                status: 200,
                message: 'success',
                data: user,
            });
       }else{
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized',
            });
       }
    } catch (error) {
        return NextResponse.json({
            status: 401,
            message: 'Unauthorized',
        });
    }
}