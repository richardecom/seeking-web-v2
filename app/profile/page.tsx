import DashboardCount from '@/components/Dashboard/DashboardCount'
import DashboardWrap from '@/components/Dashboard/DashboardWrap'
import RecentItems from '@/components/Dashboard/RecentItems'
import RecentLocation from '@/components/Dashboard/RecentLocation'
import { DefaultLayout } from '@/components/Layouts/DefaultLayout'
import ChangeBasicInfo from '@/components/Profile/ChangeBasicInfo'
import ChangeEmail from '@/components/Profile/ChangeEmail'
import ChangePassword from '@/components/Profile/ChangePassword'
import CurrentInformation from '@/components/Profile/CurrentInformation'
import { ContentTitle } from '@/components/Shared/ContentTitle'
import { UserRound } from 'lucide-react'
import React from 'react'

const MePage = () => {
  return (
    <DefaultLayout>
      <ContentTitle title="My Profile" icon={<UserRound />} />
      <DashboardWrap>
        <CurrentInformation/>
        <ChangeBasicInfo/>
        <ChangeEmail />
        <ChangePassword />
      </DashboardWrap>
    </DefaultLayout>
  )
}

export default MePage
