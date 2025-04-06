
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import FileManager from "@/components/fileManager";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <FileManager 
        userId={session?.user?.id ?? undefined} 
        userName={session?.user?.name ?? undefined} 
      />
    </div>
  );
}