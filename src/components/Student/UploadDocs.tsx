'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/Home/ui/button/Button';
import DropzoneComponent from '@/components/Home/form/form-elements/DropZone';
import { toast } from '../Home/ui/toast/Toast';
import { useSession } from 'next-auth/react';

interface UploadDocsProps {
  onComplete: () => void;
}

const UploadDocs: React.FC<UploadDocsProps> = ({ onComplete }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    Report: false,
    Certificate: false,
    Poster: false,
  });
  const [reportUploaded, setReportUploaded] = useState(false);
  const [certificateUploaded, setCertificateUploaded] = useState(false);
  const [posterUploaded, setPosterUploaded] = useState(false);

  useEffect(() => {
    if (userId) {
      const checkUploadStatus = () => {
        try {
          const storedData = localStorage.getItem('userData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setReportUploaded(!!parsedData.profileData?.report);
            setCertificateUploaded(!!parsedData.profileData?.certificate);
            setPosterUploaded(!!parsedData.profileData?.poster);
          }
        } catch (err) {
          console.error('Error checking upload status:', err);
        }
      };
      checkUploadStatus();
    }
  }, [userId]);

  const handleFileUpload = async (
    folderName: string,
    file: File,
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!userId) {
      setError('User ID not found. Please try logging in again.');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error('File size must be less than 3MB');
      setError('File size must be less than 3MB');
      return;
    }

    setError(null);
    setIsLoading({ ...isLoading, [folderName]: true });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('folderName', folderName);

      const response = await fetch(`/api/student/upload-file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with status: ${response.status}`);
      }

      // Update local state
      setUploaded(true);

      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.profileData = userData.profileData || {};
      userData.profileData[folderName.toLowerCase()] = `${folderName}/${userId}.pdf`;
      localStorage.setItem('userData', JSON.stringify(userData));

      toast.success(`${folderName} uploaded successfully!`);

      // Check if all documents are now uploaded
      const allUploaded =
        (folderName === 'Report' ? true : reportUploaded) &&
        (folderName === 'Certificate' ? true : certificateUploaded) &&
        (folderName === 'Poster' ? true : posterUploaded);

      if (allUploaded) {
        onComplete();
      }
    } catch (err) {
      console.error(`${folderName} upload error:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(`Failed to upload ${folderName}`);
    } finally {
      setIsLoading({ ...isLoading, [folderName]: false });
    }
  };

  const handleReportDrop = (files: File[]) => {
    if (files && files.length > 0) {
      handleFileUpload('Report', files[0], setReportUploaded);
    }
  };

  const handleCertificateDrop = (files: File[]) => {
    if (files && files.length > 0) {
      handleFileUpload('Certificate', files[0], setCertificateUploaded);
    }
  };

  const handlePosterDrop = (files: File[]) => {
    if (files && files.length > 0) {
      handleFileUpload('Poster', files[0], setPosterUploaded);
    }
  };

  const handleSubmit = () => {
    onComplete();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            Upload Report <span className="text-error-500">*</span>
          </h4>
          <div className={reportUploaded ? 'border-2 border-success-500 rounded-xl p-1' : ''}>
            <DropzoneComponent onDrop={handleReportDrop} isLoading={isLoading.Report} title="" />
          </div>
          {reportUploaded && <p className="text-sm text-success-500 font-medium">Report uploaded successfully!</p>}
        </div>

        <div className="space-y-2">
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            Upload NGO Certificate <span className="text-error-500">*</span>
          </h4>
          <div className={certificateUploaded ? 'border-2 border-success-500 rounded-xl p-1' : ''}>
            <DropzoneComponent onDrop={handleCertificateDrop} isLoading={isLoading.Certificate} title="" />
          </div>
          {certificateUploaded && (
            <p className="text-sm text-success-500 font-medium">Certificate uploaded successfully!</p>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            Upload Poster <span className="text-error-500">*</span>
          </h4>
          <div className={posterUploaded ? 'border-2 border-success-500 rounded-xl p-1' : ''}>
            <DropzoneComponent onDrop={handlePosterDrop} isLoading={isLoading.Poster} title="" />
          </div>
          {posterUploaded && <p className="text-sm text-success-500 font-medium">Poster uploaded successfully!</p>}
        </div>

        {error && <p className="text-sm text-error-500 font-medium">{error}</p>}

        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button
            onClick={handleSubmit}
            className="bg-brand-500 hover:bg-brand-600 text-white"
            disabled={!reportUploaded || !certificateUploaded || !posterUploaded}
          >
            Submit All Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocs;
