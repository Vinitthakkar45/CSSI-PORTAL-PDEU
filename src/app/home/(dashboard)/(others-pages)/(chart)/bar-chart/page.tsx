import BarChartOne from '@/components/Home/charts/bar/BarChartOne';
import ComponentCard from '@/components/Home/common/ComponentCard';
import PageBreadcrumb from '@/components/Home/common/PageBreadCrumb';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next.js Bar Chart | TailAdmin - Next.js Dashboard Template',
  description: 'This is Next.js Bar Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
