/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetTokenData } from "@/app/helper/tokenHelper";
import User from "@/db/models/User";
import Item from "@/db/models/Item";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal, Op } from "sequelize";
import Location from "@/db/models/Location";

export async function GET(request:NextRequest) {
        try {

            const url = new URL(request.url);
            console.log("query:ASDASD ", url)
            const query = {
                page: parseInt(url.searchParams.get("page") || "1", 10),
                limit: parseInt(url.searchParams.get("limit") || "10", 10),
                searchKey: (url.searchParams.get("searchKey") || '').trim(),
                user_id: parseInt(url.searchParams.get("user_id")) || '',
            };
            console.log("query: ", query)
            const whereClause:any = {};
            if (query.searchKey) {
                whereClause[Op.or] = [
                    { building: { [Op.like]: `%${query.searchKey}%` } },
                    { room: { [Op.like]: `%${query.searchKey}%` } },
                ];
            }
            if(query.user_id){
                whereClause.user_id = query.user_id;
            }

            whereClause.status = 1;

            const offset = (query.page - 1) * query.limit;
            // const response = await Location.findAll({
            //     where: whereClause,
            //     limit: query.limit,
            //     offset: offset,
            // })
            User.hasMany(Location, { foreignKey: "user_id" });
            Location.belongsTo(User, { foreignKey: "user_id" });
            const response = await Location.findAll({
                where: whereClause,
                limit: query.limit,
                offset: offset,
                order: [["location_id", "DESC"]],
                include: [
                  {
                    model: User,
                    as: 'user',
                    attributes: {
                      exclude: ["password"],
                      include: [
                        [
                          literal(
                            `CASE WHEN user.status = 1 THEN 'Active' ELSE 'Inactive' END`
                          ),
                          "status",
                        ],
                        [
                          literal(
                            `CASE WHEN user.user_type = 1 THEN 'Premium' ELSE 'Free' END`
                          ),
                          "user_type",
                        ],
                        [
                          literal(
                            `CASE WHEN user.user_role = 1 THEN 'Administrator' ELSE 'Mobile User' END`
                          ),
                          "user_role",
                        ],
                        [fn("COALESCE", col("user.image"), ""), "image"],
                        [
                          literal(`DATE_FORMAT(user.date_created, '%Y-%m-%d')`),
                          "date_created",
                        ],
                      ],
                    },
                    required: false,
                  },
                ],
                attributes: {
                  include: [
                    [fn("COALESCE", col("location_image_url"), ""), "location_image_url"],
                    [fn("COALESCE", col("location_image"), ""), "location_image"],
                    [fn("COALESCE", col("location_uid"), ""), "location_uid"],
                    [
                      literal(
                        `CASE WHEN locations.status = 1 THEN 'Active' ELSE 'Archived' END`
                      ),
                      "status",
                    ],
                    [
                      literal(`DATE_FORMAT(locations.date_created, '%Y-%m-%d')`),
                      "date_created",
                    ],
                  ],
                },
              });

            const total = await Location.count({ where: whereClause });
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
                status: 500,
                message: "Internal Server Error: " + error.message,
            });
        }
        
}