/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import Category from "@/db/models/Category";
import { literal, Op } from "sequelize";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = {
      page: parseInt(url.searchParams.get("page") || "1", 10),
      limit: parseInt(url.searchParams.get("limit") || "10", 10),
      searchKey: (url.searchParams.get("searchKey") || "").trim(),
      status: url.searchParams.get("status") || "",
      excludeIds: url.searchParams.get("excludeIds") || ''
    };
    console.log("query:", query);
    const whereClause: any = {};
    if (query.searchKey) {
      whereClause[Op.or] = [
        { category_name: { [Op.like]: `%${query.searchKey}%` } },
        { category_description: { [Op.like]: `%${query.searchKey}%` } },
      ];
    }
    if (query.excludeIds) {
      const excludeIdsArray = query.excludeIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      if (excludeIdsArray.length > 0) {
          whereClause.category_id = { [Op.notIn]: excludeIdsArray };
      }
  }

    if (query.status) {
      whereClause.status = parseInt(query.status);
    }

    const offset = (query.page - 1) * query.limit;
    const response = await Category.findAll({
      where: whereClause,
      limit: query.limit,
      offset: offset,
      order: [["category_name", "ASC"]],
      attributes: {
        exclude: ["image", "category_icon"],
        include: [
          [literal(`DATE_FORMAT(date_created, '%Y-%m-%d')`), "date_created"],
          [
            literal(`CASE 
                            WHEN status = 1 THEN 'Active'
                            WHEN status = 0 THEN 'Archived'
                            ELSE 'Unknown'
                        END`),
            "status",
          ],
          [
            literal(`CASE 
                            WHEN category_type = 1 THEN 'Food'
                            WHEN category_type = 2 THEN 'Gadgets'
                            WHEN category_type = 3 THEN 'Clothes'
                            WHEN category_type = 4 THEN 'Tools'
                            WHEN category_type = 5 THEN 'Utensils'
                            WHEN category_type = 6 THEN 'Hygiene'
                            ELSE 'Unknown Type'
                        END`),
            "category_type",
          ],
        ],
      },
    });
    const total = await Category.count({ where: whereClause });
    const pages = Math.ceil(total / query.limit);

    const before = query.page > 1 ? +query.page - 1 : 1;
    const next = query.page < pages ? +query.page + 1 : pages;
    const result = {
      pagination: { total, pages, before, next },
      list: response,
    };
    return NextResponse.json({
      status: 200,
      message: "Successfully get data for download.",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}
