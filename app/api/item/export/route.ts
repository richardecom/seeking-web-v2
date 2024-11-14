/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Item from "@/db/models/Item";
import Location from "@/db/models/Location";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal, Op } from "sequelize";

export async function GET(request:NextRequest) {
        try {
            const url = new URL(request.url);
            const query = {
                page: parseInt(url.searchParams.get("page") || "1", 10),
                limit: parseInt(url.searchParams.get("limit") || "10", 10),
                searchKey: (url.searchParams.get("searchKey") || '').trim(),
                status: url.searchParams.get("status") || '',
                excludeIds: url.searchParams.get("excludeIds") || ''
            };
            const whereClause:any = {};
            if (query.searchKey) {
                whereClause[Op.or] = [
                    { item_name: { [Op.like]: `%${query.searchKey}%` } },
                    { description: { [Op.like]: `%${query.searchKey}%` } },
                    { quantity: { [Op.like]: `%${query.searchKey}%` } },
                    { rating: { [Op.like]: `%${query.searchKey}%` } },
                ];
            }
            if(query.status){
                whereClause.status = parseInt(query.status)
            }
            if (query.excludeIds) {
                const excludeIdsArray = query.excludeIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
                if (excludeIdsArray.length > 0) {
                    whereClause.item_id = { [Op.notIn]: excludeIdsArray };
                }
            }

            console.log("whereClause", whereClause)
            const offset = (query.page - 1) * query.limit;

            User.hasMany(Item, { foreignKey: 'user_id'});
            Item.belongsTo(User, { foreignKey: 'user_id'});

            Location.hasMany(Item, { foreignKey: 'location_id'});
            Item.belongsTo(Location, { foreignKey: 'location_id'});

            const response = await Item.findAll({
                where: whereClause,
                limit: query.limit,
                offset: offset,
                order: [['item_name', 'ASC']],
                attributes: {
                    exclude: ['image'],
                    include: [
                        [literal(`CASE 
                                    WHEN items.status = 1 THEN 'Active'
                                    WHEN items.status = 0 THEN 'Archived'
                                    ELSE 'Unknown'
                                END`),'status'
                        ],
                        [literal(`CASE 
                                    WHEN items.perishable = 1 THEN 'Yes'
                                    WHEN items.perishable = 0 THEN 'No'
                                    ELSE 'Unknown'
                                END`),'perishable'
                        ],
                        [literal(`CASE 
                                    WHEN items.always_stock = 1 THEN 'Yes'
                                    WHEN items.always_stock = 0 THEN 'No'
                                    ELSE 'Unknown'
                                END`),'always_stock'
                        ],
                        [literal(`CASE 
                                    WHEN items.uncountable = 1 THEN 'Yes'
                                    WHEN items.uncountable = 0 THEN 'No'
                                    ELSE 'Unknown'
                                END`),'uncountable'
                        ],
                        [literal(`CASE 
                                    WHEN items.favorite = 1 THEN 'Yes'
                                    WHEN items.favorite = 0 THEN 'No'
                                    ELSE 'Unknown'
                                END`),'favorite'
                        ],
                        [literal(`CASE 
                                    WHEN items.is_selling = 1 THEN 'Yes'
                                    WHEN items.is_selling = 0 THEN 'No'
                                    ELSE 'Unknown'
                                END`),'is_selling'
                        ],
                        [literal(`COALESCE(items.image_url, '')`), 'image_url'],
                        [literal(`COALESCE(items.expiry_date, '')`), 'expiry_date'],
                        [literal(`DATE_FORMAT(items.date_created, '%Y-%m-%d')`), 'date_created'],
                        [literal(`COALESCE(User.name, '')`), 'user_name'],
                        [literal(`CASE 
                                WHEN User.user_type = 1 THEN 'Premium'
                                WHEN User.user_type = 0 THEN 'Free'
                                ELSE 'Unknown'
                            END`),'user_type'
                        ],
                        [literal(`COALESCE(Location.building, '')`), 'building'],
                    ],
                },
                include: [
                    { 
                        model: User ,
                        attributes: [],
                        required: false
                    },
                    { 
                        model: Location ,
                        attributes: [],
                        required: false
                    },
                ],
                
            })
            const total = await Item.count({ where: whereClause });
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