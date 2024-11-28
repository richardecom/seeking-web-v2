import React, { useState } from "react";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";

const DashboardCard = ({
  title,
  icon,
  value,
  subtitle,
  progress,
  isLoading,
}) => {
  return (
    // <Card>
    //   <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
    //     <h3 className="tracking-tight text-sm font-medium">{title}</h3>
    //     {icon}
    //   </div>
    //   <div className="p-6 pt-0">
    //     {isLoading ? (
    //       <div>
    //         <Progress value={progress} className="h-1 w-[30%] max-w-md " />
    //       </div>
    //     ) : (
    //       <div>
    //         <div className="text-2xl font-bold">{value}</div>
    //         <p className="text-xs text-muted-foreground">{subtitle}</p>
    //       </div>
    //     )}
    //   </div>
    // </Card>

    <Card>
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">
          {isLoading ? <Skeleton className="w-24 h-4" /> : title} {/* Skeleton for title */}
        </h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        {isLoading ? (
          <div>
            <Skeleton className="w-32 h-6" /> {/* Skeleton for value */}
            <Skeleton className="w-24 h-4 mt-2" /> {/* Skeleton for subtitle */}
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCard;
