import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { executeQuery } from "@/app/lib/db";
import { SessionStrategy } from "next-auth";

export const authOptions = {
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

        const user = await executeQuery(
          "SELECT * FROM Users WHERE email = @param0",
          [credentials.email]
        );

        if (!user || user.length === 0) {
          throw new Error("User not found");
        }

        // Compare password hash
        const isValid = await compare(credentials.password, user[0].password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { id: user[0].id, name: user[0].name, email: user[0].email };
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
  secret: process.env.NEXTAUTH_SECRET,
};
