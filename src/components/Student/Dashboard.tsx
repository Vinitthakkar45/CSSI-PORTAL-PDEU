'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import StagesSection from './StagesSection';

const Dashboard = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
      <StagesSection />
    </div>
  );
};

export default Dashboard;
