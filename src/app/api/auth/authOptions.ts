import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { user } from '@/drizzle/schema';
import { sql } from 'drizzle-orm';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase();
        const fetchedUsers = await db
          .select()
          .from(user)
          .where(eq(sql`LOWER(${user.email})`, normalizedEmail))
          .limit(1);
        const fetchedUser = fetchedUsers[0];

        if (!fetchedUser || !(credentials.password === fetchedUser.password)) {
          return null;
        }

        return {
          id: fetchedUser.id.toString(),
          email: fetchedUser.email,
          role: fetchedUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
};
