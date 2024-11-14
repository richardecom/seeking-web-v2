'use client'
import Description from '@/components/Auth/Description'
import Footer from '@/components/Auth/Footer'
import { LoginForm } from '@/components/Auth/LoginForm'
import LoginLayout from '@/components/Auth/LoginLayout'
import Title from '@/components/Auth/Title'
import TitleDescWrap from '@/components/Auth/TitleDescWrap'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const LoginPage = () => {
  return (
    <LoginLayout>
      <Card className="w-full sm:max-w-lg px-10 pb-7">
        <TitleDescWrap>
          
          <div className='flex my-5'>

          <div className='w-[70%]'>
              <div>
                <h2 className=" text-left text-xl font-bold leading-9 tracking-tight text-gray-900">
                  SEEKING
                </h2>
              </div>
              <div className='text-left text-sm mt-2'>
                <span className=''>Start the session by logging into your account.</span>
              </div>
            </div>
            <div className='flex items-center w-[30%]'>
              <Image
                width={100}
                height={100}
                src={"/images/seeking-logo.png"}
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
              />
            </div>
            
          </div>
          {/* <Title title='SEEKING' />
          <Description className='' description='Start the session by logging into your account.' /> */}
        </TitleDescWrap>
          <LoginForm />
          <Footer title='Forgot Password?' link='/auth/forgot-password'/>
      </Card>
    </LoginLayout>
  )
}

export default LoginPage
