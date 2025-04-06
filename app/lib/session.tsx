
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

 export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "******" },
      },
      async authorize(credentials: any) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user || user.password !== credentials.password) {
          throw new Error("Invalid credentials");
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }:any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }:any) {
        console.log(session)
      if (session.user) {
        session.user.id = token.id; // ✅ Type assertion to fix TypeScript error
        session.user.email = token.email;
      }
      return session;
    },
  },
}