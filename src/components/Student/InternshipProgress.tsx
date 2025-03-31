import React from 'react';
import Button from '@/components/Home/ui/button/Button';

interface InternshipProgressProps {
  onComplete: () => void;
}

const InternshipProgress: React.FC<InternshipProgressProps> = ({ onComplete }) => {
  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-5 text-gray-800 dark:text-white/90">Actual Internship Process</h3>

      <div className="space-y-5">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h4 className="text-theme-xl font-medium mb-2 text-gray-800 dark:text-white/90">During this stage:</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
            <li>Work on-site with the NGO</li>
            <li>Document your daily activities</li>
            <li>Collect evidence of your work (photos, testimonials)</li>
            <li>Maintain communication with your university mentor</li>
            <li>Complete the required number of internship hours</li>
          </ul>
        </div>

        <div className="rounded-lg border border-orange-100 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
          <h4 className="text-theme-xl font-medium mb-2 text-orange-700 dark:text-orange-400">Important:</h4>
          <p className="text-sm text-orange-600 dark:text-orange-300">
            This stage requires physical presence at the NGO location. Make sure to follow all safety protocols and
            guidelines. Only mark this stage as complete when you have finished your required internship hours.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button onClick={handleComplete} className="bg-brand-500 hover:bg-brand-600 text-white">
            Mark Internship as Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InternshipProgress;
