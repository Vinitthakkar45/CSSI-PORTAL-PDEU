'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import StageProgress from './StageProgress';
import StageCard from './StageCard';
import { stages } from './utils/stages';
import Button from '../Home/ui/button/Button';
import { InfoModal } from './AdminModals';

type StageStatus = 'locked' | 'current' | 'completed';

interface CountData {
  students: number;
  faculty: number;
  mentors: number;
  evaluators: number;
}

const Dashboard = () => {
  const { data: _session, status: _status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showEvaluatorModal, setShowEvaluatorModal] = useState(false);
  const [counts, setCounts] = useState<CountData>({
    students: 0,
    faculty: 0,
    mentors: 0,
    evaluators: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stage data
        const stageRes = await fetch('/api/stage', { method: 'GET' });
        const stageData = await stageRes.json();
        setCurrentStage(stageData.stage[0].stage);

        // Fetch count data
        await fetchCounts();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCounts = async () => {
    try {
      const countRes = await fetch('/api/admin/countrecords');
      const countData = await countRes.json();
      setCounts(countData);
      return countData;
    } catch (error) {
      console.error('Error fetching counts:', error);
      return null;
    }
  };

  const handleAssignMentors = async () => {
    // Fetch the latest counts before proceeding
    const currentCounts = await fetchCounts();

    if (currentCounts && currentCounts.mentors > 0) {
      // Show confirmation modal if mentors already exist
      setShowMentorModal(true);
    } else {
      // Directly assign mentors if none exist
      await assignMentors();
    }
  };

  const assignMentors = async () => {
    try {
      const response = await fetch('/api/admin/assignmentor', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        alert('Mentor Assignment Successful!');
        // Update counts after successful assignment
        await fetchCounts();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      alert('Something went wrong.');
    }
  };

  const handleReassignMentors = async () => {
    try {
      // First delete existing mentor assignments
      const deleteResponse = await fetch('/api/admin/deletementors', { method: 'DELETE' });
      if (deleteResponse.ok) {
        // Then assign new mentors
        await assignMentors();
      } else {
        const errorData = await deleteResponse.json();
        alert('Failed to delete existing mentor assignments: ' + (errorData.error || ''));
      }
    } catch (error) {
      console.error('Error in reassigning mentors:', error);
      alert('Something went wrong during mentor reassignment.');
    } finally {
      setShowMentorModal(false);
    }
  };

  const handleAssignEvaluators = async () => {
    // Fetch the latest counts before proceeding
    const currentCounts = await fetchCounts();

    if (currentCounts && currentCounts.evaluators > 0) {
      // Show confirmation modal if evaluators already exist
      setShowEvaluatorModal(true);
    } else {
      // Directly assign evaluators if none exist
      await assignEvaluators();
    }
  };

  const assignEvaluators = async () => {
    try {
      const response = await fetch('/api/admin/assignevaluator', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        alert('Evaluator Assignment Successful!');
        // Update counts after successful assignment
        await fetchCounts();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      alert('Something went wrong.');
    }
  };

  const handleReassignEvaluators = async () => {
    try {
      // First delete existing evaluator assignments
      const deleteResponse = await fetch('/api/admin/deleteevaluators', { method: 'DELETE' });
      if (deleteResponse.ok) {
        // Then assign new evaluators
        await assignEvaluators();
      } else {
        const errorData = await deleteResponse.json();
        alert('Failed to delete existing evaluator assignments: ' + (errorData.error || ''));
      }
    } catch (error) {
      console.error('Error in reassigning evaluators:', error);
      alert('Something went wrong during evaluator reassignment.');
    } finally {
      setShowEvaluatorModal(false);
    }
  };

  // if (status === 'loading') {
  //   return <p>Loading...</p>;
  // }

  const handleUnlockStage = () => {
    setShowModal(true);
  };

  const handleModalClose = async () => {
    setShowModal(false);
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleModalCross = () => {
    setShowModal(false);
  };

  const handleMentorModalClose = () => {
    setShowMentorModal(false);
  };

  const handleEvaluatorModalClose = () => {
    setShowEvaluatorModal(false);
  };

  const getStageStatus = (stageNumber: number): StageStatus => {
    if (stageNumber < currentStage) return 'completed';
    if (stageNumber === currentStage) return 'current';
    return 'locked';
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      {showModal && (
        <InfoModal
          isOpen={showModal}
          onCloseCross={handleModalCross}
          onClose={handleModalClose}
          title="Information Alert!"
          message="You are about to update the Students about the next stage unlock Via email, proceed cautiously"
          buttonInfo="Ok Got It"
        />
      )}

      {showMentorModal && (
        <InfoModal
          isOpen={showMentorModal}
          onCloseCross={handleMentorModalClose}
          onClose={handleReassignMentors}
          title="Reassign Mentors?"
          message={`${counts.mentors} mentors are already assigned. Do you want to clear existing assignments and reassign?`}
          buttonInfo="Yes, Reassign"
        />
      )}

      {showEvaluatorModal && (
        <InfoModal
          isOpen={showEvaluatorModal}
          onCloseCross={handleEvaluatorModalClose}
          onClose={handleReassignEvaluators}
          title="Reassign Evaluators?"
          message={`${counts.evaluators} evaluators are already assigned. Do you want to clear existing assignments and reassign?`}
          buttonInfo="Yes, Reassign"
        />
      )}

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
        <Button size="md" variant="primary" onClick={handleAssignEvaluators}>
          Assign Evaluator
        </Button>
      </div>
    </>
  );
};

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="text-white text-lg font-semibold animate-pulse">Loading...</div>
    </div>
  );
};

export default Dashboard;
