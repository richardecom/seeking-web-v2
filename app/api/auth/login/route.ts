/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server";
import Location from "@/db/models/Location";
import User from "@/db/models/User";
import {  Op, fn, col, literal } from "sequelize";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createToken } from "@/lib/session";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const reqBody = await req.json();
        const { email_address, password } = reqBody;

        const missingFields = [];
        if (!email_address) missingFields.push('email_address');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing parameters: ${missingFields.join(', ')}`,
            });
        }
        const user:any = await User.findOne({
            where: {
                email_address,
                user_role: {
                    [Op.or]: [1, 2]
                }
            },
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
        });

        if(user){
            if(user.status === 'active'){
                const isValid = await bcrypt.compare(password, user.password);
                if(!isValid){
                    return NextResponse.json({
                        status: 400,
                        message: `Incorrect email or password.`,
                    });
                }

                const token = await createToken(user.user_id)

                const cookieOptions = {
                    httpOnly: false,
                    secure: process.env.RUN_ENV === 'production' ? true : false,
                    maxAge: 30 * 24 * 60 * 60,
                    // maxAge: 60,
                    path: '/',
                };
                delete user.dataValues.user_type
                delete user.dataValues.password

                const res = NextResponse.json({
                    status: 201,
                    message: "Login successful.",
                    data: user
                });
                res.cookies.set('jwt', token, cookieOptions);
                return res;
            }else{
                return NextResponse.json({
                    status: 400,
                    message: `Oops! It seems your account was inactive, Please contact administrator for assistance.`,
                });
            }
        }else{
            return NextResponse.json({
                status: 404,
                message: `Oops! We couldn’t find an account with that email address.`,
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}

