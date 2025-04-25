import type { Metadata } from 'next';
import React from 'react';
import AdminDashboard from '@/components/Admin/Dashboard';
import StudentDashboard from '@/components/Student/Dashboard';
import FacultyDashboard from '@/components/Faculty/Dashboard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'CSSI Portal Dashboard',
};

// ✅ Tell Next.js to use server-side rendering
export const dynamic = 'force-dynamic';

const Dashboard = async () => {
  let dashboardContent = <div>Loading...</div>; // Default placeholder

  try {
    const session = await getServerSession(authOptions);

    const userRole = session?.user?.role;

    switch (userRole) {
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
        dashboardContent = <div>Unauthorized or No Role Found</div>;
    }
  } catch (err) {
    console.error('Session error in /home:', err);
    dashboardContent = <div>Error loading dashboard</div>;
  }

  return <div className="m-10">{dashboardContent}</div>;
};

export default Dashboard;
