// Updated Dashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import StageCard from './StageCard';
import StageProgress from './StageProgress';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { stages } from './utils/stages';
import Button from '../Home/ui/button/Button';
import { InfoModal } from '../ConfirmationModals';
import LoadingOverlay from '../LoadingOverlay';
import { faculty, SelectStudent } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';
import DashboardSkeleton from './Skeletons/DashBoardSkele';
type StageStatus = 'locked' | 'current' | 'completed';

type FacultyWithUser = {
  faculty: InferSelectModel<typeof faculty>;
  user: {
    email: string | null;
    role: string | null;
  };
};

type StudentWithUser = {
  student: SelectStudent;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

const Dashboard = () => {
  const { data: _session, status: _status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const session = useSession();
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [faculties, setFaculties] = useState<FacultyWithUser[]>([]);
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchStage() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/stage', { method: 'GET' });
        const data = await response.json();
        setCurrentStage(data.stage[0].stage);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStage();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const id = session.data?.user.id;

      const facultyres = await fetch('/api/coord/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const facdata = await facultyres.json();
      const studentres = await fetch('/api/coord/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const studata = await studentres.json();

      // Set state
      setFaculties(facdata);
      setStudents(studata);

      // Return actual data immediately
      return { facdata, studata };
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Failed to fetch faculty and student data');
      setShowErrorModal(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignMentors = async () => {
    setIsLoading(true);
    try {
      const { facdata, studata } = await fetchData();

      if (facdata.length === 0 || studata.length === 0) {
        setErrorMessage('Insufficient data: Need both faculty and student information');
        setShowErrorModal(true);
        return;
      }

      // Now that you have valid data, proceed
      setShowMentorModal(true);
    } catch (error) {
      console.error('Error processing mentor assignment:', error);
      setErrorMessage('Failed to prepare mentor assignment data');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAssignMentors = async () => {
    setShowMentorModal(false);
    setIsLoading(true);

    try {
      const assignResponse = await fetch('/api/coord/assignmentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students: students,
          faculties: faculties,
        }),
      });

      const assignData = await assignResponse.json();

      if (assignData.success) {
        setSuccessMessage(`Mentors assigned successfully!`);
        setShowSuccessModal(true);
      } else {
        if (assignData.alreadyAssigned) {
          setErrorMessage(
            `Mentor assignment not allowed. Mentors have already been assigned for ${assignData.department} department students.`
          );
        } else {
          setErrorMessage('Failed to assign mentors: ' + (assignData.error || 'Unknown error'));
        }
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error assigning mentors:', error);
      setErrorMessage('An error occurred while assigning mentors');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStageStatus = (stageNumber: number): StageStatus => {
    if (stageNumber < currentStage) return 'completed';
    if (stageNumber === currentStage) return 'current';
    return 'locked';
  };

  return (
    <>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {showMentorModal && (
            <InfoModal
              isOpen={showMentorModal}
              onCloseCross={() => setShowMentorModal(false)}
              onClose={confirmAssignMentors}
              title="Confirm Mentor Assignment"
              message={`You are about to assign ${faculties.length} faculty members as mentors to ${students.length} students. This action cannot be undone. Do you want to proceed?`}
              buttonInfo="Yes, Assign Mentors"
            />
          )}

          {showErrorModal && (
            <InfoModal
              isOpen={showErrorModal}
              onCloseCross={() => setShowErrorModal(false)}
              onClose={() => setShowErrorModal(false)}
              title="Error"
              message={errorMessage}
              buttonInfo="OK"
            />
          )}

          {showSuccessModal && (
            <InfoModal
              isOpen={showSuccessModal}
              onCloseCross={() => setShowSuccessModal(false)}
              onClose={() => setShowSuccessModal(false)}
              title="Success"
              message={successMessage}
              buttonInfo="OK"
            />
          )}

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
      )}
    </>
  );
};

export default Dashboard;
