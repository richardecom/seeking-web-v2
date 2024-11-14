'use client'
import { GetRecentAddedItems } from "@/hooks/DashboardHooks";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import UserProfile from "./UserProfile";

const RecentItems = () => {
  const [recentItem, setRecentItem] = useState<any[]>([]);
  const getRecent = async () => {
    try {
      const result = await GetRecentAddedItems();
      setRecentItem(result.data.list);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getRecent();
  }, []);
  return (
    <Card>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">
          Recently Added Items
        </h3>
        <p className="text-sm text-muted-foreground">
          Users added items this month.
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-8">
          {recentItem.map((item, index) => (
            <UserProfile
              key={index}
              userImage={item.user.image}
              userName={item.user.name}
              itemName={item.item_name}
              dateCreated={item.date_created}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RecentItems;
