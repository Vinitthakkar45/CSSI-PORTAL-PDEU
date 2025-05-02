'use client';
import React, { useState, useEffect } from 'react';
import DropzoneComponent from '@/components/Home/form/form-elements/DropZone';
import { toast } from '../Home/ui/toast/Toast';
import { useSession } from 'next-auth/react';

interface WeekPhotoProps {
  onComplete: () => void;
}

const WeekPhoto: React.FC<WeekPhotoProps> = ({ onComplete }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isLoading, setIsLoading] = useState({ weekOne: false, weekTwo: false });
  const [hasUploaded, setHasUploaded] = useState({ weekOne: false, weekTwo: false });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const checkUploadStatus = () => {
        try {
          const storedData = localStorage.getItem('userData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setHasUploaded({
              weekOne: !!parsedData.profileData?.week_one_photo,
              weekTwo: !!parsedData.profileData?.week_two_photo,
            });
          }
        } catch (err) {
          console.error('Error checking upload status:', err);
        }
      };
      checkUploadStatus();
    }
  }, [userId]);

  const handleFileUpload = async (folderName: string, file: File, weekType: 'weekOne' | 'weekTwo') => {
    if (!userId) {
      setError('User ID not found. Please try logging in again.');
      return;
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
      setError('Only JPG, PNG, and WebP images are allowed');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setError('File size must be less than 1MB');
      return;
    }

    setError(null);
    setIsLoading({ ...isLoading, [weekType]: true });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('folderName', folderName);

      const response = await fetch('/api/student/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
      }

      // Update local state
      const updatedUploadStatus = { ...hasUploaded, [weekType]: true };
      setHasUploaded(updatedUploadStatus);

      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.profileData = userData.profileData || {};
      userData.profileData[weekType === 'weekOne' ? 'week_one_photo' : 'week_two_photo'] = file.name;
      localStorage.setItem('userData', JSON.stringify(userData));

      toast.success(`${weekType === 'weekOne' ? 'Week 1' : 'Week 2'} photo uploaded successfully!`);

      // Check if both photos are now uploaded
      if (updatedUploadStatus.weekOne && updatedUploadStatus.weekTwo) {
        onComplete();
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      toast.error(`Failed to upload ${weekType === 'weekOne' ? 'Week 1' : 'Week 2'} photo`);
    } finally {
      setIsLoading({ ...isLoading, [weekType]: false });
    }
  };

  const handleWeekOnePhotoDrop = (files: File[]) => {
    if (files && files.length > 0) {
      handleFileUpload('WeekOnePhoto', files[0], 'weekOne');
    }
  };

  const handleWeekTwoPhotoDrop = (files: File[]) => {
    if (files && files.length > 0) {
      handleFileUpload('WeekTwoPhoto', files[0], 'weekTwo');
    }
  };

  return (
    <div className="mt-4 md:mt-8">
      <div className="mb-4 flex flex-col gap-2">
        <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
          Week 1 Photo <span className="text-error-500">*</span>
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload photos from your first week of internship showing your active participation and engagement with the NGO
          activities
        </p>
        <div className={hasUploaded.weekOne ? 'border-2 border-success-500 rounded-xl p-1' : 'dark:border-gray-700'}>
          <DropzoneComponent onDrop={handleWeekOnePhotoDrop} isLoading={isLoading.weekOne} title="" />
        </div>
        {hasUploaded.weekOne && (
          <p className="text-sm text-success-500 font-medium">Week 1 photo uploaded successfully!</p>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
          Week 2 Photo <span className="text-error-500">*</span>
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload photos from your second week showing the progress and impact of your work at the NGO
        </p>
        <div className={hasUploaded.weekTwo ? 'border-2 border-success-500 rounded-xl p-1' : 'dark:border-gray-700'}>
          <DropzoneComponent onDrop={handleWeekTwoPhotoDrop} isLoading={isLoading.weekTwo} title="" />
        </div>
        {hasUploaded.weekTwo && (
          <p className="text-sm text-success-500 font-medium">Week 2 photo uploaded successfully!</p>
        )}
      </div>

      {error && <p className="text-sm text-error-500 font-medium">{error}</p>}
    </div>
  );
};

export default WeekPhoto;
