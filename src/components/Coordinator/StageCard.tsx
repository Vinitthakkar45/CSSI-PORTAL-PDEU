import React from 'react';
import { Lock, Check, ArrowRight, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type StageStatus = 'locked' | 'current' | 'completed';

interface StageCardProps {
  number: number;
  title: string;
  description: string;
  status: StageStatus;
}

const StageCard: React.FC<StageCardProps> = ({ number, title, description, status }) => {
  return (
    <div
      className={cn(
        'relative lg:flex flex-col rounded-xl border p-6 transition-all hidden',
        status === 'locked'
          ? 'border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed dark:border-gray-800 dark:bg-gray-900'
          : status === 'current'
            ? 'border-brand-200 bg-brand-50 shadow-theme-md cursor-pointer hover:shadow-theme-lg dark:border-brand-500/30 dark:bg-brand-500/[0.12]'
            : 'border-success-200 bg-success-50 cursor-pointer hover:shadow-theme-md dark:border-success-500/30 dark:bg-success-500/[0.12]'
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            status === 'locked'
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              : status === 'current'
                ? 'bg-brand-100 text-brand-500 dark:bg-brand-500/30 dark:text-brand-400'
                : 'bg-success-100 text-success-500 dark:bg-success-500/30 dark:text-success-400'
          )}
        >
          {status === 'locked' ? (
            <Lock size={18} />
          ) : status === 'completed' ? (
            <Check size={18} />
          ) : (
            <span className="text-base font-semibold">{number}</span>
          )}
        </div>

        {status !== 'locked' && (
          <button
            className={cn(
              'flex items-center justify-center rounded-full p-2',
              status === 'current' ? 'text-brand-500  dark:text-brand-400 ' : 'text-success-500  dark:text-success-400 '
            )}
          >
            <ArrowRight size={18} />
          </button>
        )}
      </div>

      <h3
        className={cn(
          'text-lg font-semibold mb-2',
          status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-white/90'
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          'text-sm mb-4',
          status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
        )}
      >
        {description}
      </p>

      {status === 'locked' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 rounded-xl dark:bg-black/20">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 flex items-center gap-2 shadow-theme-md">
            <Lock size={16} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Locked</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageCard;
