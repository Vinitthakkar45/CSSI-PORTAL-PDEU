import { useState } from 'react';
import { Stage } from '../data/stages';
import { StageStatus } from '../StageCard';

interface UseStagesProps {
  stages: Stage[];
}

export const useStages = ({ stages }: UseStagesProps) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [activeForm, setActiveForm] = useState<number | null>(null);

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

  const handleStageComplete = () => {
    if (currentStage < stages.length) {
      setCurrentStage((prev) => prev + 1);
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
  };
};
