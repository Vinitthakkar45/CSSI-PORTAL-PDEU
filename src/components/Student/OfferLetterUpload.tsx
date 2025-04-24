'use client';
import { useState, useEffect } from 'react';
import ComponentCard from '@/components/Home/common/ComponentCard';
import Button from '@/components/Home/ui/button/Button';
import DropzoneComponent from '@/components/Home/form/form-elements/DropZone';
import { FileCheck } from 'lucide-react';
// import { toast } from 'sonner';

interface OfferLetterUploadProps {
  onComplete: () => void;
  userId: string;
}

const OfferLetterUpload = ({ onComplete, userId }: OfferLetterUploadProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUploadStatus = () => {
      try {
        const localStorageKey = `offerLetterUploaded_${userId}`;
        const storedStatus = localStorage.getItem(localStorageKey);

        fetchUploadStatus();
      } catch (err) {
        console.error('Error checking upload status:', err);
        setIsLoading(false);
      }
    };

    const fetchUploadStatus = async () => {
      try {
        const response = await fetch(`/api/student/uploaded-status?userId=${userId}`);
        const data = await response.json();

        setHasUploadedFile(data.data.offerLetterUploaded);

        if (data.data.offerLetterUploaded) {
          localStorage.setItem(`offerLetterUploaded_${userId}`, 'true');
        }
      } catch (err) {
        console.error('Error fetching upload status:', err);
      } finally {
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

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
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
      localStorage.setItem(`offerLetterUploaded_${userId}`, 'true');
      // toast.success('Offer letter uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      // toast.error('Failed to upload offer letter');
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

          <div className="flex justify-between items-center">
            <Button onClick={onComplete} disabled={!hasUploadedFile} className="w-full md:w-auto">
              Continue
            </Button>
          </div>
        </div>
      )}
    </ComponentCard>
  );
};

export default OfferLetterUpload;
