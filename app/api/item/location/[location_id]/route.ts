import User from "@/db/models/User";
import Item from "@/db/models/Item";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal, Op } from "sequelize";
import Location from "@/db/models/Location";
import ItemImages from "@/db/models/ItemImages";

export async function GET(request:NextRequest, context: any) {
        try {
            const location_id = parseInt(context.params.location_id);
            
            const url = new URL(request.url);
            const query = {
                page: parseInt(url.searchParams.get("page") || "1", 10),
                limit: parseInt(url.searchParams.get("limit") || "10", 10),
                searchKey: (url.searchParams.get("searchKey") || '').trim(),
                status: url.searchParams.get("status") || '',
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
            whereClause.location_id = location_id;

            console.log("whereClause", whereClause)
            console.log("whereClause location_id", location_id)
            const offset = (query.page - 1) * query.limit;

            User.hasMany(Item, { foreignKey: 'user_id'});
            Item.belongsTo(User, { foreignKey: 'user_id'});

            Location.hasMany(Item, { foreignKey: 'location_id'});
            Item.belongsTo(Location, { foreignKey: 'location_id'});

            Item.hasMany(ItemImages, { sourceKey:'item_uid', foreignKey: 'item_uid' });
            ItemImages.belongsTo(Item, { foreignKey: 'item_uid',});


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
                        
                        [fn('COALESCE', col('image_url'), ''), 'image_url'],
                        [literal(`DATE_FORMAT(items.date_created, '%Y-%m-%d')`), 'date_created'],
                        [literal(`DATE_FORMAT(items.expiry_date, '%Y-%m-%d')`), 'expiry_date'],
                    ],
                },
                include: [
                    { 
                        model: User ,
                        required: false,
                        attributes: {
                            exclude: ['password'],
                            include: [
                                [literal(`CASE WHEN User.status = 1 THEN 'Active' ELSE 'Inactive' END`), 'status'],
                                [literal(`CASE WHEN User.user_type = 1 THEN 'Premium' ELSE 'Free' END`), 'user_type'],
                                [literal(`CASE WHEN User.user_role = 1 THEN 'Administrator' ELSE 'Mobile User' END`), 'user_role'],
                                [fn('COALESCE', col('User.image'), ''), 'image'],
                                [literal(`DATE_FORMAT(User.date_created, '%Y-%m-%d')`), 'date_created'],
                            ]
                        }, 
                    },
                    { 
                        model: Location,
                        required: false,
                        attributes: {
                            exclude: ['location_image', 'location_uid'],
                            include: [
                                [literal(`CASE WHEN Location.status = 1 THEN 'Active' ELSE 'Archived' END`), 'status'],
                                [fn('COALESCE', col('Location.location_image_url'), ''), 'location_image_url'],
                                [literal(`DATE_FORMAT(Location.date_created, '%Y-%m-%d')`), 'date_created'],
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

            console.log("SSAKD: ", list)

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