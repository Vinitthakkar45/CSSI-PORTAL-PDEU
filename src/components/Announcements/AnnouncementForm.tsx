import { useState } from 'react';
import Button from '@/components/Home/ui/button/Button';
import Label from '@/components/Home/form/Label';
import { Loader2, Send, X } from 'lucide-react';

interface Announcement {
  id: number | string;
  description: string;
  created_at: string;
  year: string;
  // Add other fields if needed
}

interface AnnouncementFormProps {
  onClose: () => void;
  announcements?: Announcement[];
  setAnnouncements: (announcements: Announcement[]) => void;
}

export const AnnouncementForm = ({ onClose, announcements, setAnnouncements }: AnnouncementFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      console.error('Description is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/admin/addannouncement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          role: 'admin',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }
      const data = await response.json();
      console.log('Announcement created successfully:', data);
      setAnnouncements([
        {
          id: data.id,
          description,
          created_at: new Date().toISOString(),
          year: new Date().getFullYear().toString(),
        },
        ...(announcements || []),
      ]);
      setDescription('');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleInputChange = (value: string) => {
    setDescription(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto bg-gray-800 dark:bg-gray-800 bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-1">
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </Label>
        <textarea
          id="description"
          className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 min-h-[40px] max-h-[80px] resize-none p-2 text-sm transition"
          value={description}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter announcement description"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          disabled={!description || isSubmitting}
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Add Announcement
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          //   variant="outline"
          className="border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
