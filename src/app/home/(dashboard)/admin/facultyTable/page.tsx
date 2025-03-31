import FacultyTable from '@/components/Admin/FacultyTable';
import StudentTable from '@/components/Admin/StudentTable';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next.js Basic Table | TailAdmin - Next.js Dashboard Template',
  description: 'This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template',
  // other metadata
};

export default function studentTable() {
  return (
    <div>
      <FacultyTable />
    </div>
  );
}
