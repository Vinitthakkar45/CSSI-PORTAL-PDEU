import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/context/SidebarContext';
import { Check, Lock, CircleDot } from 'lucide-react';

interface StageProgressProps {
  currentStage: number;
  totalStages: number;
}

const StageProgress: React.FC<StageProgressProps> = ({ currentStage, totalStages }) => {
  const { isMobile } = useSidebar();

  const stageLabels = ['Select', 'Work', 'Docs', 'Eval'];

  if (isMobile) {
    return (
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-theme-xl font-normal text-gray-800 dark:text-white/90">Internship Progress</h3>
          <span className="text-theme-sm font-medium px-3 py-1 rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400">
            Stage {currentStage} of {totalStages}
          </span>
        </div>

        <div className="mt-6 relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-0">
            <div
              className="h-full bg-brand-500 dark:bg-brand-400 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStage - 1) / (totalStages - 1)) * 100}%` }}
            />
          </div>

          {/* Circular steps */}
          <div className="relative z-10 flex justify-between">
            {stageLabels.map((label, index) => {
              const stageNumber = index + 1;
              const isCompleted = stageNumber < currentStage;
              const isCurrent = stageNumber === currentStage;
              const isLocked = stageNumber > currentStage;

              return (
                <div key={stageNumber} className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      isCompleted
                        ? 'bg-success-500 text-white dark:bg-success-500'
                        : isCurrent
                          ? 'bg-brand-500 text-white dark:bg-brand-500'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check size={18} />
                    ) : isLocked ? (
                      <Lock size={16} />
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
    );
  }

  // Desktop view (original progress bar)
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-theme-xl font-normal text-gray-800 dark:text-white/90">Internship Progress</h3>
        <span className="text-theme-sm font-medium px-3 py-1 rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400">
          Stage {currentStage} of {totalStages}
        </span>
      </div>

      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden dark:bg-gray-800">
        <div
          className="h-full bg-brand-500 dark:bg-brand-400 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStage / totalStages) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StageProgress;
