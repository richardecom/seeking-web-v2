"use client";
import React, { useState } from "react";
import { HeaderIndex } from "@/components/Header/index";
import { SidebarIndex } from "@/components/Sidebar/Index";

export const DefaultLayout = ({children}: { children: React.ReactNode;}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex">
        <SidebarIndex sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}></SidebarIndex>
        <div className={`relative flex flex-1 flex-col lg:ml-64  transition-all duration-300 ease-linear  ${sidebarOpen ? 'ml-64':'ml-0'}`}>
            <HeaderIndex sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className={`flex-grow p-2 max-h-full m-1`}>
              <div className="col-span-12 xl:col-span-7">
                <div className="rounded-sm border h-full border-stroke bg-white px-5 pb-2.5 pt-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    {children}
                  </div>
                </div>
            </main>
        </div>
    </div>
  )
}
