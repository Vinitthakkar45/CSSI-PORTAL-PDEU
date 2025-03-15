import Calendar from '@/components/Home/calendar/Calendar';
import PageBreadcrumb from '@/components/Home/common/PageBreadCrumb';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next.js Calender | TailAdmin - Next.js Dashboard Template',
  description: 'This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template',
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div>
  );
}
