'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../Home/ui/table';
import Badge from '../Home/ui/badge/Badge';
import { faculty, user } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';

type FacultyWithUser = {
  faculty: InferSelectModel<typeof faculty>;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

const FacultyTable = () => {
  const [faculties, setFaculties] = useState<FacultyWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaculties() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/faculty');
        const data = await res.json();
        setFaculties(data);
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFaculties();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading faculty data...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Faculty Details</h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-base dark:text-gray-400">
                ID
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
              >
                User Details
              </TableCell>
              <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-base dark:text-gray-400">
                Email
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
              >
                Department
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
              >
                Sitting Location
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
              >
                Available Time Slots
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-base dark:text-gray-400"
              >
                Mentor
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {faculties.map((item) => (
              <TableRow key={item.faculty.id} className="">
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{item.faculty.id}</TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.user.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{item.user.email}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.faculty.department || 'Not Assigned'}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.faculty.sitting || 'Not Assigned'}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.faculty.freeTimeSlots && item.faculty.freeTimeSlots.length > 0
                    ? item.faculty.freeTimeSlots.join(', ')
                    : 'No time slots available'}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={item.user.role === 'admin' ? 'success' : 'warning'}>
                    {item.user.role === 'admin' ? 'Admin' : 'Faculty'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacultyTable;
