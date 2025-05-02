'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import StagesSection from './StagesSection';
import SkeletonLoader from './SkeletonLoader';

const Dashboard = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  if (status === 'loading') {
    return <SkeletonLoader />;
  }

  return <StagesSection />;
};

export default Dashboard;
