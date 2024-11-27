'use client'
import { ContentTitle } from '@/components/Shared/ContentTitle'
import { useMobileUser } from '@/context/MobileUserContext'
import { UserRound } from 'lucide-react'
import React from 'react'

export const ViewContentTitle = () => {

    const {user, loading, error} = useMobileUser()
  return (
    <ContentTitle title={`View > ${ loading ? "...": user?.name + "'s Profile" } `} icon={<UserRound />}/>
  )
}
