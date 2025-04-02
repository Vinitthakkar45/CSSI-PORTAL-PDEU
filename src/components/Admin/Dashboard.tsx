'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import StageProgress from './StageProgress';
import StageCard from './StageCard';
import { stages, Stage } from './utils/stages';
import Button from '../Home/ui/button/Button';
import { InfoModal } from './AdminModals';

type StageStatus = 'locked' | 'current' | 'completed';

const Dashboard = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const [currentStage, setCurrentStage] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchstage = async () => {
      const res = await fetch('/api/stage', { method: 'GET' });
      const data = await res.json();
      const stage = data.stage[0].stage;
      setCurrentStage(stage);
    };
    fetchstage();
  }, []);

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

  const handleUnlockStage = () => {
    setShowModal(true);
  };

  const handleModalClose = async () => {
    try {
      const response = await fetch('/api/admin/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage: currentStage }),
      });

      if (response.status === 200) {
        if (currentStage < 4) {
          const res = await fetch('api/stage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentStage: Number(currentStage) }),
          });
          if (res.status === 200) {
            setCurrentStage((prev) => prev + 1);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowModal(false);
    }
  };
  const handleModalCross = () => {
    setShowModal(false);
  };

  const getStageStatus = (stageNumber: number): StageStatus => {
    if (stageNumber < currentStage) return 'completed';
    if (stageNumber === currentStage) return 'current';
    return 'locked';
  };

  return (
    <>
      {showModal && <InfoModal isOpen={showModal} onCloseCross={handleModalCross} onClose={handleModalClose} />}
      <div className="container pb-4 mx-auto">
        <StageProgress currentStage={currentStage} totalStages={stages.length} handleButtonClick={handleUnlockStage} />

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
      <div>
        <Button size="md" variant="primary" className="mr-4" onClick={handleAssignMentors}>
          Assign Mentor
        </Button>
        <Button size="md" variant="primary">
          Assign Faculty
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
