import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
      
        try {
          const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/user/signin`, {
            email: credentials.email,
            password: credentials.password,
          });
      
          const user = response.data;
      
          if (!user || !user.success) {
            throw new Error("No user found with this email");
          }
      
          if (!user.userId) {
            throw new Error("User ID is missing from response");
          }
      
          return {
            id: user.userId,
            name: user.name || "",
            email: user.email || credentials.email,
          };
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || error.message || "Login failed");
          } else if (error instanceof Error) {
            throw new Error(error.message || "Login failed");
          } else {
            throw new Error("An unknown error occurred during login");
          }
        }
      }
      
    }),
  ],
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    maxAge: 60 * 60, // 1 hour

  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
