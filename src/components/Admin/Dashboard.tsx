'use client';
import { useSession } from 'next-auth/react';
import RecentOrders from '../Home/ecommerce/RecentOrders';
import { useState } from 'react';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [selected, setSelected] = useState<'optionOne' | 'optionTwo'>('optionTwo');

  const getButtonClass = (option: 'optionOne' | 'optionTwo') =>
    selected === option
      ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400';

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>Please sign in.</p>;
  }

  return (
    <div className="text-amber-100">
      <p>ADMIN DASHBOARD</p>
      <p>Welcome, {session?.user?.role}!</p>
      <p>Welcome, {session?.user?.email}!</p>
      <p>Welcome, {session?.user?.name}!</p>
      <p>Welcome, {session?.user?.id}!</p>
      <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
        <button
          onClick={() => setSelected('optionOne')}
          className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
            'optionOne'
          )}`}
        >
          Students
        </button>

        <button
          onClick={() => setSelected('optionTwo')}
          className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
            'optionTwo'
          )}`}
        >
          Faculty
        </button>
      </div>
      <div className="mt-5">
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;
