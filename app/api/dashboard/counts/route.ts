/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Item from "@/db/models/Item";
import Location from "@/db/models/Location";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

const addHours = (date, hours) =>
  new Date(date.getTime() + hours * 60 * 60 * 1000);

const countRecords = async (model, condition) => {
  return await model.count({
    where: condition,
  });
};
const calculatePercentageChange = (current, previous) => {
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
};

export async function GET(request: NextRequest) {
  
  try {
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

    const [overallLocations, lastTotalLocations, currTotalLocations] =
      await Promise.all([
        countRecords(Location, {
          status: { [Op.or]: [0, 1] },
        }),
        countRecords(Location, {
          status: { [Op.or]: [0, 1] },
          date_created: { [Op.between]: [lastMonthStart, lastMonthEnd] },
        }),
        countRecords(Location, {
          status: { [Op.or]: [0, 1] },
          date_created: { [Op.between]: [currentMonthStart, currentMonthEnd] },
        }),
      ]);

      const [overallItems, lastTotalItems, currTotalItems] =
      await Promise.all([
        countRecords(Item, {
          status: { [Op.or]: [0, 1] },
        }),
        countRecords(Item, {
          status: { [Op.or]: [0, 1] },
          date_created: { [Op.between]: [lastMonthStart, lastMonthEnd] },
        }),
        countRecords(Item, {
          status: { [Op.or]: [0, 1] },
          date_created: { [Op.between]: [currentMonthStart, currentMonthEnd] },
        }),
      ]);

      const [overallFreeUsers, lastTotalFreeUsers, currTotalFreeUsers] =
      await Promise.all([
        countRecords(User, 
            { user_role: 0, user_type: 0, status: 1 }),
        countRecords(User, 
            { user_role: 0, user_type: 0, status: 1, //0 = mobile_user 0 = free_users 1 = active
            date_created: { [Op.between]: [lastMonthStart, lastMonthEnd] },
        }),
        countRecords(User, 
            { user_role: 0, user_type: 0, status: 1, //0 = mobile_user 0 = free_users 1 = active
            date_created: { [Op.between]: [currentMonthStart, currentMonthEnd] },
        }),
      ]);

      const [overallPremiumUsers, lastTotalPremiumUsers, currTotalPremiumUsers] =
      await Promise.all([
        countRecords(User, 
            { user_role: 0,  user_type: 1,status: 1
        }),
        countRecords(User, 
            {user_role: 0, user_type: 1, status: 1, //0 = mobile_user 1 = premium_users 1 = active
            date_created: { [Op.between]: [lastMonthStart, lastMonthEnd] },
        }),
        countRecords(User, {
            user_role: 0, user_type: 1, status: 1, //0 = mobile_user 1 = premium_users 1 = active
            date_created: { [Op.between]: [currentMonthStart, currentMonthEnd] },
        }),
      ]);

    const [overallPerishableItems, lastTotalPerishable, currTotalPerishable] =
      await Promise.all([
        countRecords(Item, 
            { perishable: 1, status: { [Op.or]: [0, 1] }}
        ),
        countRecords(Item,
            { perishable: 1, status: { [Op.or]: [0, 1] },
            date_created: { [Op.between]: [lastMonthStart, lastMonthEnd] },
        }),
        countRecords(Item,
            { perishable: 1, status: { [Op.or]: [0, 1] },
            date_created: { [Op.between]: [currentMonthStart, currentMonthEnd] },
        }),
      ]);

      const [overallUncountableItems, lastTotalUncountable, currTotalUncountable] =
      await Promise.all([
        countRecords(Item, 
            { uncountable: 1, status: { [Op.or]: [0, 1] }}
        ),
        countRecords(Item,
            { uncountable: 1, status: { [Op.or]: [0, 1] },
            date_created: { [Op.between]: [lastMonthStart, lastMonthEnd] },
        }),
        countRecords(Item,
            { uncountable: 1, status: { [Op.or]: [0, 1] },
            date_created: { [Op.between]: [currentMonthStart, currentMonthEnd] },
        }),
      ]);

    const locations = {
      overall_total: overallLocations,
      last_total: lastTotalLocations,
      curr_total: currTotalLocations,
      rating: `${calculatePercentageChange(currTotalLocations, lastTotalLocations).toFixed(2)}%`,
    };

    const items = {
      overall_total: overallItems,
      last_total: lastTotalItems,
      curr_total: currTotalItems,
      rating: `${calculatePercentageChange( currTotalItems, lastTotalItems).toFixed(2)}%`,
    };

    const users = {
      premium: {
        overall_total: overallPremiumUsers,
        last_total: lastTotalPremiumUsers,
        curr_total: currTotalPremiumUsers,
        rating: `${calculatePercentageChange(currTotalPremiumUsers,lastTotalPremiumUsers ).toFixed(2)}%`,
      },
      free: {
        overall_total: overallFreeUsers,
        last_total: lastTotalFreeUsers,
        curr_total: currTotalFreeUsers,
        rating: `${calculatePercentageChange(currTotalFreeUsers,lastTotalFreeUsers).toFixed(2)}%`,
      },
    };

    const perishable = {
      overall_total: overallPerishableItems,
      last_total: lastTotalPerishable,
      curr_total: currTotalPerishable,
      rating: `${calculatePercentageChange(currTotalPerishable, lastTotalPerishable).toFixed(2)}%`,
    };

    const uncountable = {
      overall_total: overallUncountableItems, 
      last_total: lastTotalUncountable, 
      curr_total: currTotalUncountable,
      rating: `${calculatePercentageChange(currTotalUncountable, lastTotalUncountable).toFixed(2)}%`,
    };

    const result = { locations, items, users, perishable, uncountable };
    return NextResponse.json({
      status: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Errorss: " + error.message,
    });
  }
}
