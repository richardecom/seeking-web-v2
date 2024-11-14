'use client'
import { GetRecentAddedLocation } from "@/hooks/DashboardHooks";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import UserProfile from "./UserProfile";

const RecentLocation = () => {
  const [recentLocation, setRecentLocation] = useState<any[]>([]);
  const getRecent = async () => {
    try {
      const result = await GetRecentAddedLocation();
      setRecentLocation(result.data.list);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => { getRecent(); }, []);
  return (
    <Card>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">
          Recently Added Location
        </h3>
        <p className="text-sm text-muted-foreground">
          Users added location this month.
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-8">
          {recentLocation.map((location, index) => (
            <UserProfile
              key={index}
              userImage={location.user.image}
              userName={location.user.name}
              itemName={location.building}
              dateCreated={location.date_created}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RecentLocation;
