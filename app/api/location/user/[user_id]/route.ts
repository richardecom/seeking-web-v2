/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Location from "@/db/models/Location";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal, Op } from "sequelize";

export async function GET(req: NextRequest, context: any) {
  try {
    const user_id = parseInt(context.params.user_id);
    const url = new URL(req.url);
    const query = {
      page: parseInt(url.searchParams.get("page") || "1", 10),
      limit: parseInt(url.searchParams.get("limit") || "10", 10),
      searchKey: (url.searchParams.get("searchKey") || "").trim(),
      status: url.searchParams.get("status") || "",
    };
    console.log("query: ", query);
    console.log("query user_id: ", user_id);
    const whereClause: any = {};
    whereClause.user_id = user_id;
    if (query.searchKey) {
      whereClause[Op.or] = [
        { building: { [Op.like]: `%${query.searchKey}%` } },
        { room: { [Op.like]: `%${query.searchKey}%` } },
        { storage_location: { [Op.like]: `%${query.searchKey}%` } },
        { location_description: { [Op.like]: `%${query.searchKey}%` } },
      ];
    }

    if (query.status) {
      whereClause.status = parseInt(query.status);
    }

    const offset = (query.page - 1) * query.limit;

    User.hasMany(Location, { foreignKey: "user_id" });
    Location.belongsTo(User, { foreignKey: "user_id" });

    const response = await Location.findAll({
      where: whereClause,
      limit: query.limit,
      offset: offset,
      order: [["location_id", "DESC"]],
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
    const next = query.page < pages ? +query.page + 1 : pages;
    const list = response.map((item, index) => ({
      number: (query.page - 1) * query.limit + index + 1,
      selected: true,
      ...item.dataValues,
    }));
    const result = {
      pagination: { total, pages, before, next },
      list,
    };
    return NextResponse.json({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: "Error Getting Location Data: " + error,
    });
  }
}
