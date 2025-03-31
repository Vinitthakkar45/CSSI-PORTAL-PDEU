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

  const handleAssignMentors = async () => {
    try {
      const response = await fetch('/api/admin/assignmentor', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        alert('Mentor Assignment Successful!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      alert('Something went wrong.');
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <>
      <button
        className="m-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        onClick={() => handleAssignMentors()}
      >
        Assign Mentor
      </button>
      <button className="m-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
        Assign Faculty
      </button>
    </>
  );
};

export default Dashboard;
