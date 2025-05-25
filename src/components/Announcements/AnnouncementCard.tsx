// import { Announcement } from '@/types/announcement';
import { Card, CardHeader } from './cards/Card';
import { Calendar } from 'lucide-react';

interface Announcement {
  id: number | string;
  description: string;
  created_at: string;
  year: string;
  // Add other fields if needed
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gray-100/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-base font-medium text-gray-800 dark:text-white mb-2">{announcement.description}</div>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(announcement.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
