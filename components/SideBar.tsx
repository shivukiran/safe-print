'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../app/lib/utils";
import { Home, Upload, FileText, LogOut, Menu, ChevronLeft } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { signOut } from "next-auth/react";


import { Bodoni_Moda_SC
} from 'next/font/google';

const barriecito = Bodoni_Moda_SC
({
  weight: '400',
  subsets: ['latin'],
});
// interface SidebarProps {
//   userName?: string;
//   userId?: string;
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
//   onFetchFilesOpen: () => void;
//   onDeleteAllFiles: (userId: string) => Promise<void>;
//   loadingDelete: boolean;
// }

// const navItems = [
//   { label: "Dashboard", icon: Home, href: "/dashboard" },
// ];

// const handleSignOut = async () => {
//   await signOut({ redirect: true, callbackUrl: "/signin" });
// };

// const Sidebar = ({
//   userName,
//   userId,
//   isCollapsed,
//   toggleSidebar,
//   onFetchFilesOpen,
//   onDeleteAllFiles,
//   loadingDelete,
// }: SidebarProps) => {
//   const pathname = usePathname();

//   return (
// <>

// <aside
//   className={cn(
//     "fixed md:relative z-20 h-[calc(100vh-2rem)] my-2 ml-2 top-0 left-0 bottom-0 rounded-3xl transition-all duration-500 ease-in-out",
//     isCollapsed ? "w-0 md:w-18" : "w-50 md:w-60",
//     "bg-[#1E293B] text-white border-r border-gray-700 shadow-md",
//     "hidden md:block" // hide on mobile, show from md and up
//   )}
// >
//       {/* Top bar with username and toggle */}
//       <div className="flex items-center justify-between px-4 py-4 bottom-2 border-b border-gray-700">

//         {!isCollapsed && (

//           <h2 className="text-lg font-semibold tracking-wide text-white">
//             {userName || "User"}
//           </h2>
//         )}
//         <button
//           onClick={toggleSidebar}
//           className="text-gray-300 hover:text-white transition-colors cursor-pointer px-2"
//         >
//           <Menu />
//         </button>
//       </div>

//       {/* Navigation links */}
//       <nav className="flex flex-col mt-4">
//         {navItems.map(({ label, icon: Icon, href }) => {
//           const isActive = pathname === href;
//           return (
//             <Link
//               key={label}
//               href={href}
//               className={cn(
//                 "flex items-center space-x-3 px-4 py-3 rounded-md mx-2 transition-all",
//                 isActive
//                   ? "bg-gray-700 text-blue-300 font-medium"
//                   : "text-gray-300 hover:bg-gray-700 hover:text-white"
//               )}
//             >
//               <Icon className="w-5 h-5" />
//               {!isCollapsed && <span>{label}</span>}
//             </Link>
//           );
//         })}

//         {/* Fetch Files */}
//         <button
//           onClick={onFetchFilesOpen}
//           className="flex items-center space-x-3 px-4 py-3 mx-2 mt-2 text-amber-300 hover:text-white cursor-pointer hover:bg-gray-700 rounded-md transition-all transform hover:scale-105 hover:shadow-lg"
//         >
//           <Upload className="w-5 h-5" />
//           {!isCollapsed && <span>Fetch Files</span>}
//         </button>

//         {/* Delete All Files */}
//         <button
//           onClick={() => userId && onDeleteAllFiles(userId)}
//           disabled={loadingDelete}
//           className="flex items-center space-x-3 px-4 py-3 mx-2 mt-2 text-red-700 hover:text-white cursor-pointer hover:bg-gray-700 rounded-md transition-all transform hover:scale-105 hover:shadow-lg"
//         >
//           <FileText className="w-5 h-5" />
//           {!isCollapsed && <span>Delete All Files</span>}
//         </button>
//       </nav>

//       {/* Bottom user avatar and logout */}
//       <div className="absolute bottom-0 w-full px-4 py-4 border-t border-gray-700">
//         <div className="flex items-center space-x-3">
//           <UserAvatar name={userName || "User"} />
//           {!isCollapsed && (
//             <div>
//               <p className="text-sm font-medium text-white">
//                 {userName || "User"}
//               </p>
//               <button
//                 className="text-xs text-red-300 flex items-center space-x-1 hover:text-red-500 cursor-pointer"
//                 onClick={handleSignOut}
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </aside>



// {/* Mobile Header */}
// <header className="md:hidden bg-[#1E293B] text-white shadow-md fixed top-0 left-0 right-0 z-50">
//   <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
//     <div className="flex items-center space-x-3">
//       <button onClick={toggleSidebar} className="text-gray-300 hover:text-white cursor-pointer">
//         <Menu />
//       </button>
//       <h1 className="text-lg font-semibold">File Space</h1>
//     </div>

//       <div className="flex items-center justify-end space-x-3">
//         <UserAvatar name={userName || "User"} />
//         {!isCollapsed && (
//         <div>
//           <p className="text-sm font-medium text-white">
//           {userName || "User"}
//           </p>
//           <button
//           className="text-xs text-red-300 flex items-center space-x-1 hover:text-red-500 cursor-pointer"
//           onClick={handleSignOut}
//           >
//           <LogOut className="w-4 h-4" />
//           <span>Logout</span>
//           </button>
//         </div>
//         )}
//       </div>
//   </div>

