/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import User from "@/db/models/User";
import Item from "@/db/models/Item";
import ItemImages from "@/db/models/ItemImages";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal, Op } from "sequelize";
import Location from "@/db/models/Location";
import { GenerateUID } from "@/utils/GenerateUID";

export async function GET(request:NextRequest) {
   
        try {
            const url = new URL(request.url);
            const query = {
                page: parseInt(url.searchParams.get("page") || "1", 10),
                limit: parseInt(url.searchParams.get("limit") || "10", 10),
                searchKey: (url.searchParams.get("searchKey") || '').trim(),
                status: url.searchParams.get("status") || '',
            };
            const whereClause:any = {};
            let userIds = [];
            if (query.searchKey) {
                whereClause[Op.or] = [
                    { item_name: { [Op.like]: `%${query.searchKey}%` } },
                    { description: { [Op.like]: `%${query.searchKey}%` } },
                    { quantity: { [Op.like]: `%${query.searchKey}%` } },
                    { rating: { [Op.like]: `%${query.searchKey}%` } },
                ];

                const user = await User.findAll({
                    where: {
                        [Op.or] : [
                            { name: { [Op.like]: `%${query.searchKey}%` } },
                        ]
                    },
                    limit: 100,
                })
                if(user.length > 0){
                    userIds = user.map((u:any) => u.user_id);
                }
            }
            if (userIds.length > 0) {
                whereClause[Op.or] = [
                    ...(whereClause[Op.or] || []),
                    { user_id: { [Op.in]: userIds } }
                ];
            }

            if(query.status){
                whereClause.status = parseInt(query.status)
            }

            const offset = (query.page - 1) * query.limit;
            Item.hasMany(ItemImages, { sourceKey:'item_uid', foreignKey: 'item_uid' });
            ItemImages.belongsTo(Item, { foreignKey: 'item_uid',});

            
            User.hasMany(Item, { foreignKey: 'user_id'});
            Item.belongsTo(User, { foreignKey: 'user_id'});

            Location.hasMany(Item, { foreignKey: 'location_id'});
            Item.belongsTo(Location, { foreignKey: 'location_id'});
            
            const response = await Item.findAll({
                where: whereClause,
                limit: query.limit,
                offset: offset,
                order: [['item_id', 'DESC']],
                attributes: {
                    exclude: ['image', 'image_url', 'status', 'perishable', 'always_stock', 'uncountable', 'favorite', 'date_created', 'expiry_date'],
                    include: [
                        [literal(`CASE WHEN items.status = 1 THEN 'Active' ELSE 'Archived' END`), 'status'],
                        [literal(`CASE WHEN items.perishable = 1 THEN 'Yes' ELSE 'No' END`), 'perishable'],
                        [literal(`CASE WHEN items.always_stock = 1 THEN 'Yes' ELSE 'No' END`), 'always_stock'],
                        [literal(`CASE WHEN items.uncountable = 1 THEN 'Yes' ELSE 'No' END`), 'uncountable'],
                        [literal(`CASE WHEN items.favorite = 1 THEN 'Yes' ELSE 'No' END`), 'favorite'],
                        [literal(`DATE_FORMAT(items.date_created, '%Y-%m-%d')`), 'date_created'],
                        [literal(`DATE_FORMAT(items.expiry_date, '%Y-%m-%d')`), 'expiry_date'],
                    ],
                },
                include: [
                    { 
                        model: User ,
                        as:'user',
                        required: false,
                        attributes: {
                            exclude: ['password'],
                            include: [
                                [literal(`CASE WHEN user.status = 1 THEN 'Active' ELSE 'Inactive' END`), 'status'],
                                [literal(`CASE WHEN user.user_type = 1 THEN 'Premium' ELSE 'Free' END`), 'user_type'],
                                [literal(`CASE WHEN user.user_role = 1 THEN 'Administrator' ELSE 'Mobile User' END`), 'user_role'],
                                [fn('COALESCE', col('user.image'), ''), 'image'],
                                [literal(`DATE_FORMAT(user.date_created, '%Y-%m-%d')`), 'date_created'],
                            ]
                        }, 
                    },
                    { 
                        model: Location,
                        as:'location',
                        required: false,
                        attributes: {
                            exclude: ['location_image', 'location_uid'],
                            include: [
                                [literal(`CASE WHEN location.status = 1 THEN 'Active' ELSE 'Archived' END`), 'status'],
                                [fn('COALESCE', col('location.location_image_url'), ''), 'location_image_url'],
                                [literal(`DATE_FORMAT(location.date_created, '%Y-%m-%d')`), 'date_created'],
                            ]
                        },
                    },
                    { 
                        model: ItemImages ,
                        required: false,
                    },
                ],
                
            })
            const total = await Item.count({ where: whereClause });
            const pages = Math.ceil(total / query.limit);

            const before = query.page > 1 ? +query.page - 1 : 1;
            const next   = query.page < pages ? +query.page + 1 : pages;

            const list = response.map((item, index) => ({
                number: (query.page - 1) * query.limit + index + 1,
                selected: true,
                ...item.dataValues,
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
                status: 500,
                message: "Internal Server Error: " + error.message,
            });
        }
}

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const requiredFields = ['item_name', 'description', 'quantity', 'rating', 'location_id', 'category_id', 'user_id'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);

        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }
        const item_uid = await GenerateUID();
        const payload = {
            item_uid,
            item_name: reqBody.item_name, 
            description: reqBody.description, 
            quantity: reqBody.quantity, 
            rating: reqBody.rating, 
            perishable : reqBody.perishable ? 1:0, 
            always_stock : reqBody.always_stock ? 1:0,  
            uncountable : reqBody.uncountable ? 1:0, 
            favorite : reqBody.favorite ? 1:0, 
            expiry_date: reqBody.expiry_date, 
            user_id: reqBody.user_id, 
            location_id: reqBody.location_id, 
            category_id: reqBody.category_id
        }
        const newItem = await Item.create(payload);
        return NextResponse.json({
            status: 201,
            message: "New item has been added successfully.",
            data: newItem,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}

export async function PATCH(request: NextRequest) {

    try {
        const reqBody = await request.json();
        const item_id = reqBody.item_id;

        const requiredFields = ['item_id', 'item_name', 'description', 'quantity', 'rating', 'location_id', 'category_id', 'user_id'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);

        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
            });
        }
        const payload = {
            item_name: reqBody.item_name, 
            description: reqBody.description, 
            quantity: reqBody.quantity, 
            rating: reqBody.rating, 
            perishable : reqBody.perishable ? 1:0, 
            always_stock : reqBody.always_stock ? 1:0,  
            uncountable : reqBody.uncountable ? 1:0, 
            favorite : reqBody.favorite ? 1:0, 
            expiry_date: reqBody.expiry_date, 
            user_id: reqBody.user_id, 
            location_id: reqBody.location_id, 
            category_id: reqBody.category_id
        }
        await Item.update(payload , {where : {item_id}});
        const updatedItem = await Item.findByPk(item_id)
        return NextResponse.json({
            status: 201,
            message: "Item has been added successfully.",
            data: updatedItem,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}