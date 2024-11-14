/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/User";
import { col, fn, literal, Op } from "sequelize";
import { GetTokenData } from "@/app/helper/tokenHelper";
import bcrypt from "bcrypt";
import Otp from "@/db/models/Otp";
import Location from "@/db/models/Location";
import Item from "@/db/models/Item";
import Category from "@/db/models/Category";

export async function GET(req: NextRequest, context: any) {
  
  const user_id = parseInt(context.params.id);
  try {
    User.hasMany(Location, { foreignKey: "user_id" });
    Location.belongsTo(User, { foreignKey: "user_id" });

    Location.hasMany(Item, { foreignKey: "location_id" });
    Item.belongsTo(Location, { foreignKey: "location_id" });
    const response = await User.findByPk(user_id, {
      attributes: {
        exclude: ["password"],
        include: [
          [
            literal(`CASE WHEN status = 1 THEN 'active' ELSE 'inactive' END`),
            "status",
          ],
          [
            literal(`CASE 
                WHEN users.user_role = 1 THEN 'Super Admin' 
                WHEN users.user_role = 2 THEN 'Admin' 
                ELSE 'Mobile User' END`),
            "user_role",
          ],
          [
            literal(`CASE 
                WHEN users.user_role = 1 THEN 'super_admin' 
                WHEN users.user_role = 2 THEN 'admin' 
                ELSE 'mobile_user' END`),
            "role_code",
          ],
          [fn("COALESCE", col("image"), ""), "image"],
          [
            literal(`DATE_FORMAT(users.date_created, '%Y-%m-%d')`),
            "date_created",
          ],
        ],
      },
    }) as any;
    const total_locations = await Location.count({ where: { user_id } });
    const total_items = await Item.count({ where: { user_id } });
    const total_categories = await Category.count({ where: { user_id } });
    
    console.log("total_locations", total_locations)
    console.log("total_items", total_items)
    console.log("total_categories", total_categories)
    return NextResponse.json({
      status: 200,
      message: "success",
      data: {...response.dataValues, total_locations, total_items, total_categories},
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: "Error Getting Mobile Users Data: " + error,
    });
  }
}
