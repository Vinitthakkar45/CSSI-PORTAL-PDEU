'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={true} defaultTheme="dark">
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
