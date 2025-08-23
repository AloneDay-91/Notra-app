import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import {prisma} from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be displayed on the sign-in form.
      // The credentials object should be used for form fields.
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        // Find the user in the database.
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user || !user.password) {
          // No user found, or user signed up with an OAuth provider.
          return null
        }

        // Check if the password is correct.
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (passwordsMatch) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session strategy with Credentials provider
  },
  pages: {
    signIn: '/', // Redirect users to the home page for sign-in
  },
  callbacks: {
    // Attach user ID to the session token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // Attach user ID to the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
