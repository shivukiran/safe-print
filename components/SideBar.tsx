'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../app/lib/utils";
import { Home, Upload, FileText, LogOut, Menu } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { signOut } from "next-auth/react";

interface SidebarProps {
  userName?: string;
  userId?: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onFetchFilesOpen: () => void;
  onDeleteAllFiles: (userId: string) => Promise<void>;
  loadingDelete: boolean;
}

const navItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
];

const handleSignOut = async () => {
  await signOut({ redirect: true, callbackUrl: "/signin" });
};

const Sidebar = ({
  userName,
  userId,
  isCollapsed,
  toggleSidebar,
  onFetchFilesOpen,
  onDeleteAllFiles,
  loadingDelete,
}: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen fixed top-0 left-0 z-50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-60",
        "bg-[#1E293B] text-white border-r border-gray-700 shadow-md"
      )}
    >
      {/* Top bar with username and toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">

        {!isCollapsed && (

          <h2 className="text-lg font-semibold tracking-wide text-white">
            {userName || "User"}
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <Menu />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col mt-4">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md mx-2 transition-all",
                isActive
                  ? "bg-gray-700 text-blue-300 font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}

        {/* Fetch Files */}
        <button
          onClick={onFetchFilesOpen}
          className="flex items-center space-x-3 px-4 py-3 mx-2 mt-2 text-amber-300 hover:text-white cursor-pointer hover:bg-gray-700 rounded-md transition-all transform hover:scale-105 hover:shadow-lg"
        >
          <Upload className="w-5 h-5" />
          {!isCollapsed && <span>Fetch Files</span>}
        </button>

        {/* Delete All Files */}
        <button
          onClick={() => userId && onDeleteAllFiles(userId)}
          disabled={loadingDelete}
          className="flex items-center space-x-3 px-4 py-3 mx-2 mt-2 text-red-700 hover:text-white cursor-pointer hover:bg-gray-700 rounded-md transition-all transform hover:scale-105 hover:shadow-lg"
        >
          <FileText className="w-5 h-5" />
          {!isCollapsed && <span>Delete All Files</span>}
        </button>
      </nav>

      {/* Bottom user avatar and logout */}
      <div className="absolute bottom-0 w-full px-4 py-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <UserAvatar name={userName || "User"} />
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-white">
                {userName || "User"}
              </p>
              <button
                className="text-xs text-red-300 flex items-center space-x-1 hover:text-red-500 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
