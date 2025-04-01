import React from 'react';
import { Lock, Check, ArrowRight, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModal } from '@/hooks/useModal';
import DefaultModal from '../Modal/DefaultModal';

type StageStatus = 'locked' | 'current' | 'completed';

interface StageCardProps {
  number: number;
  title: string;
  description: string;
  long_description: string;
  status: StageStatus;
}

const StageCard: React.FC<StageCardProps> = ({ number, title, description, long_description, status }) => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div
        className={cn(
          'relative lg:flex flex-col rounded-xl border p-6 transition-all hidden',
          'border-brand-200 bg-brand-50 shadow-theme-md cursor-pointer hover:shadow-theme-lg dark:border-brand-500/30 dark:bg-brand-500/[0.12]'
        )}
        onClick={openModal}
      >
        <div className="flex justify-between items-center mb-4">
          <div
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full',
              'bg-brand-100 text-brand-500 dark:bg-brand-500/30 dark:text-brand-400'
            )}
          >
            <span className="text-base font-semibold">{number}</span>
          </div>

          {status !== 'locked' && (
            <button
              className={cn(
                'flex items-center justify-center rounded-full p-2',
                'text-brand-500  dark:text-brand-400 '
              )}
            ></button>
          )}
        </div>

        <h3 className={cn('text-lg font-semibold mb-2', 'text-gray-800 dark:text-white/90')}>{title}</h3>

        <p
          className={cn(
            'text-sm mb-4',
            status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
          )}
        >
          {description}
        </p>
      </div>
      <DefaultModal
        stage_data={{ number, title, description, long_description }}
        closeModal={closeModal}
        isOpen={isOpen}
      />
    </>
  );
};

export default StageCard;
