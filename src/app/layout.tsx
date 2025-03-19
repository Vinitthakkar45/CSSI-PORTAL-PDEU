'use client';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
