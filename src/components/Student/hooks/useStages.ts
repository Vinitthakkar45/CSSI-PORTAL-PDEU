import { useState, useEffect } from 'react';
import { Stage } from '../data/stages';
import { StageStatus } from '../StageCard';
import { useSession } from 'next-auth/react';

interface UseStagesProps {
  stages: Stage[];
}

export const useStages = ({ stages }: UseStagesProps) => {
  const [maxStageUnlocked, setMaxStageUnlocked] = useState(1);
  const [currentStage, setCurrentStage] = useState(1);
  const [activeForm, setActiveForm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchStageData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const stageResponse = await fetch(`/api/stage`);
        if (!stageResponse.ok) {
          throw new Error('Failed to fetch current allowed stage');
        }
        const stageData = await stageResponse.json();
        const systemMaxStage = stageData.stage[0].stage || 1;
        setMaxStageUnlocked(systemMaxStage);

        const response = await fetch(`/api/user/getUserById?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();

        if (userData && userData.profileData && userData.role === 'student') {
          const userStage = userData.profileData.stage || 0;

          setCurrentStage(Math.min(userStage, systemMaxStage));

          localStorage.setItem(
            `studentStage_${userId}`,
            JSON.stringify({
              stage: Math.min(userStage, systemMaxStage),
              maxStageUnlocked: systemMaxStage,
            })
          );
        }
      } catch (err) {
        console.error('Error fetching stage data:', err);

        const localStorageKey = `studentStage_${userId}`;
        const storedStage = localStorage.getItem(localStorageKey);

        if (storedStage) {
          try {
            const parsedStage = JSON.parse(storedStage);
            setCurrentStage(parsedStage.stage);
            setMaxStageUnlocked(parsedStage.maxStageUnlocked || 1);
          } catch (e) {
            console.error('Error parsing stage data from local storage:', e);
            setCurrentStage(1);
            setMaxStageUnlocked(1);
          }
        } else {
          setCurrentStage(1);
          setMaxStageUnlocked(1);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStageData();
  }, [userId, currentYear]);

  const getStageStatus = (stageNumber: number): StageStatus => {
    if (stageNumber < currentStage) return 'completed';
    if (stageNumber === currentStage) return 'current';
    if (stageNumber <= maxStageUnlocked) return 'unlocked';
    return 'locked';
  };

  const handleStageClick = (stageNumber: number) => {
    if (stageNumber <= maxStageUnlocked) {
      setActiveForm(stageNumber);
    }
  };

  const handleStageComplete = async (stage: number) => {
    if (stage !== currentStage) {
      setActiveForm(null);
      return;
    }

    if (stage <= maxStageUnlocked && stage < stages.length) {
      const newStage = stage + 1;

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
          throw new Error('Error updating stage');
        }

        setCurrentStage(newStage);

        if (userId) {
          localStorage.setItem(
            `studentStage_${userId}`,
            JSON.stringify({
              stage: newStage,
              maxStageUnlocked,
            })
          );
        }
      } catch (err) {
        console.error('Error updating stage:', err);
      }
    } else {
      setCurrentStage(5);
    }

    setActiveForm(null);
  };

  return {
    currentStage,
    maxStageUnlocked,
    activeForm,
    getStageStatus,
    handleStageClick,
    handleStageComplete,
    setActiveForm,
    isLoading,
  };
};
