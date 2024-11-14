/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Item from "@/db/models/Item";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal, Op } from "sequelize";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

const addHours = (date, hours) =>
    new Date(date.getTime() + hours * 60 * 60 * 1000);
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const query = {
      page: parseInt(url.searchParams.get("page") || "1", 10),
      limit: parseInt(url.searchParams.get("limit") || "5", 10),
    };
    const whereClause: any = {};

    const currentDate = new Date();
    const timeOffset = 8; // Offset in hours for Asia/Manila time zone
    const currentMonthStart = addHours(startOfMonth(currentDate), timeOffset);
    const currentMonthEnd = addHours(endOfMonth(currentDate), timeOffset);
    const lastMonthStart = addHours(startOfMonth(subMonths(currentDate, 1)), timeOffset);
    const lastMonthEnd = addHours(endOfMonth(lastMonthStart), timeOffset);

    console.log("currentDate", currentDate);
    console.log("timeOffset", timeOffset);
    console.log("currentMonthStart", currentMonthStart);
    console.log("currentMonthEnd", currentMonthEnd);
    console.log("lastMonthStart", lastMonthStart);
    console.log("lastMonthEnd", lastMonthEnd);

    const offset = (query.page - 1) * query.limit;

    User.hasMany(Item, { foreignKey: "user_id" });
    Item.belongsTo(User, { foreignKey: "user_id" });

    const response = await Item.findAll({
      where: whereClause,
      limit: query.limit,
      offset: offset,
      order: [["item_id", "DESC"]],
      attributes: [
        "item_id",
        "item_name",
        [literal(`DATE_FORMAT(items.date_created, '%Y-%m-%d')`), "date_created"],
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
