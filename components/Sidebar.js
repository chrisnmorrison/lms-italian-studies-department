import React from "react";
import Link from "next/link";
import {
  FcHome,
  FcNews,
  FcConferenceCall,
  FcOrgUnit,
  FcTodoList
} from "react-icons/fc";

const sidebarLinks = [
  { href: "/", label: "Home", icon: <FcHome className="sidebar-icon" /> },
  { href: "/courses", label: "Courses", icon: <FcNews className="sidebar-icon" /> },
  { href: "/users", label: "Manage Users", icon: <FcConferenceCall className="sidebar-icon" /> },
  { href: "/announcements", label: "Announcements", icon: <FcOrgUnit className="sidebar-icon" /> },
  { href: "/RegistrationRequests", label: "Registration Requests", icon: <FcTodoList className="sidebar-icon" /> }
];

export default function Sidebar() {
  const sidebarItemClass = "cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <aside
      id="default-sidebar"
      className="z-40 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="sidebar-items h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {sidebarLinks.map(({ href, label, icon }, index) => (
            <li key={index} className={sidebarItemClass}>
              <Link href={href}>
                <div className="inline-flex">
                  {icon}
                  <span className="ml-3">{label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
