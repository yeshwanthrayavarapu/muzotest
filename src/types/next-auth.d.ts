import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isAdmin?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    password: string
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isAdmin?: boolean
  }
}