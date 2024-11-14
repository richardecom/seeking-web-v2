/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Item from "@/db/models/Item";
import Location from "@/db/models/Location";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal, Op } from "sequelize";

export async function GET(request) {

  try {
    const url = new URL(request.url);
    const query = {
      page: parseInt(url.searchParams.get("page") || "1", 10),
      limit: parseInt(url.searchParams.get("limit") || "5", 10),
    };
    const whereClause: any = {};

    const offset = (query.page - 1) * query.limit;

    User.hasMany(Location, { foreignKey: "user_id" });
    Location.belongsTo(User, { foreignKey: "user_id" });

    const response = await Location.findAll({
      where: whereClause,
      limit: query.limit,
      offset: offset,
      order: [["location_id", "DESC"]],
      attributes: [
        "location_id",
        "building",
        "user_id",
        [literal(`DATE_FORMAT(locations.date_created, '%Y-%m-%d')`), "date_created"],
      ],
      include: [
        {
          model: User,
          required: false,
          attributes: [
            "user_id",
            "name",
            [fn("COALESCE", col("User.image"), ""), "image"],
          ],
        },
      ],
    });
    const total = await Item.count({ where: whereClause });
    const pages = Math.ceil(total / query.limit);

    const before = query.page > 1 ? +query.page - 1 : 1;
    const next = query.page < pages ? +query.page + 1 : pages;

    const result = {
      pagination: { total, pages, before, next },
      list: response,
    };

    return NextResponse.json({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}