//   {/* Slide-down nav */}
//   <div
//     className={cn(
//       "overflow-hidden transition-all duration-500 ease-in-out transform",
//       isCollapsed ? "max-h-0 scale-y-0" : "max-h-screen scale-y-100"
//     )}
//     style={{ transformOrigin: "top" }}
//   >
//     <nav className="flex flex-col py-2">
//       {navItems.map(({ label, icon: Icon, href }) => {
//         const isActive = pathname === href;
//         return (
//           <Link
//             key={label}
//             href={href}
//             className={cn(
//               "flex items-center px-4 py-2 rounded-md",
//               isActive
//                 ? "text-blue-300 bg-transparent"
//                 : "text-gray-300 hover:text-white"
//             )}
//           >
//             <Icon className="w-5 h-5 mr-2" />
//             <span className="px-2 py-1">{label}</span>
//           </Link>
//         );
//       })}

//       {/* Extra Buttons */}
//       <button
//         onClick={onFetchFilesOpen}
//         className="flex items-center px-4 py-2 text-sm text-amber-400 hover:text-white cursor-pointer rounded-md transition-all transform hover:scale-101"
//       >
//         <Upload className="w-5 h-5 mr-2" />
//         <span className="px-2 py-1">Fetch Files</span>
//       </button>
//       <button
//         onClick={() => userId && onDeleteAllFiles(userId)}
//         disabled={loadingDelete}
//         className="flex items-center px-4 py-2 text-sm text-red-400 hover:text-white cursor-pointer rounded-md transition-all transform hover:scale-101"
//       >
//         <FileText className="w-5 h-5 mr-2" />
//         <span className="px-2 py-1">Delete All Files</span>
//       </button>
//     </nav>
//   </div>
//   <style jsx>{`
//       @media (max-width: 768px) {
//         aside {
//           display: none;
//         }
//       }
//     `}</style>
// </header>

// </>
//   );
// };

// export default Sidebar;






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
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-20 h-[calc(100vh-2rem)] my-4 ml-4 transition-all duration-500 ease-in-out",
          "bg-gradient-to-r from-black via-gray-900 to-gray-800  text-white border border-gray-700/50 shadow-xl",
          "rounded-2xl backdrop-blur-sm bg-opacity-90",
          "hidden md:flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Top section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          {!isCollapsed && (
            <h2 className={`text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent ${barriecito.className}`}>
              FileSpace
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600 transition-all hover:scale-110"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed ? "rotate-180" : "")} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 flex flex-col p-2 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg mx-1 transition-all group",
                  isActive
                    ? "bg-blue-500/20 text-blue-400 font-medium shadow-md"
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isActive 
                    ? "bg-blue-500/10" 
                    : "bg-gray-700/30 group-hover:bg-gray-600/50"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                {!isCollapsed && <span className={`flex-1 ${barriecito.className}`}>{label}</span>}
                {!isCollapsed && isActive && (
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse " />
                )}
              </Link>
            );
          })}

          {/* Action Buttons */}
          <div className={cn("space-y-1", !isCollapsed && "px-1 py-2")}>
            <button
              onClick={onFetchFilesOpen}
              className={cn(
                "flex items-center w-full p-3 rounded-lg transition-all group",
                "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300",
                "transform hover:translate-x-1 cursor-pointer"
              )}
            >
              <div className="p-2 rounded-lg bg-amber-500/20 group-hover:bg-amber-500/30 cursor-pointer ">
                <Upload className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className={`ml-2 ${barriecito.className}`}>Fetch Files</span>}
            </button>

            <button
              onClick={() => userId && onDeleteAllFiles(userId)}
              disabled={loadingDelete}
              className={cn(
                "flex items-center w-full p-3 rounded-lg transition-all group",
                "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300",
                "transform hover:translate-x-1 cursor-pointer",
                loadingDelete && "opacity-70 cursor-not-allowed"
              )}
            >
              <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30">
                <FileText className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span className={`ml-2 ${barriecito.className}`}>
                  {loadingDelete ? "Deleting..." : "Delete All"}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-700/50 my-2">
          <div className="flex items-center space-x-3 mx-1">
            <UserAvatar name={userName || "User"} size="md" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-white truncate ${barriecito.className}`}>
                  {userName || "User"}
                </p>
                <button
                  className="flex items-center text-xs text-red-300 hover:text-red-500 transition-colors mt-1 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-1 " />
                  <span className={`${barriecito.className}`}>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-700/50  ">
      
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              FileSpace
            </h1>
          </div>

          <div className="flex items-center justify-end space-x-3">
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

        {/* Slide-down nav */}
        <div
    className={cn(
      "overflow-hidden transition-all duration-500 ease-in-out transform",
      isCollapsed ? "max-h-0 scale-y-0" : "max-h-screen scale-y-100"
    )}
    style={{ transformOrigin: "top" }}
  >
    <nav className="flex flex-col py-2">
      {navItems.map(({ label, icon: Icon, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center px-4 py-2 rounded-md",
              isActive
                ? "text-blue-300 bg-transparent"
                : "text-gray-300 hover:text-white"
            )}
          >
            <Icon className="w-5 h-5 mr-2" />
            <span className="px-2 py-1">{label}</span>
          </Link>
        );
      })}

      {/* Extra Buttons */}
      <button
        onClick={onFetchFilesOpen}
        className="flex items-center px-4 py-2 text-sm text-amber-400 hover:text-white cursor-pointer rounded-md transition-all transform hover:scale-101"
      >
        <Upload className="w-5 h-5 mr-2" />
        <span className="px-2 py-1">Fetch Files</span>
      </button>
      <button
        onClick={() => userId && onDeleteAllFiles(userId)}
        disabled={loadingDelete}
        className="flex items-center px-4 py-2 text-sm text-red-400 hover:text-white cursor-pointer rounded-md transition-all transform hover:scale-101"
      >
        <FileText className="w-5 h-5 mr-2" />
        <span className="px-2 py-1">Delete All Files</span>
      </button>
    </nav>
  </div>
      </header>
    </>
  );
};
export default Sidebar;