import Calendar from '@/components/Home/calendar/Calendar';
import PageBreadcrumb from '@/components/Home/common/PageBreadCrumb';
import React from 'react';

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div>
  );
}
