
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "sonner";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <Toaster position="top-right" richColors />
    {children}</SessionProvider>;
}