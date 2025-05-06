
'use client';

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Sidebar from "../../components/SideBar"; // Adjust path if needed
import { Bodoni_Moda_SC, Limelight
} from 'next/font/google';
interface FileManagerDashboardProps {
  userId: string | undefined;
  userName: string | undefined;
}

const barriecito = Bodoni_Moda_SC
({
  weight: '400',
  subsets: ['latin'],
});
const AboutPage: React.FC<FileManagerDashboardProps> = ({ userId, userName }) => {
  const { data: session, status } = useSession();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isName, setName] = useState<string | null>(null);
  const [isFetchOpen, setFetchOpen] = useState(false);

  // Redirect unauthenticated users
  if (status === "loading") return <div className="p-8 text-white">Loading...</div>;
  if (!session) {
    signIn();
    return <div className="p-8 text-white">Redirecting to login...</div>;
  }

  const deleteAllFiles = async (userId: string) => {
    if (!userId) return;

    setLoadingDelete(true);
    try {
      const res = await fetch("/api/deleteAllFiles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) console.error("Failed:", data.error);
    } catch (error) {
      console.error("Error deleting files:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E0EAFF] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          ${sidebarCollapsed ? "w-0 md:w-40" : "w-40 md:w-40"}
          transition-all duration-500 ease-in-out
          fixed md:relative z-20 h-full
        `}
      >
        <Sidebar
          userName={isName || userName}
          userId={userId}
          isCollapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onDeleteAllFiles={deleteAllFiles}
          loadingDelete={loadingDelete}
          onFetchFilesOpen={() => setFetchOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div
        className={`
          flex-1 flex flex-col justify-center items-center 
         bg-gradient-to-r from-black via-gray-900 to-gray-800  text-white p-6 my-25 mr-10 rounded-lg shadow-md
          ${sidebarCollapsed ? "ml-0" : "ml-40 md:ml-60"}
          transition-all duration-500 ease-in-out pt-20
        `}
      >
    <div className="max-w-4xl mx-auto text-center px-6 py-12 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
      <h1 className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 bg-clip-text text-transparent mb-6 drop-shadow-lg  ${barriecito.className}`}>
        Welcome to Safe Xcribe
      </h1>

      <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
        Safe Xcribe is a next-generation file management system designed for simplicity, speed, and  security.
        Whether you're uploading documents, sharing important files, or accessing content across devices, we ensure a seamless experience powered by our Ideas.
      </p>

      <div className="mt-12">
        <h2 className={`text-2xl md:text-3xl font-semibold text-cyan-300  ${barriecito.className}`}>📩 Contact Us</h2>
        <p className="mt-2 text-lg md:text-xl text-gray-200">
          We'd love to hear from you! Reach out at{" "}
          <a
            href="mailto:xtronshivu115@gmail.com"
            className="text-blue-400 underline hover:text-blue-300 cursor-pointer"
          >
            xtronshivu115@gmail.com
          </a>
        </p>
      </div>
    </div>
      </div>
    </div>
  );
};

export default AboutPage;
