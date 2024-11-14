/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/User";
import {  col, fn, literal, Op } from "sequelize";
import { GetTokenData } from "@/app/helper/tokenHelper";

export async function GET(req: NextRequest){
    
    const getToken = GetTokenData(req)
        if (!getToken) {
            return NextResponse.json({
                status: 401,
                message: "Error Getting Token Data: "
            })
        }

        console.log("getToken", getToken)

    try {
        const url = new URL(req.url);
        const query = {
            page: parseInt(url.searchParams.get("page") || "1", 10),
            limit: parseInt(url.searchParams.get("limit") || "10", 10),
            searchKey: (url.searchParams.get("searchKey") || '').trim(),
            status: url.searchParams.get("status") || '',
            userRole: url.searchParams.get("userRole") || '',
            userType: url.searchParams.get("userType") || '',
            excludeIds: url.searchParams.get("excludeIds") || '',
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

        let excludeIdsArray = [];
        if (query.excludeIds) {
            excludeIdsArray = query.excludeIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
            if (excludeIdsArray.length > 0) {
                whereClause.user_id = { [Op.notIn]: excludeIdsArray };
            }
        }
        if (getToken) {
            excludeIdsArray.push(getToken);
            if (excludeIdsArray.length > 0) {
                whereClause.user_id = { [Op.notIn]: excludeIdsArray };
            }
        }

        console.log("query: ", query)
        const offset = (query.page - 1) * query.limit;
        const response = await User.findAll({
            where: whereClause,
            limit: query.limit,
            offset: offset,
            attributes: { 
                exclude: ['password'],
                include: [
                    [literal(`CASE WHEN users.status = 1 THEN 'Active' ELSE 'Inactive' END`), 'status'],
                    [literal(`CASE WHEN users.user_type = 1 THEN 'Premium' ELSE 'Free' END`), 'user_type'],
                    [literal(`CASE WHEN users.user_role = 1 THEN 'Administrator' ELSE 'Mobile User' END`), 'user_role'],
                    [fn('COALESCE', col('users.image'), ''), 'image'],
                    [literal(`DATE_FORMAT(users.date_created, '%Y-%m-%d')`), 'date_created'],
                ]
            },
        })
        const total = await User.count({ where: whereClause });
        const pages = Math.ceil(total / query.limit);

        const before = query.page > 1 ? +query.page - 1 : 1;
        const next   = query.page < pages ? +query.page + 1 : pages;

        const result = {
            pagination: {total, pages, before, next},
            list: response
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
