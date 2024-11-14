/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/User";
import {  col, fn, literal, Op } from "sequelize";
import { GetTokenData } from "@/app/helper/tokenHelper";
import bcrypt from 'bcrypt';
import Otp from "@/db/models/Otp";

export async function GET(req: NextRequest){

    try {

        const tokenData = await GetTokenData(req);
        const url = new URL(req.url);
        const query = {
            page: parseInt(url.searchParams.get("page") || "1", 10),
            limit: parseInt(url.searchParams.get("limit") || "10", 10),
            searchKey: (url.searchParams.get("searchKey") || '').trim(),
            status: url.searchParams.get("status") || '',
            userRole: url.searchParams.get("userRole") || '',
            userType: url.searchParams.get("userType") || '',
        };
        const whereClause:any = {};
        if (query.searchKey) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${query.searchKey}%` } },
            ];
        }

        if(query.status){
            whereClause.status = parseInt(query.status)
        }
        if(query.userRole){
            whereClause.user_role = parseInt(query.userRole)
        }
        if(query.userType){
            whereClause.user_type = parseInt(query.userType)
        }
        
        const excludeIdsArray = [];
        if (tokenData) {
            excludeIdsArray.push(tokenData.userID);
            if (excludeIdsArray.length > 0) {
                whereClause.user_id = { [Op.notIn]: excludeIdsArray };
            }
        }

        const offset = (query.page - 1) * query.limit;
        const response = await User.findAll({
            where: whereClause,
            limit: query.limit,
            order: [['user_id', 'DESC']],
            offset: offset,
            attributes: { 
                exclude: ['password'],
                include: [
                    [literal(`CASE WHEN users.status = 1 THEN 'Active' ELSE 'Inactive' END`), 'status'],
                    [literal(`CASE WHEN users.user_type = 1 THEN 'Premium' ELSE 'Free' END`), 'user_type'],
                    [literal(`CASE 
                        WHEN users.user_role = 1 THEN 'Super Admin' 
                        WHEN users.user_role = 2 THEN 'Admin' 
                        ELSE 'Mobile User' END`), 'user_role'],
                    [literal(`CASE 
                        WHEN users.user_role = 1 THEN 'super_admin' 
                        WHEN users.user_role = 2 THEN 'admin' 
                        ELSE 'mobile_user' END`), 'role_code'],
                    [fn('COALESCE', col('users.image'), ''), 'image'],
                    [literal(`DATE_FORMAT(users.date_created, '%Y-%m-%d')`), 'date_created'],
                ]
            },
        })
        const total = await User.count({ where: whereClause });
        const pages = Math.ceil(total / query.limit);

        const before = query.page > 1 ? +query.page - 1 : 1;
        const next   = query.page < pages ? +query.page + 1 : pages;

        const list = response.map((user, index) => ({
            number: (query.page - 1) * query.limit + index + 1,
            selected: true,
            ...user.dataValues,
        }));
        const result = {
            pagination: {total, pages, before, next},
            list
        };
        return NextResponse.json({
            status: 200,
            message: "success",
            data:result
        })
    } catch (error) {
        return NextResponse.json({
            status: 400,
            message: "Error Getting Mobile Users Data: "+error
        })
    }   
}

export async function POST(request: NextRequest) {

    const getToken = GetTokenData(request)
    if (!getToken) {
        return NextResponse.json({
            status: 401,
            message: "Error Getting Token Data: "
        })
    }
    try {
        const reqBody = await request.json();
        const requiredFields = ['email_address', 'name', 'address', 'dob', 'password', 'otp'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);

        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }
        const {email_address, name, address, dob, otp} = reqBody;
        const verify:any = await Otp.findOne({where: { email: email_address, otp}});
        if(verify){
            const timeNow = new Date();
            if(!(timeNow > verify.date_created)){
                const salt = await bcrypt.genSalt(10);
                const hashed_password = await bcrypt.hash(reqBody.password, salt);
                const payload = {
                    email_address, 
                    name, 
                    address, 
                    dob, 
                    password : hashed_password,
                    user_type : 1,
                    user_role : 2
                }
                const newUser = await User.create(payload);
                return NextResponse.json({
                    status: 201,
                    message: "New user has been created!",
                    data: newUser,
                });
            }else{
                return NextResponse.json({
                    status: 400,
                    message: "Your OTP has expired. Please request a new one.",
                });
            }
        }else{
            return NextResponse.json({
                status: 400,
                message: "Invalid OTP. Please check the code and try again.",
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}

export async function PATCH(request: NextRequest) {
    const tokenData = GetTokenData(request);
    if (!tokenData) {
        return NextResponse.json({ status: 401, message: "Error Getting Token Data." });
    }
    try {
        const reqBody = await request.json();
        const requiredFields = ['user_id', 'email_address', 'name', 'address', 'dob'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);

        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }

        const { user_id, new_email, name, address, dob, otp, password } = reqBody;
        const payload: any = { name, address, dob };

        if (new_email?.trim()) {
            payload.email_address = new_email;
        }
        
        if (password?.trim()) {
            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
            payload.password = hashedPassword;
        }

        console.log('UPDATE PAYLOAD: ', payload);

        if (payload.email_address && otp) {
            const verify:any = await Otp.findOne({ where: { email: payload.email_address, otp } });

            if (verify) {
                if (new Date() <= verify.date_created) {
                    await User.update(payload, { where: { user_id } });
                    return NextResponse.json({ status: 201, message: "User has been updated successfully!" });
                } else {
                    return NextResponse.json({ status: 400, message: "Your OTP has expired. Please request a new one." });
                }
            }else{
                return NextResponse.json({ status: 400, message: "Invalid OTP. Please check the code and try again." });
            }
        }

        await User.update(payload, { where: { user_id } });
        return NextResponse.json({ status: 201, message: "User has been updated successfully!" });
        
    } catch (error) {
        return NextResponse.json({ status: 500, message: "Internal Server Error: " + error.message });
    }
}
