import Calendar from '@/components/Home/calendar/Calendar';
import PageBreadcrumb from '@/components/Home/common/PageBreadCrumb';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'CSSI Calender | Admin - CSSI Dashboard Template',
  description: 'This is the CSSI Calender page for Admin. Use this to set the dates for stages.',
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
