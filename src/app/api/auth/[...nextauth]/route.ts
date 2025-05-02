import NextAuth from 'next-auth';
import { authOptions } from '../authOptions';

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
