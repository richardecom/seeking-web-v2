import DashboardCount from "@/components/Dashboard/DashboardCount";
import DashboardWrap from "@/components/Dashboard/DashboardWrap";
import RecentItems from "@/components/Dashboard/RecentItems";
import RecentLocation from "@/components/Dashboard/RecentLocation";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";
import { ContentTitle } from "@/components/Shared/ContentTitle";
import { Gauge} from "lucide-react";
import React from "react";
const DashboardPage = () => {
  return (
    <DefaultLayout>
      <ContentTitle title="Dashboard" icon={<Gauge />} />
      <DashboardCount />
      <DashboardWrap>
        <RecentItems />
        <RecentLocation />
      </DashboardWrap>
    </DefaultLayout>
  );
};
export default DashboardPage;
