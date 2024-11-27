import { DefaultLayout } from "@/components/Layouts/DefaultLayout";
import React from "react";
import ProfileLayout from "@/components/User/View/ProfileLayout";
import LeftProfileWrapper from "@/components/User/View/LeftProfileWrapper";
import ProfileInformation from "@/components/User/View/ProfileInformation";
import SubscriptionHistory from "@/components/User/View/SubscriptionHistory";
import RightProfileWrapper from "@/components/User/View/RightProfileWrapper";
import LocationItemData from "@/components/User/View/LocationItemData";
import { MobileUserProvider } from "@/context/MobileUserContext";
import { ViewContentTitle } from "@/components/User/View/ViewContentTitle";
const ViewProfilePage = ({ params }) => {
  const userId = params.user_id;
  return (
    <DefaultLayout>
       <MobileUserProvider userId={userId}>
        <ViewContentTitle/>
        <ProfileLayout>
          <LeftProfileWrapper>
            <ProfileInformation />
            <SubscriptionHistory />
          </LeftProfileWrapper>
          <RightProfileWrapper>
            <LocationItemData user_id={params.user_id} />
          </RightProfileWrapper>
        </ProfileLayout>
      </MobileUserProvider>
    </DefaultLayout>
  );
};
export default ViewProfilePage;
