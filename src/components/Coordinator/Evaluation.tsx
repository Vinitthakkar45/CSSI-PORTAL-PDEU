'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import TableList from './Table/TableList';
import { SelectStudent } from '@/drizzle/schema';
import EvalSekele from './Skeletons/Evaluation';

const Dashboard = () => {
  const session = useSession();

  const [mentoredStudents, setMentoredStudents] = useState<SelectStudent[]>([]);
  const [evaluatedStudents, setEvaluatedStudents] = useState<SelectStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedToggle, setSelectedToggle] = useState<'mentor' | 'evaluator'>('mentor'); // Toggler state
  const [marksToggle, setMarksToggle] = useState<boolean>(false); // Toggler state

  // Fetch Faculty Student Data
  useEffect(() => {
    console.log('Hello');
    const fetchStudentData = async () => {
      try {
        console.log('Hello ' + session.data?.user.role);
        const response = await fetch(`/api/coord/evaluate?facultyId=${session?.data?.user.id}`); // Replace with actual faculty ID
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setMentoredStudents(data.mentoredStudents || []);
        setEvaluatedStudents(data.evaluatedStudents || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <>
      {/* <div> */}
      <div className="flex mb-2">
        <button
          className={`px-4 py-2 rounded-l-lg shadow-md transition-colors duration-300 border border-gray-500 ${
            selectedToggle === 'mentor'
              ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400'
              : 'text-gray-700 hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300'
          }`}
          onClick={() => setSelectedToggle('mentor')}
        >
          Mentored Students
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg shadow-md transition-colors duration-300 border border-gray-500  ${
            selectedToggle === 'evaluator'
              ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400'
              : 'text-gray-700 hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300'
          }`}
          onClick={() => setSelectedToggle('evaluator')}
        >
          Evaluated Students
        </button>
      </div>

      {loading || error ? (
        error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <EvalSekele />
        )
      ) : (selectedToggle === 'mentor' && mentoredStudents.length > 0) ||
        (selectedToggle != 'mentor' && evaluatedStudents.length > 0) ? (
        <TableList
          students={selectedToggle === 'mentor' ? mentoredStudents : evaluatedStudents}
          option={selectedToggle}
          setMarksToggle={setMarksToggle}
          marksToggle={marksToggle}
          setStudents={selectedToggle === 'mentor' ? setMentoredStudents : setEvaluatedStudents}
        />
      ) : (
        <p className="m-4">Students are yet to be assigned !</p>
      )}
    </>
  );
};

export default Dashboard;
