'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import StageProgress from './StageProgress';
import StageCard from './StageCard';
import { stages } from './utils/stages';
import Button from '../Home/ui/button/Button';
import { InfoModal } from '../ConfirmationModals';
import DashboardSkeleton from './skeletons/DashBoardSkele';
import { toast } from '../Home/ui/toast/Toast';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
type StageStatus = 'locked' | 'current' | 'completed';

interface CountData {
  students: number;
  faculty: number;
  mentors: number;
  evaluators: number;
}

type Student = {
  rollNumber: string | null;
  department: string | null;
};

type Faculty = {
  name: string;
  department: string;
  students: Student[];
};

const Dashboard = () => {
  const { data: _session, status: _status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [mentorLoading, setMentorLoading] = useState(false);
  const [evaluatorLoading, setEvaluatorLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [showEvaluatorModal, setShowEvaluatorModal] = useState(false);
  const [showAllAssignedModal, setShowAllAssignedModal] = useState(false);
  const [showRemainingModal, setShowRemainingModal] = useState(false);
  const [remainingStudents, setRemainingStudents] = useState(0);
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
    // First check if all students already have mentors
    const currentCounts = await fetchCounts();

    if (currentCounts && currentCounts.students === currentCounts.mentors) {
      // All students already have mentors
      setShowAllAssignedModal(true);
      return;
    }

    // If some students don't have mentors yet
    if (currentCounts) {
      const remaining = currentCounts.students - currentCounts.mentors;
      setRemainingStudents(remaining);
      setShowRemainingModal(true);
    } else {
      // If counts couldn't be fetched, proceed with assignment anyway
      await assignMentors();
    }
  };

  const assignMentors = async () => {
    setMentorLoading(true);
    try {
      const response = await fetch('/api/admin/assignmentor', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully assigned ${data.assignedCount || 'all remaining'} students to mentors`);
      } else if (data.allAssigned) {
        setShowAllAssignedModal(true);
      } else {
        toast.error('Error: ' + (data.error || data.message || 'Unknown error'));
      }

      // Update counts after assignment attempt
      await fetchCounts();
    } catch (error) {
      console.error('Error calling API:', error);
      toast.error('Something went wrong.');
    } finally {
      setMentorLoading(false);
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
    setEvaluatorLoading(true);
    try {
      const response = await fetch('/api/admin/assignevaluator', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        toast.success('Evaluator Assignment Successful!');
        // Update counts after successful assignment
        await fetchCounts();
      } else {
        toast.error('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      toast.error('Something went wrong.');
    } finally {
      setEvaluatorLoading(false);
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
        toast.error('Failed to delete existing evaluator assignments: ' + (errorData.error || ''));
      }
    } catch (error) {
      console.error('Error in reassigning evaluators:', error);
      toast.error('Something went wrong during evaluator reassignment.');
    } finally {
      setShowEvaluatorModal(false);
    }
  };

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

  const handleEvaluatorModalClose = () => {
    setShowEvaluatorModal(false);
  };

  const handleAllAssignedModalClose = () => {
    setShowAllAssignedModal(false);
  };

  const handleRemainingModalCross = () => {
    setShowRemainingModal(false);
  };

  const handleRemainingModalClose = async () => {
    setShowRemainingModal(false);
    await assignMentors();
  };

  const getStageStatus = (stageNumber: number): StageStatus => {
    if (stageNumber < currentStage) return 'completed';
    if (stageNumber === currentStage) return 'current';
    return 'locked';
  };

  const handleEvaluatorExcelDownload = async () => {
    try {
      const res = await fetch('/api/admin/getEvaluatorExcel');

      if (!res.ok) throw new Error('Failed to fetch evaluator data');

      const data: Faculty[] = await res.json();

      const rows: {
        'Faculty Name': string;
        'Faculty Department': string;
        'Student Roll Number': string | null;
        'Student Department': string | null;
      }[] = [];

      data.forEach((faculty) => {
        faculty.students.forEach((student, index) => {
          rows.push({
            'Faculty Name': index === 0 ? faculty.name : '',
            'Faculty Department': index === 0 ? faculty.department : '',
            'Student Roll Number': student.rollNumber,
            'Student Department': student.department,
          });
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Evaluators');

      XLSX.writeFile(workbook, 'evaluator_list.xlsx');
      toast.success('Excel sheet downloaded successfully');
    } catch (err) {
      console.error('Failed to generate Excel:', err);
    }
  };

  return (
    <>
      {isLoading ? (
        <DashboardSkeleton />
      ) : mentorLoading ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-semibold mb-2">Assigning Mentors</h3>
          <p className="text-gray-500 text-center max-w-md">
            This may take a while as we efficiently match faculty to students based on departments and availability.
          </p>
          <div className="mt-8 w-full max-w-md bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      ) : evaluatorLoading ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-semibold mb-2">Assigning Evaluators</h3>
          <p className="text-gray-500 text-center max-w-md">
            Please wait while we distribute students evenly among faculty evaluators for fair assessment.
          </p>
          <div className="mt-8 w-full max-w-md bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      ) : (
        <>
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

          {showRemainingModal && (
            <InfoModal
              isOpen={showRemainingModal}
              onCloseCross={handleRemainingModalCross}
              onClose={handleRemainingModalClose}
              title="Assign Remaining Students"
              message={`${remainingStudents} students don't have mentors yet. Do you want to assign mentors to these remaining students?`}
              buttonInfo="Yes, Assign Remaining"
            />
          )}

          {showAllAssignedModal && (
            <InfoModal
              isOpen={showAllAssignedModal}
              onCloseCross={handleAllAssignedModalClose}
              onClose={handleAllAssignedModalClose}
              title="All Students Assigned"
              message="All students already have mentors assigned. No new assignments needed."
              buttonInfo="OK"
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
            <StageProgress
              currentStage={currentStage}
              totalStages={stages.length}
              handleButtonClick={handleUnlockStage}
            />

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
          <Button size="md" variant="outline" className="mr-4 mt-4" onClick={handleEvaluatorExcelDownload}>
            <Download /> Evaluator Excel
          </Button>
        </>
      )}
    </>
  );
};

export default Dashboard;
