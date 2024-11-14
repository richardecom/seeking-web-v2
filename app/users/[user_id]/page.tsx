/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";
import { ContentTitle } from "@/components/Shared/ContentTitle";
import { UserRound } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { GetUserByID } from "@/hooks/UserHooks";
import ProfileLayout from "@/components/User/View/ProfileLayout";
import LeftProfileWrapper from "@/components/User/View/LeftProfileWrapper";
import ProfileInformation from "@/components/User/View/ProfileInformation";
import SubscriptionHistory from "@/components/User/View/SubscriptionHistory";
import RightProfileWrapper from "@/components/User/View/RightProfileWrapper";
import LocationItemData from "@/components/User/View/LocationItemData";
import AdminProfile from "@/components/User/View/AdminProfile";
import FullProfileWrap from "@/components/User/View/FullProfileWrap";

const ViewProfilePage = ({ params }) => {
  const [user, setUser] = useState<any>({});
  const fetchUserData = useCallback(async () => {
    try {
      const data = (await GetUserByID(params.user_id)) as any;
      if (data) {
        setUser(data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [params.user_id]);
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  return (
    <DefaultLayout>
      <ContentTitle
        title={`View > ${user.name} 's Profile `}
        icon={<UserRound />}
      />

      {user.role_code === "mobile_user" ? (
        <ProfileLayout>
          <LeftProfileWrapper>
            <ProfileInformation user={user} />
            <SubscriptionHistory />
          </LeftProfileWrapper>
          <RightProfileWrapper>
            <LocationItemData user_id={params.user_id} />
          </RightProfileWrapper>
        </ProfileLayout>
      ) : (
        <ProfileLayout>
          <FullProfileWrap>
            <AdminProfile user={user} />
          </FullProfileWrap>
        </ProfileLayout>
      )}
    </DefaultLayout>
  );
};
export default ViewProfilePage;
