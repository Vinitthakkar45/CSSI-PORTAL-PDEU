import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Lock } from 'lucide-react';

interface StageProgressProps {
  currentStage: number;
  totalStages: number;
  handleStageClick: (stageNumber: number) => void;
}

const StageProgress: React.FC<StageProgressProps> = ({ currentStage, totalStages, handleStageClick }) => {
  const stageLabels = ['Select', 'Internship', 'Uploads', 'Grade'];

  return (
    <div className="w-full lg:mb-4 mx-auto">
      <div className="flex items-cente justify-between gap-20">
        <div className="w-full flex flex-col ">
          <div className="flex justify-between items-center">
            <h3 className="text-theme-xl font-normal text-gray-800 dark:text-white/90">Internship Progress</h3>
            <span className="text-theme-sm font-medium px-3 py-1 rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400">
              Stage {currentStage} of {totalStages}
            </span>
          </div>

          <div className="mt-2 md:mt-6 relative">
            <div className="absolute top-5 left-1 right-1 h-1 bg-gray-200 dark:bg-gray-700 z-0">
              <div
                className="h-full bg-brand-500 dark:bg-brand-400 transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStage - 1) / (totalStages - 1)) * 100}%` }}
              />
            </div>

            <div className="relative z-10 flex justify-between">
              {stageLabels.map((label, index) => {
                const stageNumber = index + 1;
                const isCompleted = stageNumber < currentStage;
                const isCurrent = stageNumber === currentStage;
                const isLocked = stageNumber > currentStage;
                return (
                  <div
                    key={stageNumber}
                    onClick={() => handleStageClick(stageNumber)}
                    className="flex flex-col items-center hover:cursor-pointer"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                        isCompleted
                          ? 'bg-success-500 text-white dark:bg-success-500'
                          : isCurrent
                            ? 'bg-brand-500 text-white dark:bg-brand-500'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      )}
                    >
                      {isCompleted ? (
                        <Check size={20} />
                      ) : isLocked ? (
                        <Lock size={18} />
                      ) : (
                        <span className="text-base font-semibold">{stageNumber}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-2 text-theme-sm text-center',
                        isCompleted
                          ? 'text-success-700 dark:text-success-400'
                          : isCurrent
                            ? 'text-brand-700 font-medium dark:text-brand-400'
                            : 'text-gray-500 dark:text-gray-400'
                      )}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="hidden md:flex justify-end items-center gap-8">
          {[
            { initials: 'TBA', label: 'Mentor' },
            { initials: 'TBA', label: 'Evaluator' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <div className="w-24 h-24 flex items-center justify-center text-xl font-semibold text-white bg-gray-400 dark:bg-gray-600 rounded-full">
                {item.initials}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StageProgress;
