'use client';
import { useState, useEffect } from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Button from '@/components/Home/ui/button/Button';
import DropzoneComponent from '@/components/Home/form/form-elements/DropZone';
import { toast } from '../Home/ui/toast/Toast';

interface OfferLetterUploadProps {
  onComplete: () => void;
  userId: string;
}

const OfferLetterUpload = ({ onComplete, userId }: OfferLetterUploadProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localStorageKey = `userData`;
  useEffect(() => {
    const checkUploadStatus = () => {
      try {
        const storedData = localStorage.getItem(localStorageKey);

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.profileData.offerLetter !== '') setHasUploadedFile(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error checking upload status:', err);
        setIsLoading(false);
      }
    };

    if (userId) {
      checkUploadStatus();
    }
  }, [userId]);

  const handleFileDrop = async (files: File[]) => {
    if (!files || files.length === 0) {
      setError('Please select a file');
      return;
    }

    const file = files[0];

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setError('File size must be less than 1MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('folderName', 'OfferLetter');

      const response = await fetch('/api/student/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
      }

      setHasUploadedFile(true);
      const userData = JSON.parse(localStorage.getItem(localStorageKey) || '{}');
      userData.profileData = userData.profileData || {};
      userData.profileData.offerLetter = file.name;
      localStorage.setItem(localStorageKey, JSON.stringify(userData));

      onComplete();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      toast.error('Failed to upload offer letter');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ComponentCard title="Offer Letter Upload">
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`space-y-2 ${isUploading ? 'opacity-50' : ''}`}>
            <div className={hasUploadedFile ? 'border-2 border-success-500 rounded-xl p-1' : ''}>
              <DropzoneComponent onDrop={handleFileDrop} isLoading={isUploading} title="" />
            </div>
            {error && <p className="text-sm text-error-500 font-medium">{error}</p>}
          </div>
        </div>
      )}
    </ComponentCard>
  );
};

export default OfferLetterUpload;
