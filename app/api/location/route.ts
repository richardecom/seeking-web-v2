/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import Location from "@/db/models/Location";
import User from "@/db/models/User";
import { Op, fn, col, literal } from "sequelize";
import { GenerateUID } from "@/utils/GenerateUID";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = {
      page: parseInt(url.searchParams.get("page") || "1", 10),
      limit: parseInt(url.searchParams.get("limit") || "10", 10),
      searchKey: (url.searchParams.get("searchKey") || "").trim(),
      status: url.searchParams.get("status") || "",
    };

    let userIds = [];
    const offset = (query.page - 1) * query.limit;

    const whereClause: any = {};
    if (query.searchKey) {
      whereClause[Op.or] = [
        { building: { [Op.like]: `%${query.searchKey}%` } },
        { room: { [Op.like]: `%${query.searchKey}%` } },
        { storage_location: { [Op.like]: `%${query.searchKey}%` } },
        { location_description: { [Op.like]: `%${query.searchKey}%` } },
      ];

      const user = await User.findAll({
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${query.searchKey}%` } }],
        },
        limit: 100,
      });
      if (user.length > 0) {
        userIds = user.map((u: any) => u.user_id);
      }
    }

    if (userIds.length > 0) {
      whereClause[Op.or] = [
        ...(whereClause[Op.or] || []),
        { user_id: { [Op.in]: userIds } },
      ];
    }

    if (query.status) {
      whereClause.status = parseInt(query.status);
    }

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

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { user_id, building, room, storage_location, location_description } =
      reqBody;
    if (
      !user_id ||
      !building ||
      !room ||
      !storage_location ||
      !location_description
    ) {
      return NextResponse.json({
        status: 400,
        message: "All fields are required.",
      });
    }

    const location_uid = await GenerateUID();
    const newLocation = await Location.create({
      location_uid,
      user_id,
      building,
      room,
      storage_location,
      location_description,
    });
    return NextResponse.json({
      status: 201,
      message: "New location has been added successfully.",
      data: newLocation,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const reqBody = await req.json();
    console.log(reqBody);
    const {
      user_id,
      building,
      room,
      storage_location,
      location_description,
      location_id,
    } = reqBody;
    if (
      !user_id ||
      !building ||
      !room ||
      !storage_location ||
      !location_description
    ) {
      return NextResponse.json({
        status: 400,
        message: "All fields are required.",
      });
    }
    const updatedLocation = await Location.update(
      {
        user_id,
        building,
        room,
        storage_location,
        location_description,
      },
      { where: { location_id } }
    );
    return NextResponse.json({
      status: 201,
      message: "Location has been updated successfully.",
      data: updatedLocation,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}
