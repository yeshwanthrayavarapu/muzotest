import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { executeQuery } from "@/app/lib/dbClient";
import { SessionStrategy } from "next-auth";
import { SQLServerAdapter } from "./adapter";
import { AuthOptions } from "next-auth";
import type { User } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: SQLServerAdapter(),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const users = await executeQuery(
          "SELECT * FROM Users WHERE email = @param0",
          [credentials.email]
        );

        if (!users || users.length === 0) {
          throw new Error("User not found");
        }

        const user = users[0];

        // Compare password hash
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          isAdmin: user.isAdmin
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
