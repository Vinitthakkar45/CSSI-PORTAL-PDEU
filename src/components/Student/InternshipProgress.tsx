import React from 'react';
import Button from '@/components/Home/ui/button/Button';
import DropzoneComponent from '@/components/Home/form/form-elements/DropZone';

interface InternshipProgressProps {
  onComplete: () => void;
}

const InternshipProgress: React.FC<InternshipProgressProps> = ({ onComplete }) => {
  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="mt-8 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-5 text-gray-800 dark:text-white/90">Actual Internship Process</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            Week 1 Photos <span className="text-error-500">*</span>
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload photos from your first week of internship showing your active participation and engagement with the
            NGO activities
          </p>
          <div className="dark:border-gray-700">
            <DropzoneComponent onDrop={() => {}} isLoading={false} title="" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            Week 2 Photos <span className="text-error-500">*</span>
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload photos from your second week showing the progress and impact of your work at the NGO
          </p>
          <div className="dark:border-gray-700">
            <DropzoneComponent onDrop={() => {}} isLoading={false} title="" />
          </div>
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
