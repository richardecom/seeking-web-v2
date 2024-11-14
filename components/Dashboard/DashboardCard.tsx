import React, { useState } from "react";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

const DashboardCard = ({
  title,
  icon,
  value,
  subtitle,
  progress,
  isLoading,
}) => {
  return (
    <Card>
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        {isLoading ? (
          <div>
            <Progress value={progress} className="h-1 w-[30%] max-w-md " />
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
