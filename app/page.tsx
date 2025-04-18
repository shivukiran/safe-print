"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import FileManager from "@/components/fileManager";

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FileManager 
        userId={session?.user?.id} 
        userName={session?.user?.name || ""} 
      />
    </div>
  );
}
