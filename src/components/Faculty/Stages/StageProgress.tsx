import React, { use, useState } from 'react';
import { cn } from '@/lib/utils';
import { useModal } from '@/hooks/useModal';
import DefaultModal from '../Modal/DefaultModal';

import { stages } from '../utils/stages';

interface StageProgressProps {
  totalStages: number;
}

const StageProgress: React.FC<StageProgressProps> = ({ totalStages }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const stageLabels = ['Select', 'Internship', 'Uploads', 'Grade'];
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className="w-full lg:mb-4 mx-auto">
        <div className="lg:flex items-center">
          <div className="w-full flex flex-col ">
            <div className="flex justify-between items-center">
              <h3 className="text-theme-xl font-normal text-gray-800 dark:text-white/90">Internship Timeline</h3>
            </div>

            <div className="mt-2 md:mt-6 relative">
              <div className="absolute top-5 left-1 right-1 h-1 bg-gray-200 dark:bg-gray-700 z-0">
                <div
                  className="h-full bg-brand-500 dark:bg-brand-400 transition-all duration-500 ease-in-out"
                  style={{ width: `${((4 - 1) / (totalStages - 1)) * 100}%` }}
                />
              </div>

              <div className="relative z-10 flex justify-between">
                {stageLabels.map((label, index) => {
                  const stageNumber = index + 1;
                  return (
                    <div
                      onClick={() => {
                        setCurrentStage(index);
                        openModal();
                      }}
                      key={stageNumber}
                      className="flex flex-col items-center hover:cursor-pointer"
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                          'bg-brand-500 text-white dark:bg-brand-500'
                        )}
                      >
                        {<span className="text-base font-semibold">{stageNumber}</span>}
                      </div>
                      <span
                        className={cn('mt-2 text-theme-sm text-center', 'text-brand-700 font-medium text-white-400')}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={`lg:min-w-40 mt-6 ${4 < 4 ? '' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}></div>
        </div>
      </div>
      <DefaultModal stage_data={stages[currentStage]} closeModal={closeModal} isOpen={isOpen} />
    </>
  );
};

export default StageProgress;
