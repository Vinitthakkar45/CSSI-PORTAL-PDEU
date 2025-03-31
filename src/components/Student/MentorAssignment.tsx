import React from 'react';
import Button from '@/components/Home/ui/button/Button';

interface MentorAssignmentProps {
  onComplete: () => void;
}

const MentorAssignment: React.FC<MentorAssignmentProps> = ({ onComplete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-5 text-gray-800 dark:text-white/90">Mentor and Evaluator Assignment</h3>

      <div className="space-y-6">
        <div className="rounded-lg bg-gray-50 p-5 dark:bg-gray-800">
          <h4 className="text-theme-xl font-medium mb-3 text-gray-800 dark:text-white/90">Your Assigned Mentor</h4>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center dark:bg-brand-500/20">
              <span className="text-brand-500 font-semibold dark:text-brand-400">MS</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white/90">Dr. Meenakshi Sharma</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Computer Science Department</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-5 dark:bg-gray-800">
          <h4 className="text-theme-xl font-medium mb-3 text-gray-800 dark:text-white/90">Your Assigned Evaluators</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-light-100 flex items-center justify-center dark:bg-blue-light-500/20">
                <span className="text-blue-light-500 font-semibold dark:text-blue-light-400">RK</span>
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">Prof. Rakesh Kumar</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">First Evaluation</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center dark:bg-orange-500/20">
                <span className="text-orange-500 font-semibold dark:text-orange-400">SP</span>
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">Dr. Sanjeev Patel</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Second Evaluation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
          <h4 className="text-theme-xl font-medium mb-2 text-gray-800 dark:text-white/90">Evaluation Schedule</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">First Evaluation</span>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/10 dark:text-blue-light-400">
                July 15, 2024
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Second Evaluation</span>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                August 20, 2024
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
            This stage is informational only. No action is required from you at this time.
          </p>
          <Button
            onClick={() => {
              // toast.success("Stage acknowledged!");
              onComplete();
            }}
            className="bg-brand-500 hover:bg-brand-600 text-white"
          >
            Acknowledge and Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorAssignment;
