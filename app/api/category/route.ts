/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import Category from "@/db/models/Category";
import { col, fn, literal, Op } from "sequelize";
import User from "@/db/models/User";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = {
      page: parseInt(url.searchParams.get("page") || "1", 10),
      limit: parseInt(url.searchParams.get("limit") || "10", 10),
      searchKey: (url.searchParams.get("searchKey") || "").trim(),
      status: url.searchParams.get("status") || "",
    };
    const whereClause: any = {};
    let userIds = [];
    if (query.searchKey) {
      whereClause[Op.or] = [
        { category_name: { [Op.like]: `%${query.searchKey}%` } },
        { category_description: { [Op.like]: `%${query.searchKey}%` } },
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

    const offset = (query.page - 1) * query.limit;

    User.hasMany(Category, { foreignKey: "user_id" });
    Category.belongsTo(User, { foreignKey: "user_id" });

    const response = await Category.findAll({
      where: whereClause,
      limit: query.limit,
      offset: offset,
      order: [["category_id", "DESC"]],
      attributes: {
        exclude: ["image"],
        include: [
          [
            literal(
              `CASE WHEN categories.status = 1 THEN 'Active' ELSE 'Archived' END`
            ),
            "status",
          ],
          [fn("COALESCE", col("category_icon"), ""), "category_icon"],
          [
            literal(`DATE_FORMAT(categories.date_created, '%Y-%m-%d')`),
            "date_created",
          ],
        ],
      },
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
              [fn("COALESCE", col("image"), ""), "image"],
              [
                literal(`DATE_FORMAT(user.date_created, '%Y-%m-%d')`),
                "date_created",
              ],
            ],
          },
          required: false,
        },
      ],
    });

    const total = await Category.count({ where: whereClause });
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
      message: "Successfully get all category data.",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}
export async function POST(req: NextRequest) {
  
  try {
    const reqBody = await req.json();
    const requiredFields = [
      "user_id",
      "category_name",
      "category_description",
      "category_type",
    ];
    const missingFields = requiredFields.filter((field) => !reqBody[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}.`,
      });
    }
    const payload = {
      user_id: reqBody.user_id,
      category_name: reqBody.category_name,
      category_description: reqBody.category_description,
      category_type: reqBody.category_type,
      date_created: Date.now(),
    };
    const newCategory = await Category.create(payload);
    return NextResponse.json({
      status: 201,
      message: "New category has been added successfully.",
      data: newCategory,
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
    const requiredFields = [
      "category_id",
      "user_id",
      "category_name",
      "category_description",
      "category_type",
    ];
    const missingFields = requiredFields.filter((field) => !reqBody[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}.`,
      });
    }
    const category_id = reqBody.category_id;
    const payload = {
      user_id: reqBody.user_id,
      category_name: reqBody.category_name,
      category_description: reqBody.category_description,
      category_type: reqBody.category_type,
      date_created: Date.now(),
    };
    await Category.update(payload, { where: { category_id } });

    const updated = await Category.findByPk(category_id);
    return NextResponse.json({
      status: 201,
      message: "Category has been updated successfully.",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}
