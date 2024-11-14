import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  item: {
    label: string;
    route: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
  };
  pageName: string;
  setPageName: (pageName: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, pageName, setPageName }) => {
  const pathname = usePathname();

  const handleClick = () => {
    const updatedPageName = pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(item.route);
    // console.log("updatedPageName", updatedPageName)
  };

  const isItemActive = item.route === pathname;

  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`p-2.5 flex items-center text-sm cursor-pointer ${
          isItemActive ? "bg-gray-200 bg-gradient-to-r from-[#800000] to-gray-200 text-[#FFFFFF] font-bold" : ""
        }`}
      >
        {item.icon}
        {item.label}
        {item.children}
      </Link>
    </li>
  );
};

export default SidebarItem;
