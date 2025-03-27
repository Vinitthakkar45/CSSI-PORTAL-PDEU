'use client';

import React from 'react';
import AppHeader from '@/layout/AppHeader';
import AppSidebar from '@/layout/AppSidebar';
import Backdrop from '@/layout/Backdrop';
import { Outfit } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import '@/styles/globals.css';

const outfit = Outfit({
  variable: '--font-outfit-sans',
  subsets: ['latin'],
});

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen ? 'ml-0' : isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]';

  return (
    <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
      <AppHeader />
      <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
    </div>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={`${outfit.variable} dark:bg-gray-900`}>
      <ThemeProvider>
        <SidebarProvider>
          <div className="min-h-screen xl:flex">
            <AppSidebar />
            <Backdrop />
            <MainContent>{children}</MainContent>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </section>
  );
}
