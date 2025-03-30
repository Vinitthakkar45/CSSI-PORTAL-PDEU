import React, { useState } from 'react';
import Button from '@/components/Home/ui/button/Button';
import DropzoneComponent from '@/components/Home/form/form-elements/DropZone';

interface ReportSubmissionProps {
  onComplete: () => void;
}

const ReportSubmission: React.FC<ReportSubmissionProps> = ({ onComplete }) => {
  const [reportUploaded, setReportUploaded] = useState(false);
  const [certificateUploaded, setCertificateUploaded] = useState(false);
  const [posterUploaded, setPosterUploaded] = useState(false);

  const handleReportDrop = (files: File[]) => {
    console.log('Report files:', files);
    setReportUploaded(true);
    // toast.success("Report uploaded successfully!");
  };

  const handleCertificateDrop = (files: File[]) => {
    console.log('Certificate files:', files);
    setCertificateUploaded(true);
    // toast.success("Certificate uploaded successfully!");
  };

  const handlePosterDrop = (files: File[]) => {
    console.log('Poster files:', files);
    setPosterUploaded(true);
    // toast.success("Poster uploaded successfully!");
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
            <DropzoneComponent onDrop={handleReportDrop} />
          </div>
          {reportUploaded && <p className="text-sm text-success-500 font-medium">Report uploaded successfully!</p>}
        </div>

        <div className="space-y-2">
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            Upload NGO Certificate <span className="text-error-500">*</span>
          </h4>
          <div className={certificateUploaded ? 'border-2 border-success-500 rounded-xl p-1' : ''}>
            <DropzoneComponent onDrop={handleCertificateDrop} />
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
            <DropzoneComponent onDrop={handlePosterDrop} />
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

export default ReportSubmission;
