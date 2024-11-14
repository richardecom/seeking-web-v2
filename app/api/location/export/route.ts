/* eslint-disable @typescript-eslint/no-explicit-any */
import Location from "@/db/models/Location";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { col, fn, literal, Op } from "sequelize";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = {
      page: parseInt(url.searchParams.get("page") || "1", 10),
      limit: parseInt(url.searchParams.get("limit") || "10", 10),
      searchKey: (url.searchParams.get("searchKey") || "").trim(),
      status: url.searchParams.get("status") || "",
      excludeIds: url.searchParams.get("excludeIds") || "",
    };
    console.log("query: ", query);
    const whereClause: any = {};
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
    if (query.excludeIds) {
      const excludeIdsArray = query.excludeIds
        .split(",")
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !isNaN(id));
      if (excludeIdsArray.length > 0) {
        whereClause.location_id = { [Op.notIn]: excludeIdsArray };
      }
    }

    console.log("whereClause", whereClause);
    const offset = (query.page - 1) * query.limit;

    User.hasMany(Location, { foreignKey: "user_id" });
    Location.belongsTo(User, { foreignKey: "user_id" });

    const response = await Location.findAll({
      where: whereClause,
      limit: query.limit,
      offset: offset,
      order: [["building", "ASC"]],
      include: [
        {
          model: User,
          attributes: [],
          required: false,
        },
      ],
      attributes: {
        include: [
          [fn("COALESCE", col("location_image_url"), ""), "location_image_url"],
          [fn("COALESCE", col("location_image"), ""), "location_image"],
          [fn("COALESCE", col("location_uid"), ""), "location_uid"],
          [fn("COALESCE", col("User.name"), ""), "user_name"],
          [
            literal(`DATE_FORMAT(locations.date_created, '%Y-%m-%d')`),
            "date_created",
          ],
          [
            literal(`CASE 
                            WHEN locations.status = 1 THEN 'Active'
                            WHEN locations.status = 0 THEN 'Archived'
                            ELSE 'Unknown'
                        END`),
            "status",
          ],
          [
            literal(`CASE 
                            WHEN User.user_type = 1 THEN 'Premium'
                            WHEN User.user_type = 0 THEN 'Free'
                            ELSE 'Unknown'
                        END`),
            "user_type",
          ],
        ],
      },
    });
    const total = await Location.count({ where: whereClause });
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
      status: 400,
      message: "Error Getting Location Data: " + error,
    });
  }
}
