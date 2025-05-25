export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: string;
  category: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface AnnouncementResponse {
  announcements: Announcement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
