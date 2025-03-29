'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import StagesSection from './StagesSection';

const Dashboard = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return <StagesSection />;
};

export default Dashboard;
