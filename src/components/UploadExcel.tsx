'use client';
import { useState, useRef } from 'react';
import Button from '@/components/Home/ui/button/Button';
import { toast } from '@/components/Home/ui/toast/Toast';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

type UploadExcelProps = {
  onSuccess?: () => void;
  type?: 'student' | 'faculty';
  title?: string;
};

export default function UploadExcel({ onSuccess, type = 'student', title }: UploadExcelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.length) {
      toast.error('Please select an Excel file to upload');
      return;
    }

    const file = fileInputRef.current.files[0];
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = type === 'student' ? '/api/uploadExcel/student' : '/api/uploadExcel/faculty';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to upload ${type} data`);
      }

      // Build a comprehensive message
      let successMessage = result.message;

      if (result.details) {
        successMessage += ' ' + result.details;
      }

      if (result.skippedMessage) {
        successMessage += ' ' + result.skippedMessage;
      }

      toast.success(successMessage);

      // Show error summary in a separate toast if there are errors
      if (result.errorSummary) {
        toast.error(result.errorSummary);
      }

      setFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : `Failed to upload ${type} data`);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const displayTitle = title || (type === 'student' ? 'Upload Student Data' : 'Upload Faculty Data');
  const entityName = type === 'student' ? 'student' : 'faculty';

  return (
    <div className="relative space-y-4">
      {isUploading && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <p className="text-gray-700 dark:text-gray-300">Uploading {entityName} data...</p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{displayTitle}</h3>
      </div>

      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50">
        <FileSpreadsheet className="w-12 h-12 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          {fileName ? fileName : 'Click to select an Excel file'}
        </p>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.xls" className="hidden" />
        <div className="flex gap-3 mt-4">
          <Button onClick={triggerFileInput} variant="outline">
            Select File
          </Button>
          <Button onClick={handleUpload} disabled={!fileName || isUploading} className="flex items-center gap-2">
            <Upload size={16} />
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
