import { useState, useEffect } from 'react';
import { Stage } from '../data/stages';
import { StageStatus } from '../StageCard';
import { useSession } from 'next-auth/react';

interface UseStagesProps {
  stages: Stage[];
}

export const useStages = ({ stages }: UseStagesProps) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [activeForm, setActiveForm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchCurrentStage = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const localStorageKey = `studentStage_${userId}`;
        const storedStage = localStorage.getItem(localStorageKey);

        if (storedStage) {
          const parsedStage = JSON.parse(storedStage);
          setCurrentStage(parsedStage.stage);
          console.log('Stage loaded from localStorage:', parsedStage.stage);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/user/getUserById?userId=${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();

        if (userData && userData.profileData && userData.role === 'student') {
          const userStage = userData.profileData.stage || 1;
          setCurrentStage(userStage);

          localStorage.setItem(localStorageKey, JSON.stringify({ stage: userStage }));
          console.log('Stage fetched from API and saved to localStorage:', userStage);
        }
      } catch (err) {
        console.error('Error fetching current stage:', err);
        setCurrentStage(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentStage();
  }, [userId]);

  const getStageStatus = (stageNumber: number): StageStatus => {
    if (stageNumber < currentStage) return 'completed';
    if (stageNumber === currentStage) return 'current';
    return 'locked';
  };

  const handleStageClick = (stageNumber: number) => {
    if (stageNumber <= currentStage) {
      setActiveForm(stageNumber);
    }
  };

  const handleStageComplete = async () => {
    if (currentStage < stages.length) {
      const newStage = currentStage + 1;

      setCurrentStage(newStage);

      if (userId) {
        localStorage.setItem(`studentStage_${userId}`, JSON.stringify({ stage: newStage }));
      }

      try {
        const response = await fetch('/api/student/update-stage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            stage: newStage,
          }),
        });

        if (!response.ok) {
          console.error('Failed to update stage in database');
        } else {
          console.log('Stage updated successfully in database');
        }
      } catch (err) {
        console.error('Error updating stage:', err);
      }
    }
    setActiveForm(null);
  };

  return {
    currentStage,
    activeForm,
    getStageStatus,
    handleStageClick,
    handleStageComplete,
    setActiveForm,
    isLoading,
  };
};
