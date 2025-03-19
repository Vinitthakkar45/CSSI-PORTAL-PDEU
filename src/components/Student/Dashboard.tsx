'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

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
    <div className="text-amber-100">
      <p>STUDENT DASHBOARD</p>
      <p>Welcome, {session?.user?.role}!</p>
      <p>Welcome, {session?.user?.email}!</p>
      <p>Welcome, {session?.user?.name}!</p>
      <p>Welcome, {session?.user?.id}!</p>
    </div>
  );
};

export default Dashboard;
