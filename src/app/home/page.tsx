import type { Metadata } from 'next';
import React from 'react';

import AdminDashboard from '@/components/Admin/Dashboard';
import StudentDashboard from '@/components/Student/Dashboard';
import FacultyDashboard from '@/components/Faculty/Dashboard';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserInfoCard from '@/components/Home/user-profile/UserInfoCard'; // Import the Client Component
import { SessionUser } from '@/drizzle/schema';

export const metadata: Metadata = {
  title: 'Home',
  description: 'This is Home for Dashboard',
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined | null; // Extract the user object

  console.log('Session in Dashboard:', session); // This will log on the server

  let dashboardContent;

  switch (
    user?.role // Use user?.role to safely access the property
  ) {
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
