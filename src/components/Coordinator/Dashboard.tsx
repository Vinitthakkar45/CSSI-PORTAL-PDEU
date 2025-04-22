'use client';
import React, { useEffect, useState } from 'react';
import StageCard from './StageCard';
import StageProgress from './StageProgress';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { stages } from './utils/stages';
import Button from '../Home/ui/button/Button';

type StageStatus = 'locked' | 'current' | 'completed';

const Dashboard = () => {
  const { data: _session, status: _status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  const [currentStage, setCurrentStage] = useState<number>(0);
  const handleAssignMentors = () => {
    console.log('I was clicked');
  };
  useEffect(() => {
    async function fetchStage() {
      try {
        const response = await fetch('/api/stage', { method: 'GET' });
        const data = await response.json();
        setCurrentStage(data.stage[0].stage);
      } catch (error) {
        console.log(error);
      }
    }

    fetchStage();
  }, []);
  const getStageStatus = (stageNumber: number): StageStatus => {
    if (stageNumber < currentStage) return 'completed';
    if (stageNumber === currentStage) return 'current';
    return 'locked';
  };

  return (
    <>
      <div className="container pb-4 mx-auto">
        <StageProgress currentStage={currentStage} totalStages={stages.length} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stages.map((stage) => (
            <StageCard
              key={stage.number}
              number={stage.number}
              title={stage.title}
              description={stage.description}
              status={getStageStatus(stage.number)}
            />
          ))}
        </div>
      </div>
      <Button onClick={handleAssignMentors}>Assign Mentors</Button>
    </>
  );
};

export default Dashboard;
