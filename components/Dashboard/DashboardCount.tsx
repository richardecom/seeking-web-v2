'use client'
import DashboardCard from "./DashboardCard";
import { Box, MapPin, UsersRound } from "lucide-react";
import { GetCounts } from "@/hooks/DashboardHooks";
import { DashBarChart } from "@/components/Dashboard/DashBarChart";
import { useEffect, useState } from "react";
import { DashLineChart } from "./DashLineChart";
import { DashAreaChart } from "./DashAreaChart";
import { DashPieChart } from "./DashPieChart";

export default function DashboardCount() {
  const [countData, setCountData] = useState<any>({})
  const [progress, setProgress] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const getCategoryData = async () => {
    try {
      setIsLoading(true);
      const result = await GetCounts();
      setCountData(result.data)
    } catch (err) {
      console.log(err);
    } finally{
      setProgress(100)
      setIsLoading(false)
    }
  };
  useEffect(() => {
    getCategoryData();
  }, []);
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-3">
        <DashboardCard
          title="Total Locations"
          icon={<MapPin />}
          value={countData?.locations?.overall_total}
          subtitle={`${countData?.locations?.rating} from last month`}
          progress={progress}
          isLoading = {isLoading}
        />
        <DashboardCard
          title="Total Items"
          icon={<Box />}
          value={countData?.items?.overall_total}
          subtitle={`${countData?.items?.rating} from last month`}
          progress={progress}
          isLoading = {isLoading}
        />
        <DashboardCard
          title="Total Premium Users"
          icon={<UsersRound />}
          value={countData?.users?.premium?.overall_total}
          subtitle={`${countData?.users?.premium?.rating} from last month`}
          progress={progress}
          isLoading = {isLoading}
        />
        <DashboardCard
          title="Total Free Users"
          icon={<UsersRound />}
          value={countData?.users?.free?.overall_total}
          subtitle={`${countData?.users?.free?.rating} from last month`}
          progress={progress}
          isLoading = {isLoading}
        />
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-3">
        <DashboardCard
          title="No. of Perishable Items"
          icon={<Box />}
          value={countData?.perishable?.overall_total}
          subtitle={`${countData?.perishable?.rating} from last month`}
          progress={progress}
          isLoading = {isLoading}
        />
        <DashboardCard
          title="No. of Uncountable Items"
          icon={<Box />}
          value={countData?.uncountable?.overall_total}
          subtitle={`${countData?.uncountable?.rating} from last month`}
          progress={progress}
          isLoading = {isLoading}
        />
      </div> */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-3">
        <DashBarChart/>
        <DashLineChart/>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-3">
        <DashAreaChart/>
        <DashPieChart/>
      </div>
    </>
  );
}
