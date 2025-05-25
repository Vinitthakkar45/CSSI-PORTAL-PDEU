'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { AnnouncementCard } from './AnnouncementCard';
import { AnnouncementForm } from './AnnouncementForm';
import Button from '@/components/Home/ui/button/Button';
import { AlertCircle } from 'lucide-react';

interface Announcement {
  id: number | string;
  description: string;
  created_at: string;
  year: string;
}

export const AnnouncementList = () => {
  const { data: session } = useSession();

  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements from backend API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/getannouncements');
        if (!res.ok) throw new Error('Failed to fetch announcements');
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      } catch (err) {
        setError('Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, [isAddingAnnouncement]); // refetch when a new announcement is added

  // Pagination logic
  const announcementsPerPage = 6;
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);
  const paginatedAnnouncements = announcements.slice(
    (currentPage - 1) * announcementsPerPage,
    currentPage * announcementsPerPage
  );

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Failed to load announcements</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white">Announcements</h2>
        </div>
        {session?.user?.role === 'admin' && (
          <div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddingAnnouncement(true)}
              disabled={isLoading || isAddingAnnouncement}
              className="bg-brand-500 hover:bg-brand-600 text-white"
            >
              Add Announcement
            </Button>
          </div>
        )}
      </div>
      {isAddingAnnouncement && (
        <AnnouncementForm
          onClose={() => setIsAddingAnnouncement(false)}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
        />
      )}

      <div className="grid gap-6">
        {paginatedAnnouncements.length === 0 && !isLoading ? (
          <div className="text-gray-400 text-center py-8">No announcements found.</div>
        ) : (
          paginatedAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            size="sm"
            className="px-3 py-1"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            className="px-3 py-1"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
