import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { user } from '@/drizzle/schema';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string | null;
      role: string | null;
    };
  }

  interface User {
    id: string;
    email: string | null;
    role: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    email: string | null;
    role: string | null;
  }
}

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

        const fetchedUsers = await db.select().from(user).where(eq(user.email, credentials.email)).limit(1);
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
