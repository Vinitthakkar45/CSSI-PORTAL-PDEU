import type { Metadata } from 'next';
import React from 'react';

import AdminDashboard from '@/components/Admin/Dashboard';
import StudentDashboard from '@/components/Student/Dashboard';
import FacultyDashboard from '@/components/Faculty/Dashboard';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import CoordinatorDashboard from '@/components/Coordinator/Dashboard';
export const metadata: Metadata = {
  title: 'Home',
  description: 'This is Home for Dashboard',
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  let dashboardContent;

  switch (userRole) {
    case 'coordinator':
      dashboardContent = <CoordinatorDashboard />;
      break;
    case 'admin':
      dashboardContent = <AdminDashboard />;
      break;
    case 'faculty':
      dashboardContent = <FacultyDashboard />;
      break;
    case 'student':
      dashboardContent = <StudentDashboard />;
      break;
    default:
      dashboardContent = <div>Loading or Unauthorized</div>; // Handle cases where role is missing
  }

  return <>{dashboardContent}</>;
}
