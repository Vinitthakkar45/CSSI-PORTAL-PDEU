'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import TableList from './Table/TableList';
import StageProgress from './Stages/StageProgress';
import StageCard from './Stages/StageCard';
import { stages, Stage } from './utils/stages';

type StageStatus = 'locked' | 'current' | 'completed';

const Dashboard = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  const [currentStage, setCurrentStage] = useState<number>(1);

  const [mentoredStudents, setMentoredStudents] = useState([]);
  const [evaluatedStudents, setEvaluatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedToggle, setSelectedToggle] = useState<'mentor' | 'evaluator'>('mentor'); // Toggler state

  // Fetch Faculty Student Data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('/api/faculty');
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

  if (status === 'loading' || loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const getStageStatus = (stageNumber: number): StageStatus => {
    // if (stageNumber < currentStage) return 'completed';
    // if (stageNumber === currentStage) return 'current';
    return 'current';
  };

  return (
    <>
      <div className="container pb-4 mx-auto">
        <StageProgress totalStages={stages.length} />


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stages.map((stage) => (
            <StageCard
              key={stage.number}
              number={stage.number}
              title={stage.title}
              description={stage.description}
              long_description={stage.long_description}
              status={getStageStatus(stage.number)}
            />
          ))}
        </div>
      </div>

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

      <TableList
        students={selectedToggle === 'mentor' ? mentoredStudents : evaluatedStudents}
        option={selectedToggle}
      />
    </>
  );
};

export default Dashboard;
