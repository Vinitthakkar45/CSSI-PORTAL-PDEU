import React from 'react';
import { Lock, Check, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StageStatus = 'locked' | 'unlocked' | 'current' | 'completed';

interface StageCardProps {
  number: number;
  title: string;
  description: string;
  status: StageStatus;
  onClick: () => void;
}

const StageCard: React.FC<StageCardProps> = ({ number, title, description, status, onClick }) => {
  return (
    <div
      onClick={status !== 'locked' ? onClick : undefined}
      className={cn(
        'hidden relative md:flex flex-col rounded-xl border p-6 transition-all',
        status === 'locked'
          ? 'border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed dark:border-gray-800 dark:bg-gray-900'
          : status === 'unlocked'
            ? 'border-gray-200 bg-white cursor-pointer hover:shadow-theme-md dark:border-gray-700 dark:bg-gray-800'
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
              : status === 'unlocked'
                ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
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
              status === 'unlocked'
                ? 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                : status === 'current'
                  ? 'text-brand-500 hover:bg-brand-100 dark:text-brand-400 dark:hover:bg-brand-500/20'
                  : 'text-success-500 hover:bg-success-100 dark:text-success-400 dark:hover:bg-success-500/20'
            )}
            aria-label={`Go to stage ${number}`}
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

      {status === 'unlocked' && (
        <div className="mt-auto pt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock size={12} />
            <span>Ready to start</span>
          </div>
        </div>
      )}

      {status === 'current' && (
        <div className="mt-auto pt-2">
          <div className="text-xs text-brand-500 dark:text-brand-400 flex items-center gap-1 font-medium">
            <span>Current stage</span>
          </div>
        </div>
      )}

      {status === 'completed' && (
        <div className="mt-auto pt-2">
          <div className="text-xs text-success-500 dark:text-success-400 flex items-center gap-1 font-medium">
            <Check size={12} />
            <span>Completed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageCard;
