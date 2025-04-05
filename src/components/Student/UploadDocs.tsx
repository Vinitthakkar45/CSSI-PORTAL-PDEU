'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/Home/ui/button/Button';
import DropzoneComponent from '@/components/Home/form/form-elements/DropZone';

interface UploadDocsProps {
  onComplete: () => void;
}

const UploadDocs: React.FC<UploadDocsProps> = ({ onComplete }) => {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();
      setUserId(sessionData.user.id.toString());
    };

    fetchSession();
  }, []);

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
      const fetchStatusLocalStorage = () => {
        try {
          const localStorageKey = `docsStatus_${userId}`;
          const storedData = localStorage.getItem(localStorageKey);

          if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log(parsedData);
            setReportUploaded(parsedData.reportUploaded);
            setCertificateUploaded(parsedData.certificateUploaded);
            setPosterUploaded(parsedData.posterUploaded);
            return true;
          }
          return false;
        } catch (err) {
          console.error('Error fetching uploaded status from local Storage:', err);
          return false;
        }
      };
      const fetchUploadedStatus = async () => {
        try {
          const response = await fetch(`/api/student/uploaded-status?userId=${userId}`);
          const data = await response.json();
          setReportUploaded(data.data.reportUploaded);
          setCertificateUploaded(data.data.certificateUploaded);
          setPosterUploaded(data.data.posterUploaded);
          localStorage.setItem(
            `docsStatus_${userId}`,
            JSON.stringify({
              reportUploaded: data.data.reportUploaded,
              certificateUploaded: data.data.certificateUploaded,
              posterUploaded: data.data.posterUploaded,
            })
          );
        } catch (err) {
          console.error('Error fetching uploaded status:', err);
        }
      };
      if (fetchStatusLocalStorage()) return;
      fetchUploadedStatus();
    }
  }, [userId]);

  const handleFileUpload = async (
    folderName: string,
    file: File,
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    console.log('User ID:', userId);
    console.log('File:', file);
    setError(null);
    setIsLoading({ ...isLoading, [folderName]: true });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId!);
      formData.append('folderName', folderName);

      const response = await fetch(`/api/student/upload-file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`${folderName} upload successful:`, data);
      setUploaded(true);
      // toast.success(`${folderName} uploaded successfully!`);
    } catch (err) {
      console.error(`${folderName} upload error:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading({ ...isLoading, [folderName]: false });
    }
  };

  const handleReportDrop = (files: File[]) => {
    handleFileUpload('Report', files[0], setReportUploaded);
  };

  const handleCertificateDrop = (files: File[]) => {
    handleFileUpload('Certificate', files[0], setCertificateUploaded);
  };

  const handlePosterDrop = (files: File[]) => {
    handleFileUpload('Poster', files[0], setPosterUploaded);
  };

  const handleSubmit = () => {
    // if (!reportUploaded || !certificateUploaded || !posterUploaded) {
    // toast.error("Please upload all required documents!");
    //   return;
    // }

    onComplete();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-5 text-gray-800 dark:text-white/90">Submit Report and Documents</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            Upload Report <span className="text-error-500">*</span>
          </h4>
          <div className={reportUploaded ? 'border-2 border-success-500 rounded-xl p-1' : ''}>
            <DropzoneComponent onDrop={handleReportDrop} isLoading={isLoading.Report} />
          </div>
          {reportUploaded && <p className="text-sm text-success-500 font-medium">Report uploaded successfully!</p>}
          {error && <p className="text-sm text-error-500 font-medium">{error}</p>}
        </div>

        <div className="space-y-2">
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            Upload NGO Certificate <span className="text-error-500">*</span>
          </h4>
          <div className={certificateUploaded ? 'border-2 border-success-500 rounded-xl p-1' : ''}>
            <DropzoneComponent onDrop={handleCertificateDrop} isLoading={isLoading.Certificate} />
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
            <DropzoneComponent onDrop={handlePosterDrop} isLoading={isLoading.Poster} />
          </div>
          {posterUploaded && <p className="text-sm text-success-500 font-medium">Poster uploaded successfully!</p>}
        </div>

        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button
            onClick={handleSubmit}
            className="bg-brand-500 hover:bg-brand-600 text-white"
            // disabled={!reportUploaded || !certificateUploaded || !posterUploaded}
          >
            Submit All Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocs;
