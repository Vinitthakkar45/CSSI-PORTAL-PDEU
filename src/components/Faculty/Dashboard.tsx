'use client';
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>Please sign in.</p>;
  }

  return (
    <div className="text-amber-100">
      <p>FACULTY DASHBOARD</p>
      <p>Welcome, {session?.user?.role}!</p>
      <p>Welcome, {session?.user?.email}!</p>
      <p>Welcome, {session?.user?.name}!</p>
      <p>Welcome, {session?.user?.id}!</p>
    </div>
  );
};

export default Dashboard;
