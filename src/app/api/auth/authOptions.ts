import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/drizzle/db';
import { and, eq, isNull, or, sql } from 'drizzle-orm';
import { user } from '@/drizzle/schema';
import { getCurrentAcademicYear } from '@/lib/academicYear';

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

        // Admins have academic_year = NULL (always active).
        // All other roles must match the current academic year so old credentials
        // from prior batches cannot be used to log in.
        const fetchedUsers = await db
          .select()
          .from(user)
          .where(
            and(
              eq(sql`LOWER(${user.email})`, normalizedEmail),
              or(isNull(user.academicYear), eq(user.academicYear, getCurrentAcademicYear()))
            )
          )
          .limit(1);

        const fetchedUser = fetchedUsers[0];

        if (!fetchedUser || credentials.password !== fetchedUser.password) {
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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
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
