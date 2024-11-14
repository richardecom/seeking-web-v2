import React from 'react'

import { Menu , X} from 'lucide-react'

// import DropdownUser from './DropdownUser';
import NotificationIcon from './NotificationIcon';
import LogoutIcon from './LogoutIcon';
import ProfileIcon from './ProfileIcon';
export const HeaderIndex = (props: {
        sidebarOpen: string | boolean | undefined;
        setSidebarOpen: (arg0: boolean) => void;
      }) => {

  
  return (
    <header className="sticky h-16 top-0 z-50 flex w-full bg-[#800000] dark:bg-boxdark dark:drop-shadow-none p-0 m-0">
        
        <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            <button
                aria-controls="sidebar"
                onClick={(e) => {
                  e.stopPropagation();
                  props.setSidebarOpen(!props.sidebarOpen);
                }}

            className="z-50 block rounded-sm border-stroke cursor-pointer bg-gray-400 p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden">
              {props.sidebarOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* <NotificationIcon/> */}
        <ProfileIcon/>
        <LogoutIcon/>
        {/* <DropdownUser/> */}
      </header>
  )
}

