import AuthProvider from "../Providers/sessionProviders";
import { Toaster } from "sonner"; // ✅ CORRECT: Import from 'sonner'
import "./globals.css";

export const metadata = {
  title: "Safe Xcribe ",
  description: "Secure file printing application",
  icons: {
    icon: [
      {
        url: "/logo3.png",
        href: "/logo3.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors /> {/* ✅ Correct usage */}
        </AuthProvider>
      </body>
    </html>
  );
}
